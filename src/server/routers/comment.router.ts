import { t } from "@/server/trpc/init";
import { gatedAuditedProcedure, orgProcedure } from "@/server/trpc/procedures";
import { commentCreateSchema, commentListSchema } from "@/lib/validators/comment.schema";
import { createComment, listComments, type TenantScope } from "@/server/services/comment.service";

// SOT: comment router, comment.create, comment.list, THE BLOCK
// WHAT: Exposes comment.create (gatedAuditedProcedure: plan gate + audit) and comment.list (orgProcedure: tenant-scoped).
// WHY: Every route goes through the Block; create enforces plan quota + audit, list enforces org tenant scoping.
// HOW: create uses gatedAuditedProcedure("comment", "comment.create") like task.create; list uses orgProcedure like task.list.
// WHERE: Registered in the app router alongside projectRouter, healthRouter, and taskRouter.

export const commentRouter = t.router({
  create: gatedAuditedProcedure("comment", "comment.create")
    .input(commentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const scope: TenantScope = {
        organizationId: ctx.tenant!.organizationId,
        userId: ctx.tenant!.userId,
      };

      return createComment(input, scope);
    }),

  list: orgProcedure
    .input(commentListSchema)
    .query(async ({ ctx }) => {
      const scope: TenantScope = {
        organizationId: ctx.tenant!.organizationId,
        userId: ctx.tenant!.userId,
      };

      return listComments(scope);
    }),
});
