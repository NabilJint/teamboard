import { auth } from "@/server/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// SOT: auth, betterAuth, route, handler, authentication
// WHAT: Next.js route handler that exposes Better Auth endpoints (sign-in, sign-up,
//   get-session, etc.) under /api/auth/*.
// WHY: The Block's authMiddleware calls auth.api.getSession({ headers }), which needs
//   a real Better Auth HTTP handler to issue and validate session cookies.
// HOW: toNextJsHandler(auth) returns Next.js GET/POST handlers for all Better Auth
//   sub-routes. Mounted by Next.js App Router at /api/auth/[...]/route.ts.
// WHERE: Mounted by Next.js App Router at /api/auth/[...]/route.ts.

const { GET, POST } = toNextJsHandler(auth);

export { GET, POST };
