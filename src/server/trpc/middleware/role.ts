import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type Context } from "@/server/trpc/context";

export const roleMiddleware = t.middleware(async ({ ctx, next }) => {
  throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Phase 6" });
});
