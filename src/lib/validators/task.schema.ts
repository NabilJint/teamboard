import { z } from "zod";
import { TaskStatus } from "@/generated/prisma/client";

// organizationId is intentionally absent — it comes from ctx.tenant, never router input.
export const taskCreateSchema = z.object({
  title: z.string().min(1).max(200),
  projectId: z.string().min(1),
  status: z.nativeEnum(TaskStatus).optional(),
  assigneeId: z.string().nullable().optional(),
});
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;

// task.list takes no router input — all tenant scoping comes from ctx.tenant.
export const taskListSchema = z.object({});
export type TaskListInput = z.infer<typeof taskListSchema>;
