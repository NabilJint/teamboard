import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type Context } from "@/server/trpc/context";

// GAP: Phase 6 — real role gate here; needs membership from tenant middleware.
export const roleMiddleware = t.middleware(async ({ ctx, next }) => {
  throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Phase 6" });
  // When implemented:
  // if (!(ctx.tenant.role === "OWNER" || ctx.tenant.role === "ADMIN")) {
  //   throw new TRPCError({ code: "FORBIDDEN", message: "Admin required" });
  // }
  // return next();
});
