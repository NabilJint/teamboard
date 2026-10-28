import "server-only";

import { prisma } from "@/server/db/prisma";
import { type Role } from "@/generated/prisma/client";

// SOT: membership service, getMembershipRole, role lookup, DB read
// WHAT: Looks up a user's role within an organization from the Membership table.
// WHY: Without this lookup, tenantMiddleware could not verify that a user actually belongs to the org they claim.
// HOW: Imports "server-only"; queries prisma.membership.findUnique with userId+organizationId; returns Role or null.
// WHERE: Called by tenantMiddleware (getMembershipRole) and permission middleware (role lookup).

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
