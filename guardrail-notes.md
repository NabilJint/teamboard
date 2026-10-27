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

## Phase 2 — NEXT
- Build resources registry (plans, limits, permissions)
- Add plan-limit gate to the Block
- Swap getSession stub → Better Auth (one-file change)