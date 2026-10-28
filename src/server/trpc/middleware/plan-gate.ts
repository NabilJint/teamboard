import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type ResourceKey } from "@/server/resources";
import { canCreate, getUpgradeMessage } from "@/server/rules";
import { countResource } from "@/server/services/resource.service";

// SOT: plan, FREE, PRO, plan limit, quota, billing enforcement
// WHAT: Enforces free plan limits (1 project, 3 members) by counting existing resources against plan limits.
// WHY: Without this, a FREE org could create unlimited projects and exceed the paid-tier quota.
// HOW: Reads ctx.tenant.plan from tenantMiddleware; calls countResource; throws FORBIDDEN if count >= limit.
// WHERE: Wrapped by planGatedProcedure factory; used by project.create via gatedAuditedProcedure.

export function createPlanGate(resource: ResourceKey) {
  return t.middleware(async ({ ctx, next }) => {
    // ctx.tenant is guaranteed — planGatedProcedure chains orgProcedure
    if (!ctx.tenant) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "plan gate requires tenant context",
      });
    }

    const count = await countResource(resource, ctx.tenant.organizationId);

    if (!canCreate(resource, ctx.tenant.plan, count)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: getUpgradeMessage(resource),
      });
    }

    return next();
  });
}
