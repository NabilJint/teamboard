import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";

// In-memory store: userId → call timestamps.
// GAP: Phase 7 — replace with Redis for multi-instance deployments.
const callTimes = new Map<string, number[]>();

export function clearRateLimitStore(): void {
  callTimes.clear();
}

export function createRateLimit(maxCalls: number, windowMs: number) {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }
    const userId = ctx.user.id;

    const now = Date.now();
    const timestamps = callTimes.get(userId) ?? [];

    // Keep only timestamps within the current window.
    const recent = timestamps.filter((ts) => now - ts < windowMs);

    if (recent.length >= maxCalls) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded: ${maxCalls} calls per ${windowMs}ms`,
      });
    }

    recent.push(now);
    callTimes.set(userId, recent);

    return next();
  });
}
