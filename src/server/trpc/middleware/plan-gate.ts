import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type Plan, type ResourceKey } from "@/server/resources";
import { canCreate, getUpgradeMessage } from "@/server/rules";
import { countResource } from "@/server/services/resource.service";
import { type Context } from "@/server/trpc/context";

// GAP: Phase 6 — replace with ctx.tenant.plan after tenant middleware lands
export function createPlanGate(resource: ResourceKey) {
  return t.middleware(async ({ ctx, next }) => {
    const plan = (ctx.headers.get("x-plan") ?? "FREE") as Plan;

    const organizationId = ctx.headers.get("x-organization-id");
    if (!organizationId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
    }

    const count = await countResource(resource, organizationId);

    if (!canCreate(resource, plan, count)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: getUpgradeMessage(resource),
      });
    }

    return next({ ctx: { ...ctx, plan } });
  });
}
