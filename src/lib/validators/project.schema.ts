import { z } from "zod";

// organizationId is intentionally absent — it comes from ctx.tenant, never router input.
// GAP: Phase 2 — plan/role rules move to rules.ts.
export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
