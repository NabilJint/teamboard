import type { Plan, ResourceKey } from "@/server/resources";

export function canCreate(resource: ResourceKey, plan: Plan, currentCount: number): boolean {
  const limits: Record<ResourceKey, Record<Plan, number>> = {
    project: { FREE: 1, PRO: Infinity },
    member: { FREE: 3, PRO: Infinity },
  };
  return currentCount < limits[resource][plan];
}

export function getUpgradeMessage(resource: ResourceKey): string {
  const messages: Record<ResourceKey, string> = {
    project: "FREE plan allows 1 project. Upgrade to PRO.",
    member: "FREE plan allows 3 members. Upgrade to PRO.",
  };
  return messages[resource];
}
