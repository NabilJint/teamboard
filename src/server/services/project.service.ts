import "server-only";

import { prisma } from "@/server/db/prisma";
import { mapDomainError } from "@/server/errors";

// SOT: project service, createProject, listProjects, TenantScope, DB writes
// WHAT: Creates and lists Project rows with tenant scoping; the only service allowed to write to the projects table.
// WHY: Without a service layer, routers would import Prisma directly and bypass tenant isolation, risking cross-org data leaks.
// HOW: Imports "server-only"; uses Prisma client with organizationId scoping on every query; wraps errors via mapDomainError.
// WHERE: Called by project.create (via gatedAuditedProcedure → planGatedProcedure → orgProcedure) and project.list (via orgProcedure). The service itself doesn't know about the Block; it only sees a TenantScope.

export interface TenantScope {
  organizationId: string;
  userId: string;
}

export async function createProject(
  input: { name: string; description?: string },
  scope: TenantScope,
) {
  try {
    return await prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        organizationId: scope.organizationId,
        ownerId: scope.userId,
      },
    });
  } catch (error) {
    throw mapDomainError(error);
  }
}

export async function listProjects(scope: TenantScope) {
  return prisma.project.findMany({
    where: { organizationId: scope.organizationId },
  });
}
