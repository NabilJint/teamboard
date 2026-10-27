import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type Context } from "@/server/trpc/context";

// GAP: Phase 6 — real membership lookup here.
// organizationId comes only from ctx.tenant, never router input.
export const tenantMiddleware = t.middleware(async ({ ctx, next }) => {
  throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Phase 6" });
  // When implemented:
  // return next({ ctx: { ...ctx, tenant: { organizationId, userId, role, plan } } });
});
