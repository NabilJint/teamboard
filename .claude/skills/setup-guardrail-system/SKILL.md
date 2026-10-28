---
name: setup-guardrail-system
description: Builds or updates the architectural guardrail system for the current repo. Walks eleven phases (state → propose → approve → build → verify → next phase), one phase at a time. Stack-aware: Phase 1 identifies the stack, then follows the matching sub-recipe. Idempotent: on fresh repos it builds; on re-runs it verifies each layer, skips what exists, and applies only the diff. Handles system changes (add Better Auth, Redis, etc.) via diff mode. Project-local only — do NOT write to ~/.claude/skills or any global path. Do NOT use for adding features.
---

# Guardrail System Skill — setup-guardrail-system

## HARD RULES (read first, never violate)

1. **Only this skill may modify the Block.** The Block = `src/server/trpc/init.ts`, `src/server/trpc/procedures.ts`, and all middleware under `src/server/trpc/middleware/`. No other agent or user edit may touch these files outside this skill.
2. **Run `test-guardrails.sh` (8/8) after every phase and after every system change.** If it drops below 8/8, roll back that phase immediately and report the failure before proceeding.
3. **Ask before proposing.** Never build without explicit user approval at each phase (state → propose → approve → build → verify → next phase).
4. **Never run git.** Do not commit, checkout, or read session history.
5. **Read `CLAUDE.md`. Read `guardrail-notes.md` only if it exists (created on first run at Phase 11).**
6. **Respect the read cap.** Read at most 3 files per step unless the user explicitly authorizes more.
7. **Always explain in super simple terms — like I'm 5.** Short sentences. No jargon. Say what and why before how.

---

## PHASE 0 — Read State

Before anything else, read these files:

1. `.claude/CLAUDE.md` — stack facts, architectural decisions, prior gotchas.
2. `guardrail-notes.md` (at project root, not `docs/`) — **only if it exists.** If it does not exist, skip it. This skill will CREATE it at the end of Phase 11 with the initial gotchas section (Prisma 7 `ssl:false`, tRPC query vs mutation, restart after new route, cross-org guard, read cap, exhaustive `ResourceKey`).

Capture:
- The current stack (Next.js / Python / other).
- Which phases already exist (from `CLAUDE.md` or directory listing).
- Which phases are missing or incomplete.
- Any open failures noted in `guardrail-notes.md` (if it exists).

If neither file exists, treat this as a fresh repo and proceed to Phase 0.5.

---

## PHASE 0.5 — Choose Mode

This skill works on fresh repos AND existing repos. On an existing repo, choose **'verify'** to check which layers already exist, or **'change'** to apply a specific diff. Never rebuild existing layers.

Ask the user which mode to run:

| Mode | When to use | What it does |
|------|-------------|--------------|
| **fresh** | New repo, no guardrails exist | Build all eleven phases in order |
| **verify** | Cloned template, guardrails may exist | Check each phase exists; skip if present; report present/missing table |
| **change** | Existing system needs a modification | Diff-based: propose diff across Block / registry / CLAUDE.md / ESLint → apply → re-run 8/8 regression → update CLAUDE.md |

**Deliverable:** Record the chosen mode in `CLAUDE.md`. Then proceed to Phase 1 (fresh/change) or Verify-Only Mode (verify).

---

## PHASE 1 — Identify Stack

**Goal:** Determine the runtime stack so the correct sub-recipe is used.

**Questions to ask:**
- Is this Next.js (App Router), Python (FastAPI/Django/Flask), Go, Rust, or something else?
- Which database? PostgreSQL? MySQL? SQLite? None yet?
- Which ORM, if any? Prisma? SQLAlchemy? Alembic? Raw SQL?
- Is auth needed? Better Auth? Clerk? Custom JWT?
- Is Redis needed for rate limiting / caching?

**What to propose:** A single-line stack summary (e.g., "Next.js 16 + Prisma + PostgreSQL + Better Auth").

