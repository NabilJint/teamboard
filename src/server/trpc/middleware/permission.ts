import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type ResourceKey, RESOURCES } from "@/server/resources";

export function createPermissionGate(resource: ResourceKey, permission: string) {
  return t.middleware(async ({ ctx, next }) => {
    // ctx.tenant is guaranteed — permissionedProcedure chains orgProcedure
    // (via protectedProcedure + tenantMiddleware) so tenant always exists.
    if (!ctx.tenant) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "permission gate requires tenant context",
      });
    }

    const permissions =
      (RESOURCES[resource] as { permissions?: Record<string, string[]> })?.permissions?.[
        ctx.tenant.role
      ] ?? [];
    if (!permissions.includes(permission)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
    }

    return next();
  });
}
