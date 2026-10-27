import { prisma } from "@/server/db/prisma";
import { type ResourceKey } from "@/server/resources";

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
