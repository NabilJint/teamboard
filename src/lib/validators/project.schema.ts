import { z } from "zod";

// organizationId is intentionally absent — it comes from ctx.tenant, never router input.
export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// Empty schema: project.list takes no router input — all tenant scoping
// comes from ctx.tenant, not router input. Keeping this empty matches what
// the service actually does.
export const projectListSchema = z.object({});
export type ProjectListInput = z.infer<typeof projectListSchema>;

// Update schema: id + name + optional description.
export const projectUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
