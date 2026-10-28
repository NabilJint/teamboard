import { t, publicProcedure } from "@/server/trpc/init";
import { type Context } from "@/server/trpc/context";
import { authMiddleware } from "@/server/trpc/middleware/auth";
import { tenantMiddleware } from "@/server/trpc/middleware/tenant";
import { roleMiddleware } from "@/server/trpc/middleware/role";
import { createPlanGate } from "@/server/trpc/middleware/plan-gate";
import { createPermissionGate } from "@/server/trpc/middleware/permission";
import { createRateLimit } from "@/server/trpc/middleware/rate-limit";
import { createAuditUsage } from "@/server/trpc/middleware/audit-usage";
import { type ResourceKey } from "@/server/resources";

// SOT: tRPC, procedures, router context, middleware composition, THE BLOCK
// WHAT: Exports procedure factories (public, protected, org, planGated, permissioned, rateLimited, audited, gatedAudited) that compose the middleware chain.
// WHY: Without this central composition point, each router would re-implement middleware wiring inconsistently.
// HOW: Each factory composes t.procedure.use() calls, adding one middleware layer at a time. orgProcedure = protected + tenant. permissioned/planGated = orgProcedure + their gate. gatedAudited = planGated + audit. Order varies by factory — never assume all six run for every route.
// WHERE: Imported by project.router.ts and health.router.ts to build typed tRPC routers.

export const protectedProcedure = t.procedure.use(authMiddleware);
export const orgProcedure = protectedProcedure.use(tenantMiddleware);
export const adminProcedure = orgProcedure.use(roleMiddleware);

export const planGatedProcedure = (resource: ResourceKey) =>
  orgProcedure.use(createPlanGate(resource));

export const permissionedProcedure = (
  resource: ResourceKey,
  permission: string,
) => orgProcedure.use(createPermissionGate(resource, permission));

export const rateLimitedProcedure = (max: number, windowMs: number) =>
  protectedProcedure.use(createRateLimit(max, windowMs));

export const auditedProcedure = (action: string, resource: ResourceKey) =>
  orgProcedure.use(createAuditUsage(action, resource));

export const gatedAuditedProcedure = (resource: ResourceKey, action: string) =>
  planGatedProcedure(resource).use(createAuditUsage(action, resource));

export type RouterContext = Context;
