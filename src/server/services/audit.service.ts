import "server-only";

import { prisma } from "@/server/db/prisma";

// SOT: audit service, logAction, AuditLog, fire-and-forget, write-only
// WHAT: Inserts an AuditLog row recording who did what to which resource; catches all errors and never throws.
// WHY: Without error isolation, a database outage in the audit table could break the user's request that triggered the audit.
// HOW: Imports "server-only"; calls prisma.auditLog.create in try/catch; logs errors to console but returns void.
// WHERE: Called by audit-usage.ts middleware after successful mutation.

export async function logAction(params: {
  userId: string;
  organizationId: string;
  action: string;
  resource: string;
  resourceId?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        organizationId: params.organizationId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId ?? null,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
