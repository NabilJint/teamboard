import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { type ResourceKey } from "@/server/resources";
import { incrementUsage } from "@/server/services/usage.service";
import { logAction } from "@/server/services/audit.service";

// GAP: Phase 6 — replace with ctx.tenant.organizationId after tenant middleware lands
export function createAuditUsage(action: string, resource: ResourceKey) {
  return t.middleware(async ({ ctx, next }) => {
    const result = await next();

    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    const organizationId = ctx.headers.get("x-organization-id");
    if (!organizationId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
    }

    const data = (result as { ok?: boolean; data?: { id?: string } }).data;
    const resourceId = data?.id ?? null;

    await logAction({
      userId: ctx.user.id,
      organizationId,
      action,
      resource,
      resourceId,
    });

    await incrementUsage({ organizationId, resource });

    return result;
  });
}
