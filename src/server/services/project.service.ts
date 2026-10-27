import "server-only";

import { prisma } from "@/server/db/prisma";
import { mapDomainError } from "@/server/errors";

// GAP: Phase 2 — plan/role checks move to rules.ts.
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
