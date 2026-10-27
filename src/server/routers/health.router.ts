import { t } from "@/server/trpc/init";

export const healthRouter = t.router({
  hello: t.procedure.query(() => ({ message: "hello from teamboard" })),
});
