import type { Plan, Role } from "../generated/prisma/client";

// SOT: resources, RESOURCES, plan limits, permissions, single source of truth
// WHAT: Exports RESOURCES object with plan limits (FREE/PRO) and role-based permission maps for project and member resources.
// WHY: Without a single source of truth, plan limits and permissions could diverge between server middleware and future client-side feature gates.
// HOW: Plan type comes from Prisma enum (not declared locally); exports Plan and ResourceKey types shared by rules.ts and middleware.
// WHERE: Imported by rules.ts, plan-gate.ts, permission.ts, and project.router.ts.

export const RESOURCES = {
  project: {
    FREE: 1,
    PRO: Infinity,
    permissions: {
      OWNER: ["project.create", "project.update", "project.delete"],
      ADMIN: ["project.create", "project.update", "project.delete"],
      MEMBER: [],
    },
    upgradeMessage: "FREE plan allows 1 project. Upgrade to PRO.",
  },
  member: {
    FREE: 3,
    PRO: Infinity,
    upgradeMessage: "FREE plan allows 3 members. Upgrade to PRO.",
  },
  task: {
    FREE: 5,
    PRO: Infinity,
    permissions: {
      OWNER: ["task.create", "task.update", "task.delete"],
      ADMIN: ["task.create", "task.update", "task.delete"],
      MEMBER: ["task.create", "task.update"],
    },
    upgradeMessage: "FREE plan allows 5 tasks per organization. Upgrade to PRO.",
  },
} as const;

export type ResourceKey = keyof typeof RESOURCES;
export type { Plan, Role };
