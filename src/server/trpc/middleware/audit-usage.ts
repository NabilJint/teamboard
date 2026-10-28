import { t } from "@/server/trpc/init";
import { logAction } from "@/server/services/audit.service";
import { incrementUsage } from "@/server/services/usage.service";
import { type ResourceKey } from "@/server/resources";

export function createAuditUsage(action: string, resource: ResourceKey) {
  return t.middleware(async ({ ctx, next }) => {
    // Run resolver first — audit only fires on success
    const result = await next();

    // ctx.tenant is guaranteed — auditedProcedure chains orgProcedure
    if (!ctx.tenant) {
      // Resolver succeeded but no tenant — shouldn't happen. Log and continue.
      console.error("audit-usage: no ctx.tenant, skipping audit");
      return result;
    }

    // Extract id from result.data if present
    const data = (result as { ok?: boolean; data?: { id?: string } }).data;
    const resourceId = data?.id ?? null;

    // Fire-and-forget — services swallow their own errors
    await logAction({
      userId: ctx.tenant.userId,
      organizationId: ctx.tenant.organizationId,
      action,
      resource,
      resourceId,
    });

    await incrementUsage({
      organizationId: ctx.tenant.organizationId,
      resource,
    });

    return result;
  });
}
