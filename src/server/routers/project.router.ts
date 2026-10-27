import { t } from "@/server/trpc/init";
import { protectedProcedure } from "@/server/trpc/procedures";
import { projectSchema } from "@/lib/validators/project.schema";
import { createProject, listProjects, type TenantScope } from "@/server/services/project.service";
import { TRPCError } from "@trpc/server";

export const projectRouter = t.router({
  create: protectedProcedure
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

  list: protectedProcedure.query(async ({ ctx }) => {
    // GAP: Phase 6 — replace with ctx.tenant.organizationId after orgProcedure is wired.
    const organizationId = ctx.headers.get("x-organization-id");
    if (!organizationId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Missing organization" });
    }

    const scope: TenantScope = {
      organizationId,
      userId: ctx.user!.id,
    };

    return listProjects(scope);
  }),
});
