// SIT-1 STUB: replace in Phase 2 with Better Auth's auth.api.getSession({ headers }).
// Signature matches Better Auth so Phase 2 is a one-file swap.
// Returns null when x-user-id header is absent.
// SOT: session, getSession, auth stub, SIT-1, authentication
// WHAT: STUB getSession function that reads x-user-id header; returns AppSession or null when absent.
// WHY: The stub exists so the Block could be built and tested without a real auth provider. Better Auth is still deferred; the swap is a future phase. The signature matches auth.api.getSession({ headers }) exactly, so when the time comes it's a one-file change (this file only).
// HOW: Reads x-user-id from headers. Returns null if absent. Otherwise returns { user: { id }, session: { id, expiresAt: now + 24h } } — a hardcoded 24-hour expiry, stub only.
// WHERE: Called by authMiddleware (middleware/auth.ts) to authenticate requests.

export type AppSession = {
  user: { id: string; email?: string; name?: string };
  session: { id: string; expiresAt: Date };
};

export async function getSession(
  headers: Headers,
): Promise<AppSession | null> {
  // SIT-1 STUB: replace in Phase 2 with Better Auth's auth.api.getSession({ headers }).
  // Signature matches Better Auth so Phase 2 is a one-file swap.
  const userId = headers.get("x-user-id");
  if (!userId) return null;
  return {
    user: { id: userId },
    session: { id: `stub-${userId}`, expiresAt: new Date(Date.now() + 86_400_000) },
  };
}
