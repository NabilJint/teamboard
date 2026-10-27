import { t, publicProcedure } from "@/server/trpc/init";
import { type Context } from "@/server/trpc/context";
import { authMiddleware } from "@/server/trpc/middleware/auth";
import { tenantMiddleware } from "@/server/trpc/middleware/tenant";
import { roleMiddleware } from "@/server/trpc/middleware/role";

export const protectedProcedure = t.procedure.use(authMiddleware);
export const orgProcedure = protectedProcedure.use(tenantMiddleware);
export const adminProcedure = orgProcedure.use(roleMiddleware);

export type RouterContext = Context;
