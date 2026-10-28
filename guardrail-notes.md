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

## Phase 6 Step 4 — COMPLETE ✅

**audit-usage.ts migrated:**
- OLD: read x-organization-id from header
- NEW: read ctx.tenant.organizationId + ctx.tenant.userId
- auditedProcedure + gatedAuditedProcedure chain orgProcedure
- resourceId extraction works (result.data.id)

**Proven:**
- project.create (org-2) → 200
- AuditLog row: user-1, org-2, project.create, project, cmvr719eh... 
  All fields from ctx.tenant, not headers
- Usage count org-2/project incremented

**Header reads eliminated:**
- tenant.ts: reads x-organization-id (the ONLY file that does)
- permission.ts: reads ctx.tenant.role ✅
- plan-gate.ts: reads ctx.tenant.plan ✅
- audit-usage.ts: reads ctx.tenant.organizationId ✅
- x-plan header: gone entirely ✅

## Phase 6 Step 5 — NEXT: migrate project.router.ts to ctx.tenant
## Phase 6 Step 6 — FINAL: delete GAP: Phase 6 comments

## ALL PHASES COMPLETE ✅

### The Block (in order):
1. Request setup (timer, ctx with headers)
2. Auth (getSession → ctx.user)
3. Tenant (membership + plan → ctx.tenant)
4. Permission (RESOURCES role check)
5. Plan limits (RESOURCES count check, DB plan)
6. Rate limit (in-memory Map, 429)
7. Resolver (business logic)
8. Audit log (post-success, fire-and-forget)
9. Usage counter (post-success, increment)
10. Response (or error if any middleware threw)

### Single sources of truth:
- Headers read once: tenant.ts
- Plan: Organization.plan (DB)
- Role: Membership.role (DB)
- Permissions + limits: RESOURCES registry
- Types: Prisma-generated
- Rules: CLAUDE.md + ESLint

### Eight guardrails, eight proofs:
1. Auth → 401 without headers
2. Tenant → 403 non-member
3. Permissions → 403 MEMBER on update
4. Plan → 403 FREE over limit
5. Header spoof → ignored (DB wins)
6. Rate limit → 429 on 4th call
7. Audit → AuditLog row exists
8. Usage → counter incremented

### What this means for future features:
Add a new feature (tasks, comments, etc.):
1. Add to RESOURCES registry (limits + permissions)
2. Add to services (DB access, server-only)
3. Add router using orgProcedure (or a variant)
4. Run the regression script
5. Done — all 8 guardrails inherited automatically

# TeamBoard — Architectural Guardrail (COMPLETE)

## What This Is
A production-grade AI-assisted development system. Every feature
inherits 8 guardrails automatically by calling orgProcedure (or a
variant). No prompt engineering. No "please remember." The code
enforces the rules.

## The Block (execution order)
1. Route handler → createContext(headers)
2. authMiddleware → ctx.user (401 if missing)
3. tenantMiddleware → ctx.tenant (403 if not a member)
4. permissionMiddleware → RESOURCES[role] check (403)
5. planGate → RESOURCES[limit] check (403)
6. rateLimit → in-memory Map (429)
7. Resolver → business logic only
8. auditUsage → AuditLog + Usage (post-success, fire-and-forget)

## Single Sources of Truth
- Headers: read ONCE in tenant.ts. Everything else trusts ctx.tenant.
- Plan: Organization.plan (DB). x-plan header is dead.
- Role: Membership.role (DB).
- Limits + permissions: RESOURCES registry (src/server/resources.ts).
- Types: Prisma-generated. ESLint bans `any`.
- Rules: CLAUDE.md + ESLint rules.
- Services: `import "server-only"` enforced by custom ESLint rule.

## Procedure Factories (compose as needed)
- protectedProcedure → auth only
- orgProcedure → auth + tenant
- permissionedProcedure(resource, permission) → + permission
- planGatedProcedure(resource) → + plan limit
- rateLimitedProcedure(max, windowMs) → + rate limit
- auditedProcedure(action, resource) → + audit/usage
- gatedAuditedProcedure(resource, action) → plan + audit/usage

## The 8 Guardrails + Their Proofs
1. Auth → curl without headers = 401
2. Tenant → non-member = 403
3. Permissions → MEMBER on update = 403
4. Plan → FREE over limit = 403
5. Header spoof → x-plan: PRO ignored, DB wins
6. Rate limit → 4th call in window = 429
7. Usage → counter incremented on create
8. Audit → AuditLog row with correct resourceId

