import "server-only";

import { prisma } from "@/server/db/prisma";
import { DomainError, mapDomainError } from "@/server/errors";
import { type CommentCreateInput } from "@/lib/validators/comment.schema";

export interface TenantScope {
  organizationId: string;
  userId: string;
}

// SOT: comment service, createComment, listComments, org-scoped DB writes
// WHAT: Creates and lists Comment rows with organization scoping; the only service allowed to write to the comments table.
// WHY: Without a service layer, routers would import Prisma directly and bypass tenant isolation, risking cross-org data leaks.
// HOW: Imports "server-only"; verifies taskId belongs to the caller's org before writing; scopes every query by organizationId; wraps errors via mapDomainError.
// WHERE: Called by comment.create (gatedAuditedProcedure) and comment.list (orgProcedure). The service itself doesn't know about the Block; it only sees a TenantScope.

export async function createComment(
  input: CommentCreateInput,
  scope: TenantScope,
) {
  try {
    // FIX 1: integrity check — task must belong to the same org.
    // The Block can't catch cross-org taskId; this is a service-layer guard.
    const task = await prisma.task.findFirst({
      where: { id: input.taskId, organizationId: scope.organizationId },
      select: { id: true },
    });
    if (!task) {
      throw new DomainError("NOT_FOUND", "Task not found in this organization");
    }

    return await prisma.comment.create({
      data: {
        content: input.content,
        taskId: input.taskId,
        organizationId: scope.organizationId,
      },
    });
  } catch (error) {
    throw mapDomainError(error);
  }
}

export async function listComments(scope: TenantScope) {
  return prisma.comment.findMany({
    where: { organizationId: scope.organizationId },
    orderBy: { createdAt: "desc" },
  });
}
