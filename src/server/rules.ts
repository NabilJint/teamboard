// GAP: Phase 2 — plan/role rules will live here.
// Free plan: 1 project, 3 members (owner counts toward the 3).
// Roles: OWNER / ADMIN / MEMBER.
// Plans: FREE / PRO.
// Only OWNER/ADMIN can create projects. MEMBER can create tasks.

export const PLAN_LIMITS = {
  FREE: { maxProjects: 1, maxMembers: 3 },
  PRO: { maxProjects: Infinity, maxMembers: Infinity },
} as const;

export type Plan = "FREE" | "PRO";
export type Role = "OWNER" | "ADMIN" | "MEMBER";
