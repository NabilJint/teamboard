import { t } from "@/server/trpc/init";
import { getSession } from "@/server/auth/session";
import { TRPCError } from "@trpc/server";
import { type Context } from "@/server/trpc/context";

// SIT-1 STUB: replace in Phase 2 with Better Auth's getSession({ headers }).
export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getSession(ctx.headers);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthenticated" });
  }
  return next({ ctx: { ...ctx, user: session.user } }); // user now required downstream
});
