import type { Plan } from "../generated/prisma/client";

export const RESOURCES = {
  project: {
    FREE: 1,
    PRO: Infinity,
    upgradeMessage: "FREE plan allows 1 project. Upgrade to PRO.",
  },
  member: {
    FREE: 3,
    PRO: Infinity,
    upgradeMessage: "FREE plan allows 3 members. Upgrade to PRO.",
  },
} as const;

export type ResourceKey = keyof typeof RESOURCES;
export type { Plan };
