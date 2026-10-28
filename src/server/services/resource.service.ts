import "server-only";

import { prisma } from "@/server/db/prisma";
import { type ResourceKey } from "@/server/resources";

// SOT: resource service, countResource, DB reads, counts
// WHAT: Counts existing projects or memberships for an organization; used by plan-gate to enforce quotas.
// WHY: Without centralized count logic, each router would write its own Prisma count queries and risk inconsistent tenant scoping.
// HOW: Imports "server-only"; switches on resource key to call prisma.project.count or prisma.membership.count with organizationId filter.
// WHERE: Called by plan-gate.ts (createPlanGate) to check plan limits before allowing creation.

export async function countResource(
  resource: ResourceKey,
  organizationId: string,
): Promise<number> {
  switch (resource) {
    case "project":
      return prisma.project.count({ where: { organizationId } });
    case "member":
      return prisma.membership.count({ where: { organizationId } });
    default:
      throw new Error(`Unhandled resource: ${resource}`);
  }
}
