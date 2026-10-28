import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type ResourceKey, RESOURCES } from "@/server/resources";

// SOT: permission, role, FORBIDDEN, authorization, access control
// WHAT: Checks that ctx.tenant.role has the required permission from RESOURCES[resource].permissions[role].
// WHY: Without this, a MEMBER could call project.update or other admin-only actions they aren't authorized for.
// HOW: Reads ctx.tenant.role set by tenantMiddleware; looks up permissions map; throws FORBIDDEN if permission missing.
// WHERE: Wrapped by permissionedProcedure factory; used by project.update resolver.

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