Regression script: test-guardrails.sh → 8 passed, 0 failed

## To Add a New Feature (the payoff)
1. Add resource to RESOURCES registry (limits + permissions)
2. Add service method (import "server-only", org-scoped)
3. Add router using orgProcedure or a variant
4. Run test-guardrails.sh
5. Done — all 8 guardrails inherited automatically

Estimated time per feature: 5-10 minutes instead of hours.

## Remaining Future Work (optional, marked with GAP comments)
- Phase 7: Swap getSession stub → Better Auth (one-file change,
  signature already matches)
- Phase 7: Redis for rate limiting (adapter pattern)
- Refactor: move org lookup from tenant.ts to organization.service
- UI: dashboard, project list (backend is ready)

## Gotchas Learned
- Prisma 7 adapter-pg needs ssl: false for local Postgres
- Restart dev server after adding new tRPC routes
- tRPC v11 queries need GET, mutations need POST
- tRPC v11 POST body needs {"json":{...}} wrapper
- Queries: ?input=%7B%22json%22%3A%7B%7D%7D
- Seed parent rows (User, Organization) before creating children
- Don't swallow errors in mapDomainError — log first

## Phase 7 — COMPLETE ✅

**Database isolation enforced by ESLint:**
- src/server/routers/** → no Prisma imports (paths + patterns)
- src/server/trpc/** → no Prisma imports (paths + patterns)
- tenant.ts → exempted (config override + GAP comment), needs org plan
  before services run

**Proven (4 tests):**
1. @/server/db/prisma in router → lint error
2. ../../db/prisma (relative) in router → lint error (patterns catch it)
3. @prisma/client in middleware → lint error
4. tenant.ts imports Prisma → passes (exception works)

**Side fix:** context.ts imports Plan/Role from @/server/resources,
not @/generated/prisma/client — avoids Prisma import in trpc layer.

**What this prevents:** a future Claude session writing a Prisma query
in a router (architectural drift). The linter catches it before the
code runs.

## Phase 8a — COMPLETE ✅

**8 SOT blocks inserted (middleware + procedures + context):**
- auth.ts: SOT: auth, session, getSession, authentication, middleware
- tenant.ts: SOT: tenant, organization, membership, organizationId, multi-tenant isolation
- permission.ts: SOT: permission, role, FORBIDDEN, authorization, access control
- plan-gate.ts: SOT: plan, FREE, PRO, plan limit, quota, billing enforcement
- rate-limit.ts: SOT: rate limit, 429, throttle, in-memory, abuse prevention
- audit-usage.ts: SOT: audit, usage, logging, counter, telemetry, post-mutation
- procedures.ts: SOT: tRPC, procedures, router context, middleware composition, THE BLOCK
- context.ts: SOT: context, headers, user, tenant, tRPC context, request context

**Format (8 lines per file):**
  // SOT: <keywords>
  // WHAT: <one sentence>
  // WHY:  <one sentence — concrete risk it prevents>
  // HOW:  <one sentence — actual mechanism>
  // WHERE: <one sentence — who calls it>

**Verified:** typecheck clean, lint 0 errors, grep returns 8 paths

**Fixes applied:**
- procedures.ts HOW: corrected to describe factory composition, not a
  fixed order (avoids "assume all six run for every route" drift)
- auth.ts WHERE: corrected to say it's the base of ALL org-scoped
  procedures, not just protectedProcedure


## Phase 8b — COMPLETE ✅

**8 SOT blocks inserted (services + registries):**
- resources.ts: SOT: resources, RESOURCES, plan limits, permissions, single source of truth
- rules.ts: SOT: rules, canCreate, getUpgradeMessage, pure functions, plan logic
- project.service.ts: SOT: project service, createProject, listProjects, TenantScope, DB writes
- resource.service.ts: SOT: resource service, countResource, DB reads, counts
- membership.service.ts: SOT: membership service, getMembershipRole, role lookup, DB read
- audit.service.ts: SOT: audit service, logAction, AuditLog, fire-and-forget, write-only
- usage.service.ts: SOT: usage service, incrementUsage, getUsage, Usage counter, metering
- session.ts: SOT: session, getSession, auth stub, SIT-1, authentication

**Total: 16 SOT blocks (8a + 8b)**

**All 8 have:** specific WHAT, concrete WHY (names the risk), actual
HOW (mechanism), accurate WHERE (names the caller)

**Fixes applied in 8b:**
- session.ts WHY: removed stale "Phase 2 replaces body", now says
  "Better Auth is still deferred; swap is a future phase"
- session.ts HOW: mentions hardcoded 24h expiry
- project.service.ts WHERE: names the full chain
  (gatedAuditedProcedure → planGatedProcedure → orgProcedure) and
  states the service doesn't know about the Block, only TenantScope

## Phase 8c — COMPLETE ✅

**Check 1:** grep -rn "SOT:" src/ → exactly 16 paths
**Check 2:** Read-the-comment test passed for 3 files:
  - audit.service.ts: fire-and-forget, called by audit-usage ✅
  - membership.service.ts: called by tenant + permission ✅
  - rules.ts: pure, testable, called by plan-gate ✅
**Check 3:** grep -rl "SOT: tenant" / "permission" / "plan" → paths only ✅

**Phase 8 FULLY COMPLETE.** 16 files with 8-line SOT blocks.
Each answers what/why/how/where without reading code.

**Note:** rg not installed. Used grep -rl as fallback. Phase 9 will
install ripgrep.


## Phase 9 — COMPLETE ✅

**What it does:** Grep-first discovery. Find the file before reading it.
`rg -l "SOT: <keyword>"` returns paths only (~10 tokens) instead of
file contents (~500-2000 tokens per file).

**Built:**
- ripgrep 15.2.0 installed
- scripts/find-sot.sh <keyword> — wrapper for rg -l
- .claude/CLAUDE.md: Grep-First Discovery section added
  - "Before reading any file, run rg -l / find-sot.sh"
  - "Use rg -l (paths only). Never rg without -l. Never grep -rn."
  - 16 keywords listed

**Tested:**
- ./scripts/find-sot.sh auth → 3 paths (auth.ts, session.ts, permission.ts)
- ./scripts/find-sot.sh tenant → 2 paths (context.ts, tenant.ts)

**Token savings:** Discovery drops from ~5 file reads (~8,000 tokens)
to 1 grep + 1 read (~500 tokens). ~99% savings on discovery questions.

## Phase 9 Token Test — PROVEN ✅

With grep-first: 1 file, ~150 tokens
Without grep-first: 6 files, ~730 tokens (conservative; real ≈ 1000+)
Savings: 80% on small codebase, 95%+ on large codebases

Mechanism: rg -l returns paths (~10 tokens each), then read exactly
1 file. Old approach: read N files, discover as you go.

## Phase 10 — COMPLETE ✅

**Validation:**
- create → projectSchema (validators)
- update → projectUpdateSchema (validators, inline removed)
- list → no input (service takes TenantScope from ctx.tenant)
- ping → no input (health check)

**CLAUDE.md additions:**
- UI / Component Rules (reuse first, global vs route, no hardcoded colors, slots)
- Validation Rules (Zod from validators, no inline, match service)

**Verified:** typecheck clean, lint 0 errors, grep shows 2 .input() calls

## Task Feature — COMPLETE ✅ (first new feature after the Block)

**Built in:** 50 min, 4 reads, 3 new files + 5 edits
**Regression:** 8/8 still pass

**What it proved:**
- New feature inherits all 8 guardrails automatically
- task.router.ts has ZERO guardrail code — just
  gatedAuditedProcedure("task", "task.create") and orgProcedure
- Service-layer check for cross-org projectId (curl 2 → 404)
- Usage counter works with new resource ("task")
- Audit logs task.create

**Why 50 min not 30:**
- Read errors.ts + package.json unnecessarily (should use SOT comments)
- Missing: _app.ts mount was essential; usage.service read was legit
- Fix: cap reads in prompt, list known signatures upfront

**Target for next feature:** 30 min, ≤3 reads

## Comment Feature — COMPLETE ✅ (third feature, pattern proven)

**Built in:** 50 min, 3 reads, 3 new + 5 edits
**Regression:** 8/8
**Cross-org guard:** comment.create bad taskId → 404 ✅

**Pattern is now proven repeatable:**
- task (50 min, 4 reads) → comment (50 min, 3 reads)
- Same 12-step recipe, same 4 curls, same 8/8 regression
- The router has zero guardrail code in both

**Time breakdown (why still 50 min):**
- Proposal: 8 min (read 3, plan)
- Writing: 15 min (3 new + 5 edits)
- Migration: 3 min
- Regression + curls: 10 min
- Verification loop: 14 min

**Next optimization (not required):** scaffold-resource.sh script
to generate the 3 new files from a template. Writing drops to ~5 min,
total to ~35 min.

**Three features, all inherit all 8 guardrails:**
1. project (create, list, update)
2. task (create, list)
3. comment (create, list)


