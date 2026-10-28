import { t } from "@/server/trpc/init";
import { getSession } from "@/server/auth/session";
import { TRPCError } from "@trpc/server";
import { type Context } from "@/server/trpc/context";

// SOT: auth, session, getSession, authentication, middleware
// WHAT: Validates the request session via getSession stub and sets ctx.user for downstream middleware.
// WHY: Without this, unauthenticated requests could reach feature resolvers and access data they shouldn't.
// HOW: Calls getSession(ctx.headers); throws UNAUTHORIZED if no session; narrows ctx.user to required via next({ ctx }).
// WHERE: Base of every org-scoped procedure chain. protectedProcedure is the root, and orgProcedure + all its variants extend it. Every authenticated request passes through here first.

// SIT-1 STUB: replace in Phase 2 with Better Auth's getSession({ headers }).
export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const session = await getSession(ctx.headers);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthenticated" });
  }
  return next({ ctx: { ...ctx, user: session.user } }); // user now required downstream
});
