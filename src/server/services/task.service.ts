import "server-only";

import { prisma } from "@/server/db/prisma";
import { DomainError, mapDomainError } from "@/server/errors";
import { TaskStatus } from "@/generated/prisma/client";
import { type TaskCreateInput } from "@/lib/validators/task.schema";

export interface TenantScope {
  organizationId: string;
  userId: string;
}

// SOT: task service, createTask, listTasks, org-scoped DB writes
// WHAT: Creates and lists Task rows with organization scoping; the only service allowed to write to the tasks table.
// WHY: Without a service layer, routers would import Prisma directly and bypass tenant isolation, risking cross-org data leaks.
// HOW: Imports "server-only"; verifies projectId belongs to the caller's org before writing; scopes every query by organizationId; wraps errors via mapDomainError.
// WHERE: Called by task.create (gatedAuditedProcedure) and task.list (orgProcedure). The service itself doesn't know about the Block; it only sees a TenantScope.

export async function createTask(
  input: TaskCreateInput,
  scope: TenantScope,
) {
  try {
    // FIX 1: integrity check — project must belong to the same org.
    // The Block can't catch cross-org projectId; this is a service-layer guard.
    const project = await prisma.project.findFirst({
      where: { id: input.projectId, organizationId: scope.organizationId },
      select: { id: true },
    });
    if (!project) {
      throw new DomainError("NOT_FOUND", "Project not found in this organization");
    }

    return await prisma.task.create({
      data: {
        title: input.title,
        status: input.status ?? TaskStatus.TODO,
        projectId: input.projectId,
        organizationId: scope.organizationId,
        assigneeId: input.assigneeId ?? null,
      },
    });
  } catch (error) {
    throw mapDomainError(error);
  }
}

export async function listTasks(scope: TenantScope) {
  return prisma.task.findMany({
    where: { organizationId: scope.organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
    },
  });
}
