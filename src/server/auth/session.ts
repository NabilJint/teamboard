// SOT: session, getSession, auth, authentication, Better Auth
// WHAT: getSession wrapper that delegates to Better Auth's auth.api.getSession({ headers })
//   and maps the result to the AppSession shape the Block expects.
// WHY: Replaces the SIT-1 x-user-id stub with real cookie-backed sessions so auth state
//   is verified against the database, not trusted from a client header.
// HOW: Calls auth.api.getSession({ headers }); returns null when there is no active
//   session; otherwise maps { user, session } to AppSession, coercing expiresAt to a Date.
// WHERE: Called by authMiddleware (middleware/auth.ts) to authenticate every request.

import { auth } from "./auth";

export type AppSession = {
  user: { id: string; email?: string; name?: string };
  session: { id: string; expiresAt: Date };
};

export async function getSession(
  headers: Headers,
): Promise<AppSession | null> {
  const session = await auth.api.getSession({ headers });
  if (!session?.session) return null;
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    session: {
      id: session.session.token,
      expiresAt: new Date(session.session.expiresAt),
    },
  };
}