**Build:** Write the stack summary into `CLAUDE.md` under a `## Stack` section.

**Verify:** Confirm `CLAUDE.md` now contains the stack. Then proceed to Phase 2.

---

## PHASE 2 — Data Layer (Schema + Migration)

**Goal:** Define the core data models and run the initial migration.

**Implementation detail:** Lives in the stack sub-recipe (below). For Next.js/Prisma this means `schema.prisma` models + `prisma migrate dev --name <name>`.

**What to propose:** The model definitions (Task, Project, Organization, Membership, User, Usage, AuditLog, etc.) and the migration name.

**Build:** Apply the schema changes and run the migration via the stack sub-recipe.

**Verify:**
- `npm run typecheck` passes (Next.js) or equivalent type check.
- Migration applied; tables exist in the DB.
- Then proceed to Phase 3.

---

## PHASE 3 — Seed

**Goal:** Populate reference data so guards and curls can be tested.

**Questions to ask:**
- Which org IDs? (e.g., `org-1`, `org-2`)
- Which user IDs and roles? (e.g., `user-1` OWNER, `user-2` MEMBER)
- Which plans? (FREE / PRO)

**What to propose:** A seed script that upserts users, orgs, memberships, and optionally projects/tasks.

**Build:** Run the seed script.

**Verify:** Query the DB to confirm rows exist. Then proceed to Phase 4.

---

## PHASE 4 — Resource Registry

**Goal:** Single source of truth for plan limits and permissions.

**File:** `src/server/resources.ts` (Next.js) or stack equivalent.

**What to propose:** The `RESOURCES` object with entries for each resource (project, member, task, comment, etc.):
- `FREE` limit (number) and `PRO` limit (`Infinity`)
- `permissions` map: `OWNER`, `ADMIN`, `MEMBER` → array of permission strings
- `upgradeMessage` string

**Rules:**
- `ResourceKey = keyof typeof RESOURCES` must be exhaustive — every resource key must also appear in `rules.ts` and `resource.service.ts`.
- `organizationId` is never in router input; it comes from `ctx.tenant`.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 5.

---

## PHASE 5 — Rules

**Goal:** Pure plan-limit functions with no DB or tRPC dependencies.

**File:** `src/server/rules.ts` (Next.js) or stack equivalent.

**What to propose:** `canCreate(resource, plan, currentCount)` and `getUpgradeMessage(resource)` using exhaustive `Record<ResourceKey, ...>` maps that include every key from `RESOURCES`.

**Rules:** Because `ResourceKey` is exhaustive, adding a resource to `RESOURCES` forces an update here or typecheck fails.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 6.

---

## PHASE 6 — Resource Counting (countResource)

**Goal:** Count existing rows for a resource by organization ID.

**File:** `src/server/resource.service.ts` (Next.js) or stack equivalent.

**What to propose:** `countResource(resource, organizationId)` that switches on the resource key and calls the appropriate model `.count({ where: { organizationId } })`.

**Rules:**
- Must start with `import "server-only"`.
- Must handle every `ResourceKey` or throw `Unhandled resource` in default.
- Implementation detail (Prisma `prisma.task.count` vs SQLAlchemy query) lives in the stack sub-recipe.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 7.

---

## PHASE 7 — The Block (sub-stepped 7a–7h)

**Goal:** Compose the middleware chain so every route goes through the Block.

**Hard rule:** Only this skill may modify the Block (`init.ts`, `procedures.ts`, middleware files).

**Structure:** Phase 7 is split into 8 sub-steps. For each sub-step: **propose → user approves → build → verify with a single curl**. Do not build the whole Block in one checkpoint.

### 7a. Auth middleware
- **Propose:** `protectedProcedure = t.procedure.use(authMiddleware)` that verifies the session/user and throws 401 `UNAUTHORIZED` when no headers.
- **Build:** Implement auth middleware that reads `x-user-id` (or equivalent) and sets `ctx.user`.
- **Verify:** `curl` with no headers → expect 401 `UNAUTHORIZED`.

