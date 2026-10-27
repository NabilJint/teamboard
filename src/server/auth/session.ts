// SIT-1 STUB: replace in Phase 2 with Better Auth's auth.api.getSession({ headers }).
// Signature matches Better Auth so Phase 2 is a one-file swap.
// Returns null when x-user-id header is absent.

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
