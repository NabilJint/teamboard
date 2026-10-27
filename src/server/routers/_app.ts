import { createTRPCRouter } from "@/server/trpc/init";
import { healthRouter } from "./health.router";
import { projectRouter } from "./project.router";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
