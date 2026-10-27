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

## Phase 4 — COMPLETE ✅

**Files:**
- package.json: server-only dependency added
- src/server/services/project.service.ts: import "server-only"
- src/server/services/resource.service.ts: import "server-only"
- eslint.config.mjs: custom rule custom/require-server-only

**Proven:**
- Remove server-only → lint fails with:
  "File must start with import "server-only";"
- Add back → lint passes
- 9 pre-existing warnings (unused vars) — not from new rule

**Why:** Without this, server actions can be bundled to the client.
A hacker can find the bundle ID and call them directly, bypassing
the Block. Now the service code physically cannot reach the browser.

## Phase 5a — COMPLETE ✅

**Permission gate:** src/server/trpc/middleware/permission.ts
  - createPermissionGate(resource, permission) factory
  - Reads orgId from x-organization-id (GAP: Phase 6)
  - Looks up role via membership.service.getMembershipRole
  - Checks RESOURCES[resource].permissions[role]
  - Throws FORBIDDEN if role is null or permission missing

**Role enum:** Prisma Role { OWNER, ADMIN, MEMBER }
  - Typed, not string — TypeScript checks resource indexing

**Proven:**
  - user-1 (OWNER) → project.update succeeds
  - user-2 (MEMBER) → project.update FORBIDDEN

**Pattern:** permissionedProcedure(resource, permission) — same factory
shape as planGatedProcedure. Both compose protectedProcedure.

## Phase 5b — COMPLETE ✅

**Rate limiter:** src/server/trpc/middleware/rate-limit.ts
  - createRateLimit(maxCalls, windowMs) factory
  - In-memory Map<userId, timestamps[]>
  - clearRateLimitStore() helper for tests
  - GAP: Phase 7 — replace with Redis for multi-instance

**Procedure:** rateLimitedProcedure(max, windowMs) in procedures.ts

**Proven:**
  - project.ping with rateLimitedProcedure(3, 60000)
  - Calls 1-3: 200 {ok:true}
  - Call 4: 429 "Rate limit exceeded: 3 calls per 60000ms"

**All guardrails proven (1-6):**
  1. Auth (401)
  2. Tenant isolation (org-1 vs org-2)
  3. Plan limits (FREE 1 project, PRO unlimited)
  4. Server-only (ESLint blocks missing import)
  5. Permissions (OWNER 200, MEMBER 403)
  6. Rate limiting (3 OK, 4th 429)

## Phase 5c — COMPLETE ✅ (after resourceId fix)

**Files:**
- prisma/schema.prisma: AuditLog + Usage models
- src/server/services/audit.service.ts: logAction (fire-and-forget)
- src/server/services/usage.service.ts: incrementUsage + getUsage
- src/server/trpc/middleware/audit-usage.ts: createAuditUsage
- src/server/trpc/procedures.ts: auditedProcedure + gatedAuditedProcedure
- src/server/routers/project.router.ts: project.create uses gatedAuditedProcedure

**Composition:** Option B — gatedAuditedProcedure(resource, action)
  planGatedProcedure(resource).use(createAuditUsage(action, resource))
  Order: plan gate → audit → resolver. Blocked requests = no audit row.

**Proven:**
  - project.create → 1 AuditLog row + 1 Usage row
  - Audit fires after success (not on blocked requests)
  - resourceId = project.id (after fix)

**All 7 guardrails proven:**
  1. Auth
  2. Tenant isolation
  3. Plan limits
  4. Server-only
  5. Permissions
  6. Rate limiting
  7. Audit + Usage

## Phase 6 Step 1 — COMPLETE ✅

**tenantMiddleware is real:**
- reads x-organization-id (claim)
- getMembershipRole verifies membership (proof)
- org lookup for plan
- sets ctx.tenant = { organizationId, userId, role, plan }
- throws FORBIDDEN if not a member

**Proven:**
- user-1 + org-1 (OWNER) → 200
- user-2 + org-1 (MEMBER) → 200
- user-2 + org-2 (NOT member) → 403 "Not a member of this organization"

**Why it matters:** Before Phase 6, the app trusted the header. Now it
verifies. Same user, different org → different result. Cross-org leakage
is closed.

## Phase 6 Step 2 — COMPLETE ✅

**permission.ts migrated:**
- OLD: read x-organization-id header + getMembershipRole + role check
- NEW: read ctx.tenant.role (set by tenantMiddleware) + role check
- permissionedProcedure now chains orgProcedure (not protectedProcedure)
  so ctx.tenant is guaranteed

**Proven:**
- user-1 (OWNER) → 200
- user-2 (MEMBER) → 403 "Insufficient permissions"
- Behavior unchanged from Phase 5a, code simpler

## Phase 6 Step 3 — COMPLETE ✅

**plan-gate.ts migrated:**
- OLD: read x-organization-id + x-plan headers
- NEW: read ctx.tenant.organizationId + ctx.tenant.plan (from DB)
- planGatedProcedure now chains orgProcedure (tenant fires first)
- x-plan header is dead — grep confirms no reads remain

**Proven:**
- Curl 1: DB FREE, no header → 403 blocked
- Curl 2: DB PRO, no header → 200 succeeded
- Curl 3: DB FREE + x-plan: PRO header → 403 (header ignored, DB wins)

**Security win:** clients can no longer claim PRO by sending a header.
Plan comes only from Organization.plan, which only the server writes.

