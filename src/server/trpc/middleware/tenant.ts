import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { getMembershipRole } from "@/server/services/membership.service";
import { prisma } from "@/server/db/prisma";

// SOT: tenant, organization, membership, organizationId, multi-tenant isolation
// WHAT: Validates x-organization-id header, looks up user membership, and sets ctx.tenant with orgId, userId, role, plan.
// WHY: Without this, a user could supply any organization ID and access cross-org data belonging to other tenants.
// HOW: Reads x-organization-id header; calls getMembershipRole(userId, orgId); queries Prisma for org plan; narrows ctx via next({ ctx }).
// WHERE: Called by orgProcedure after auth; required by permission, plan-gate, and audit-usage middleware.

// GAP: refactor — move org lookup to organization.service in a future phase
export const tenantMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  const organizationId = ctx.headers.get("x-organization-id");
  if (!organizationId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
  }

  const role = await getMembershipRole(ctx.user.id, organizationId);
  if (!role) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not a member of this organization",
    });
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { plan: true },
  });
  if (!org) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
  }

  return next({
    ctx: {
      ...ctx,
      tenant: { organizationId, userId: ctx.user.id, role, plan: org.plan },
    },
  });
});
