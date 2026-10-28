import { t } from "@/server/trpc/init";
import { gatedAuditedProcedure, orgProcedure } from "@/server/trpc/procedures";
import { taskCreateSchema, taskListSchema } from "@/lib/validators/task.schema";
import { createTask, listTasks, type TenantScope } from "@/server/services/task.service";

// SOT: task router, task.create, task.list, THE BLOCK
// WHAT: Exposes task.create (gatedAuditedProcedure: plan gate + audit) and task.list (orgProcedure: tenant-scoped).
// WHY: Every route goes through the Block; create enforces plan quota + audit, list enforces org tenant scoping.
// HOW: create uses gatedAuditedProcedure("task", "task.create") like project.create; list uses orgProcedure like project.list.
// WHERE: Registered in the app router alongside projectRouter and healthRouter.

export const taskRouter = t.router({
  create: gatedAuditedProcedure("task", "task.create")
    .input(taskCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const scope: TenantScope = {
        organizationId: ctx.tenant!.organizationId,
        userId: ctx.tenant!.userId,
      };

      return createTask(input, scope);
    }),

  list: orgProcedure
    .input(taskListSchema)
    .query(async ({ ctx }) => {
      const scope: TenantScope = {
        organizationId: ctx.tenant!.organizationId,
        userId: ctx.tenant!.userId,
      };

      return listTasks(scope);
    }),
});
