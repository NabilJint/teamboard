import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type ResourceKey, RESOURCES } from "@/server/resources";
import { type Role } from "@/generated/prisma/client";
import { getMembershipRole } from "@/server/services/membership.service";

// GAP: Phase 6 — replace with ctx.tenant.organizationId after tenant middleware lands
export function createPermissionGate(resource: ResourceKey, permission: string) {
  return t.middleware(async ({ ctx, next }) => {
    const organizationId = ctx.headers.get("x-organization-id");
    if (!organizationId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
    }

    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    const role = await getMembershipRole(ctx.user.id, organizationId);
    if (!role) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this organization" });
    }

    const permissions =
      (RESOURCES[resource] as { permissions?: Record<Role, string[]> })?.permissions?.[role] ??
      [];
    if (!permissions.includes(permission)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
    }

    return next();
  });
}
