import { createTRPCRouter } from "@/server/trpc/init";
import { healthRouter } from "./health.router";
import { projectRouter } from "./project.router";
import { taskRouter } from "./task.router";
import { commentRouter } from "./comment.router";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  project: projectRouter,
  task: taskRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