### 7b. Tenant middleware
- **Propose:** `orgProcedure = protectedProcedure.use(tenantMiddleware)` that loads `ctx.tenant` (organizationId, userId, role, plan) and throws 403 `Not a member` for non-members.
- **Build:** Implement tenant middleware that looks up the membership for `(userId, organizationId)`.
- **Verify:** `curl` as a non-member (e.g., `user-2` in `org-2` accessing `org-1`) → expect 403 `Not a member`.

### 7c. Permission middleware
- **Propose:** `permissionedProcedure(resource, permission)` = `orgProcedure.use(createPermissionGate(resource, permission))` that checks `RESOURCES[resource].permissions[role]` includes the permission, else 403 `Insufficient permissions`.
- **Build:** Implement the permission gate.
- **Verify:** `curl` as MEMBER attempting an OWNER-only action → expect 403 `Insufficient permissions`.

### 7d. Plan gate middleware
- **Propose:** `planGatedProcedure(resource)` = `orgProcedure.use(createPlanGate(resource))` that counts existing resources and blocks creation at the plan limit.
- **Build:** Implement plan gate using `countResource` + `canCreate` + `getUpgradeMessage`.
- **Verify:** Set org to FREE and over the limit; `curl` create → expect 403 with the upgrade message.

### 7e. Rate-limit middleware
- **Propose:** `rateLimitedProcedure(max, windowMs)` = `protectedProcedure.use(createRateLimit(max, windowMs))` that throws 429 `TOO_MANY_REQUESTS` after `max` calls.
- **Build:** Implement rate limiter keyed by user/organization.
- **Verify:** `curl` the rate-limited endpoint `max` times; the `(max+1)`th → expect 429 `TOO_MANY_REQUESTS`.

### 7f. Audit-usage middleware
- **Propose:** `auditedProcedure(action, resource)` = `orgProcedure.use(createAuditUsage(action, resource))` that logs an `AuditLog` row and increments the `Usage` counter after a successful mutation.
- **Build:** Implement post-mutation audit logging + usage increment.
- **Verify:** `curl` a create mutation; then query `AuditLog` and `Usage` tables → expect a new row and incremented counter.

### 7g. `gatedAuditedProcedure` composition
- **Propose:** `gatedAuditedProcedure(resource, action)` = `planGatedProcedure(resource).use(createAuditUsage(action, resource))` — plan gate + audit for create mutations.
- **Build:** Compose plan gate and audit middleware.

### 7h. Procedures factory + context
- **Propose:** Export `publicProcedure`, `protectedProcedure`, `orgProcedure`, `adminProcedure`, `planGatedProcedure`, `permissionedProcedure`, `rateLimitedProcedure`, `auditedProcedure`, `gatedAuditedProcedure`, and `RouterContext`.
- **Build:** `src/server/trpc/init.ts` + `src/server/trpc/procedures.ts`.
- **Verify:** `npm run typecheck` passes; procedures are importable by routers.

**Verify (phase gate):** `bash test-guardrails.sh` → expect 8/8. Then proceed to Phase 8.

---

## PHASE 8 — Services

**Goal:** Service layer that owns all DB writes and org-scoped reads.

**File pattern:** `src/server/services/<resource>.service.ts` (Next.js) or stack equivalent.

**Rules:**
- Every service file starts with `import "server-only"`.
- Services never import Prisma directly from routers; routers call services.
- Every query is scoped by `organizationId` from `TenantScope`.
- `createX` verifies the parent resource belongs to the same org before writing (cross-org guard).
- Errors wrapped via `mapDomainError`.

**What to propose:** `createTask`, `listTasks`, `createProject`, `listProjects`, etc., each taking `(input, scope: TenantScope)`.

**Build:** Implement service functions per the stack sub-recipe.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 9.

---

## PHASE 9 — Validators

**Goal:** Zod schemas for every router input.

