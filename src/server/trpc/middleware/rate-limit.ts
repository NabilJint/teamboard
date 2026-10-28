import { t } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";

// SOT: rate limit, 429, throttle, in-memory, abuse prevention
// WHAT: Limits API calls per user to N per windowMs using an in-memory timestamp Map.
// WHY: Without this, a single user could spam requests and exhaust database or server resources.
// HOW: Filters call timestamps within windowMs; throws TOO_MANY_REQUESTS if count >= maxCalls; clears store via helper for tests.
// WHERE: Wrapped by rateLimitedProcedure factory; used by project.ping resolver (3 calls per minute).

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
