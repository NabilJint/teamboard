import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/db/prisma";

// SOT: auth, betterAuth, session, authentication, provider
// WHAT: Self-hosted Better Auth instance using the Prisma adapter backed by Postgres.
// WHY: Replaces the SIT-1 getSession stub with real session storage so auth state
//   survives restarts and cannot be spoofed via a header.
// HOW: prismaAdapter(prisma, { provider: "postgresql" }) persists sessions/accounts
//   to the Session/Account/Verification tables added in the better-auth migration.
// WHERE: Imported by session.ts (getSession wrapper) and the Next.js auth route handler.

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: { enabled: true },
});