**File:** `src/lib/validators/<resource>.schema.ts` (Next.js) or stack equivalent.

**Rules:**
- `organizationId` is intentionally absent from every create/update schema — it comes from `ctx.tenant`, never router input.
- List schemas may be empty objects (`z.object({})`) when all scoping comes from tenant context.
- Use the stack's enum type directly in Zod (e.g., `z.nativeEnum(TaskStatus)`) so Prisma is the single source of truth.

**What to propose:** `createSchema`, `listSchema`, `updateSchema` per resource.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 10.

---

## PHASE 10 — Routers + _app.ts Mount

**Goal:** Wire routers through the Block and mount them.

**Rules:**
- Every route goes through the Block (org → plan gate → audit for create; org → tenant for list).
- `create` uses `gatedAuditedProcedure(resource, "resource.create")`.
- `list` uses `orgProcedure`.
- Do NOT touch project routes (or other existing routes) unless the change request specifically targets them.
- Mount every router in `_app.ts` (or stack equivalent).

**What to propose:** Router definitions and the mount list.

**Build:** Implement routers; add mount entries.

**Verify:** `npm run typecheck` passes. Then proceed to Phase 11.

---

## PHASE 11 — Verify

**Goal:** Full regression check before the phase is complete.

**Steps:**
1. `npm run typecheck` → 0 errors.
2. `npm run lint` → 0 errors (pre-existing warnings in unrelated files are acceptable).
3. `bash test-guardrails.sh` → 8/8 passed, 0 failed.
4. Four curls to prove the new resource works:
   - `resource.create` (valid) → 200, created row returned.
   - `resource.create` (bad parentId → cross-org) → 404 `NOT_FOUND`.
   - `resource.list` (org-1) → returns rows.
   - `resource.list` (org-2) → returns `[]`.

If any step fails, fix it and re-run. Do not proceed to the next phase until Phase 11 is green.

---

## VERIFY-ONLY MODE (cloned template)

**Goal:** Check an existing repo for completeness without building.

**Procedure:** For each of the eleven phases, check whether its deliverable exists:

| Phase | Deliverable | Present? |
|-------|-------------|----------|
| 1. Stack | `CLAUDE.md` has `## Stack` | ☐ |
| 2. Data layer | `schema.prisma` + migration folder | ☐ |
| 3. Seed | `prisma/seed.ts` (or equivalent) | ☐ |
| 4. Resource registry | `src/server/resources.ts` with `RESOURCES` | ☐ |
| 5. Rules | `src/server/rules.ts` with `canCreate`/`getUpgradeMessage` | ☐ |
| 6. Resource counting | `src/server/resource.service.ts` with `countResource` | ☐ |
| 7a–7h. The Block | `init.ts`, `procedures.ts`, middleware files | ☐ |
| 8. Services | `src/server/services/*.service.ts` | ☐ |
| 9. Validators | `src/lib/validators/*.schema.ts` | ☐ |
| 10. Routers | `src/server/routers/*.router.ts` + `_app.ts` mount | ☐ |
| 11. Verify | `test-guardrails.sh` passes 8/8 | ☐ |

**Report:** A table of present/missing layers, plus any recommended next phases to complete.

---

## SYSTEM CHANGE MODE

**Goal:** Handle modifications to an existing guardrail system (e.g., "add Better Auth", "add Redis", "upgrade to microservices", "add a new plan-gate pattern").

**Procedure:**
1. **Read state:** `CLAUDE.md` and `guardrail-notes.md`.
2. **Ask:** What exactly changed? What is the new requirement?
3. **Propose diff:** Across `Block / registry / CLAUDE.md / ESLint`. Show before/after for each file.
4. **Ask:** Approve the diff before applying.
5. **Apply:** Make the changes (only this skill may modify the Block).
6. **Re-run regression:** `bash test-guardrails.sh` → must be 8/8. If below 8/8, roll back and report.
7. **Update `CLAUDE.md`:** Record the change, date, and rationale.
8. **Update `guardrail-notes.md`:** Add any new gotchas discovered.

