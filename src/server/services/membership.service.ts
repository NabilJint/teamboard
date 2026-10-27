import "server-only";

import { prisma } from "@/server/db/prisma";
import { type Role } from "@/generated/prisma/client";

export async function getMembershipRole(
  userId: string,
  organizationId: string,
): Promise<Role | null> {
  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    select: { role: true },
  });
  return membership?.role ?? null;
}
