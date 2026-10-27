import { t } from "@/server/trpc/init";
import { protectedProcedure, planGatedProcedure, permissionedProcedure, rateLimitedProcedure, gatedAuditedProcedure, orgProcedure } from "@/server/trpc/procedures";
import { projectSchema } from "@/lib/validators/project.schema";
import { createProject, listProjects, type TenantScope } from "@/server/services/project.service";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const projectRouter = t.router({
  create: gatedAuditedProcedure("project", "project.create")
    .input(projectSchema)
    .mutation(async ({ ctx, input }) => {
      // GAP: Phase 6 — replace with ctx.tenant.organizationId after orgProcedure is wired.
      const organizationId = ctx.headers.get("x-organization-id");
      if (!organizationId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
      }

      const scope: TenantScope = {
        organizationId,
        userId: ctx.user!.id,
      };

      return createProject(input, scope);
    }),

  list: orgProcedure.query(async ({ ctx }) => {
    const scope: TenantScope = {
      organizationId: ctx.tenant!.organizationId,
      userId: ctx.tenant!.userId,
    };

    return listProjects(scope);
  }),

  update: permissionedProcedure("project", "project.update")
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx }) => {
      // GAP: Phase 6 — replace with ctx.tenant.organizationId after orgProcedure is wired.
      const organizationId = ctx.headers.get("x-organization-id");
      if (!organizationId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
      }
      return { message: "update placeholder" };
    }),

  ping: rateLimitedProcedure(3, 60_000).query(() => ({
    ok: true,
    timestamp: Date.now(),
  })),
});
