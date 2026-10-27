# Guardrail Notes — TeamBoard

## Phase 1 — COMPLETE ✅
**Flow:** Router → protectedProcedure → Service → Prisma → DB

**Proven by curls:**
- No headers → 401 (auth guardrail fires)
- User header only → 400 (org header check fires)
- User + org-1 header → create works, list returns org-1 data
- User + org-2 header → list returns [] (tenant isolation works)

**Files that matter:**
- src/server/trpc/procedures.ts — THE BLOCK (composes middleware)
- src/server/trpc/middleware/auth.ts — calls getSession, sets ctx.user
- src/server/trpc/middleware/tenant.ts — GAP: Phase 6 (throws NOT_IMPLEMENTED)
- src/server/auth/session.ts — SIT-1 STUB (Better Auth swap in Phase 2)
- src/server/db/prisma.ts — PrismaPg with ssl: false (local dev only)
- src/server/services/project.service.ts — only layer touching DB

**Gotchas learned the hard way:**
- Prisma 7 + adapter-pg needs `ssl: false` for local Postgres
- Restart dev server after changing prisma.ts (Next.js caches connections)
- tRPC v11 POST body needs `{"json":{...}}` wrapper
- Seed parent rows (User, Organization) before creating children (Project)
- Don't swallow errors in mapDomainError — log first

## Phase 2 — COMPLETE ✅
**Registry:** src/server/resources.ts (project: FREE=1, PRO=∞; member: FREE=3, PRO=∞)
**Rules:** src/server/rules.ts (canCreate, getUpgradeMessage — pure)
**Gate:** src/server/trpc/middleware/plan-gate.ts (header-based plan, GAP: Phase 6)
**Proof:**
  - FREE + 1 existing project → 2nd create FORBIDDEN with upgrade msg
  - PRO + 1 existing project → 2nd create succeeds
**Plan type:** Prisma enum, single source of truth
**Header pattern:** x-plan (temporary; Phase 6 moves to ctx.tenant.plan)

## Phase 3 — COMPLETE ✅

**Three files:**
- eslint.config.mjs → bans any, @ts-ignore, @ts-expect-error
- package.json → "typecheck": "tsc --noEmit"
- .claude/CLAUDE.md → the rulebook (architecture, types, plans, git, delivery)

**Proven:**
- tsc allows `any` by design (no error)
- ESLint rejects `any` (no-explicit-any)
- Both run: `npm run typecheck` + `npm run lint`

**Key insight:**
- tsc = "does it type-check?" (shape correctness)
- eslint = "does it follow rules?" (any, ts-ignore, etc.)
- Two different guardrails, two different signals
- Both fire automatically — no prompt engineering needed

**CLAUDE.md rule:** Every future session knows:
- Router → Service → Prisma flow
- No any / no unknown / no ts-ignore
- Run `npm run typecheck` before "done"
- Never touch git

## Phase 4 — NEXT
- Server-only enforcement (import "server-only" in service files)
- ESLint rule to catch missing server-only
- This prevents server actions from being bundled to the client

