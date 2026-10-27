import "server-only";

import { prisma } from "@/server/db/prisma";

export async function incrementUsage(params: {
  organizationId: string;
  resource: string;
}): Promise<void> {
  try {
    await prisma.usage.upsert({
      where: { organizationId_resource: { organizationId: params.organizationId, resource: params.resource } },
      update: { count: { increment: 1 } },
      create: { organizationId: params.organizationId, resource: params.resource, count: 1 },
    });
  } catch (error) {
    console.error("Usage increment failed:", error);
  }
}

export async function getUsage(params: {
  organizationId: string;
  resource: string;
}): Promise<number> {
  try {
    const usage = await prisma.usage.findUnique({
      where: { organizationId_resource: { organizationId: params.organizationId, resource: params.resource } },
      select: { count: true },
    });
    return usage?.count ?? 0;
  } catch (error) {
    console.error("Usage read failed:", error);
    return 0;
  }
}
