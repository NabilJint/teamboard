import "server-only";

import { prisma } from "@/server/db/prisma";

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
