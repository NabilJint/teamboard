import type { Plan, ResourceKey } from "@/server/resources";

// SOT: rules, canCreate, getUpgradeMessage, pure functions, plan logic
// WHAT: Pure functions canCreate and getUpgradeMessage with no Prisma, no tRPC, and no side effects.
// WHY: Pure logic can run on server or client and is fully testable without mocking database or tRPC dependencies.
// HOW: Takes resource, plan, and count as arguments; returns boolean or message string; imports only type definitions from resources.ts.
// WHERE: Imported by plan-gate.ts to enforce plan limits on project creation.

export function canCreate(resource: ResourceKey, plan: Plan, currentCount: number): boolean {
  const limits: Record<ResourceKey, Record<Plan, number>> = {
    project: { FREE: 1, PRO: Infinity },
    member: { FREE: 3, PRO: Infinity },
    task: { FREE: 5, PRO: Infinity },
  };
  return currentCount < limits[resource][plan];
}

export function getUpgradeMessage(resource: ResourceKey): string {
  const messages: Record<ResourceKey, string> = {
    project: "FREE plan allows 1 project. Upgrade to PRO.",
    member: "FREE plan allows 3 members. Upgrade to PRO.",
    task: "FREE plan allows 5 tasks per organization. Upgrade to PRO.",
  };
  return messages[resource];
}
