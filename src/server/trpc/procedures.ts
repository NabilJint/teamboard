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

export const protectedProcedure = t.procedure.use(authMiddleware);
export const orgProcedure = protectedProcedure.use(tenantMiddleware);
export const adminProcedure = orgProcedure.use(roleMiddleware);

export const planGatedProcedure = (resource: ResourceKey) =>
  protectedProcedure.use(createPlanGate(resource));

export const permissionedProcedure = (
  resource: ResourceKey,
  permission: string,
) => orgProcedure.use(createPermissionGate(resource, permission));

export const rateLimitedProcedure = (max: number, windowMs: number) =>
  protectedProcedure.use(createRateLimit(max, windowMs));

export const auditedProcedure = (action: string, resource: ResourceKey) =>
  protectedProcedure.use(createAuditUsage(action, resource));

export const gatedAuditedProcedure = (resource: ResourceKey, action: string) =>
  planGatedProcedure(resource).use(createAuditUsage(action, resource));

export type RouterContext = Context;
