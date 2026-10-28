import { z } from "zod";

// organizationId is intentionally absent — it comes from ctx.tenant, never router input.
export const commentCreateSchema = z.object({
  content: z.string().min(1).max(2000),
  taskId: z.string().min(1),
});
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;

// comment.list takes no router input — all tenant scoping comes from ctx.tenant.
export const commentListSchema = z.object({});
export type CommentListInput = z.infer<typeof commentListSchema>;
