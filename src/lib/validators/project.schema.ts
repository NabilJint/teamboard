import { z } from "zod";

// organizationId is intentionally absent — it comes from ctx.tenant, never router input.
export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
