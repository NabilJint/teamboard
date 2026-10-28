import { t } from "@/server/trpc/init";
import { protectedProcedure, planGatedProcedure, permissionedProcedure, rateLimitedProcedure, gatedAuditedProcedure, orgProcedure } from "@/server/trpc/procedures";
import { projectSchema, projectUpdateSchema } from "@/lib/validators/project.schema";
import { createProject, listProjects, type TenantScope } from "@/server/services/project.service";

export const projectRouter = t.router({
  create: gatedAuditedProcedure("project", "project.create")
    .input(projectSchema)
    .mutation(async ({ ctx, input }) => {
      const scope: TenantScope = {
        organizationId: ctx.tenant!.organizationId,
        userId: ctx.tenant!.userId,
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
    .input(projectUpdateSchema)
    .mutation(async () => {
      return { message: "update placeholder" };
    }),

  ping: rateLimitedProcedure(3, 60_000).query(() => ({
    ok: true,
    timestamp: Date.now(),
  })),
});