---

## KNOWN GOTCHAS (from `guardrail-notes.md`)

1. **Prisma 7 `ssl:false`** — Local Postgres connections may require `ssl: false` in the datasource or client config; otherwise the migration/seed will fail to connect.
2. **tRPC query vs mutation** — `list` endpoints must use `.query()`; `create/update/delete` must use `.mutation()`. Mixing them breaks caching and audit logging.
3. **Restart after new route** — After adding a new router or mounting it in `_app.ts`, restart the dev server so Next.js picks up the new route.
4. **Cross-org guard** — `createX` must verify the parent resource (projectId, taskId) belongs to the same org as `ctx.tenant.organizationId` before writing. The Block cannot catch this; it is a service-layer integrity check.
5. **Read cap ≤3 files** — Read at most 3 files per step unless the user explicitly authorizes more. Use `rg -l` / `./scripts/find-sot.sh` for discovery first.
6. **Exhaustive `ResourceKey`** — Because `ResourceKey = keyof typeof RESOURCES`, adding a resource key to `RESOURCES` forces updates to `rules.ts` (`canCreate` limits + `getUpgradeMessage` messages) and `resource.service.ts` (`countResource` switch), or typecheck fails.

---

## STACK SUB-RECIPES

### Next.js branch (fully written)

**Data layer (Phase 2):**
- `prisma/schema.prisma`: Define models with `@@index([organizationId])`, relations with opposite fields, and enums (`Plan`, `Role`, `TaskStatus`, etc.).
- `prisma migrate dev --name <descriptive>`: Apply the migration.
- `prisma generate`: Regenerate the client after schema changes.

**Resource counting (Phase 6):**
```ts
import "server-only";
import { prisma } from "@/server/db/prisma";
import { type ResourceKey } from "@/server/resources";

export async function countResource(resource: ResourceKey, organizationId: string): Promise<number> {
  switch (resource) {
    case "project": return prisma.project.count({ where: { organizationId } });
    case "member": return prisma.membership.count({ where: { organizationId } });
    case "task": return prisma.task.count({ where: { organizationId } });
    case "comment": return prisma.comment.count({ where: { organizationId } });
    default: throw new Error(`Unhandled resource: ${resource}`);
  }
}
```

**Cross-org guard (services):**
```ts
const parent = await prisma.parent.findFirst({
  where: { id: input.parentId, organizationId: scope.organizationId },
  select: { id: true },
});
if (!parent) {
  throw new DomainError("NOT_FOUND", "Parent not found in this organization");
}
```

**SSL:** If local Postgres requires it, add `ssl: false` to the datasource URL or client config.

**Python branch (placeholder):**
- Data layer: SQLAlchemy models + Alembic migration (`alembic revision --autogenerate`, `alembic upgrade head`).
- Resource counting: SQLAlchemy `select(func.count()).where(Model.organization_id == organization_id)`.
- Services: SQLAlchemy session, scoped by `organization_id`.
- Validators: Pydantic models (or Zod-equivalent).
- Routers: FastAPI `APIRouter` with dependency injection for auth/tenant.

**Other stacks (placeholders):** Fill in when the user selects the stack in Phase 1.

---

## DELIVERY CHECKLIST (end of every phase)

- [ ] User approved the proposal before building
- [ ] Build applied
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 errors from this skill's code)
- [ ] `bash test-guardrails.sh` → 8/8 passed
- [ ] For Phase 7 sub-steps: single curl verified per sub-step
- [ ] `CLAUDE.md` updated with phase status
- [ ] `guardrail-notes.md` exists (created on first run if missing)
- [ ] `guardrail-notes.md` updated with any new gotchas
- [ ] Git not used

---

*This skill is project-local. It lives at `.claude/skills/setup-guardrail-system/SKILL.md` and must not be copied to `~/.claude/skills` or any global path.*
