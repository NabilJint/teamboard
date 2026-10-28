---
name: add-feature
description: Adds ONE feature to an existing guardrail system. Never touches the Block, middleware, CLAUDE.md, or ESLint — those are setup concerns owned by setup-guardrail-system. Two feature types: DATA (CRUD resource with cross-org guard) and UI (page/view/component). Stack-agnostic — reads stack facts from CLAUDE.md written by setup-guardrail-system; DB-specific rules live in sub-recipes. Project-local only — do NOT write to ~/.claude/skills or any global path.
---

**How I talk to you: every response starts with a 1-2 sentence plain-English summary of what I'm about to do. No jargon. If you don't understand something, say so — I'll simplify.**

## HARD RULES (read first, never violate)

1. **Never touch the Block.** The Block = middleware, procedures, `init.ts`. If the feature needs a system change (new library, new middleware, new registry pattern, new DB table the Block depends on), STOP and hand off to `setup-guardrail-system`. Do not modify `CLAUDE.md` or ESLint config — those are setup concerns.
2. **ALWAYS explain in super simple terms — like I'm 5.** Short sentences. No jargon. Say what and why before how. Say "I don't know" when unsure. Show the plan in plain English before showing any code.
3. **Read at most 3 files before proposing:** the closest existing service, the closest existing router, and `resources.ts` (data features) or the closest existing page/component (UI features). Use `./scripts/find-sot.sh` for discovery — do not read "to be safe."
4. **`organizationId` never appears in Zod input** (or equivalent validator). It comes from `ctx.tenant` / request context set by the Block.
5. **New data features verify the parent FK belongs to `ctx.tenant.organizationId` before writing** (cross-org guard).
6. **Writes use `gatedAuditedProcedure`** (or stack equivalent). **Reads use `orgProcedure`** (or stack equivalent).
7. **Run typecheck, lint, and `test-guardrails.sh` (must stay 8/8) before saying done.**
8. **Data features: run 4 curls** — create valid, create bad-parent → 404, list-own, list-other → empty.
9. **Never run git.**
10. **Read `CLAUDE.md` for stack facts.** Do not re-derive the stack.
11. **Every list query fetches only the fields it needs (no `SELECT *`).** How → stack sub-recipe.
12. **Never loop over results to fetch relations.** Use a single query with joins / includes / eager loading. No N+1.
13. **Every list query supports pagination** (`take`/`limit` + cursor). No unbounded results.
14. **Do NOT add caching** (e.g., Next.js `use cache`, Redis cache) unless the user explicitly asks. Caching adds invalidation complexity that breaks the guardrail model. Caching is a system change → hand off to setup skill.

---

## STEP 0 — Read State

Before proposing anything, read:

1. `.claude/CLAUDE.md` — stack facts, architectural decisions, prior gotchas (written by `setup-guardrail-system`).
2. `guardrail-notes.md` (at project root) — **only if it exists.** Skip if missing.

Capture:
- The stack (Next.js / Python / other) from `CLAUDE.md`.
- The existing pattern for services, routers, and validators.
- Any gotchas from `guardrail-notes.md`.

---

## STEP 1 — Which Feature Type?

Ask the user: **"Is this a data feature (CRUD resource) or a UI feature (page/view/component)?"**

| Type | Recipe | Blocks the Block? |
|------|--------|-------------------|
| **Data** | Step 2 — Data feature recipe | No — touches service, validator, router only |
| **UI** | Step 3 — UI feature recipe | No — touches page/component only |
| **System change** | Hand off to `setup-guardrail-system` | Yes — needs Block/CLAUDE.md/ESLint changes |

If the user describes something that needs a new library, new middleware, new registry pattern, or new DB table the Block depends on → **STOP**. Say:

> "This needs the setup skill (setup-guardrail-system) — it's a system change, not a feature. Want me to hand off?"

Wait for confirmation before proceeding.

---

## STEP 2 — Data Feature Recipe (12 Steps)

Assumes a new CRUD resource (comment, label, invite, attachment, webhook, savedView, template, customField, apiKey). Follows the same 12-step pattern as task and comment.

### Step 2.1 — Propose the feature

**Propose:**
- Resource name (singular): e.g., `comment`, `label`, `invite`
- Fields: `id`, `title`/`content`, `parentId` (the FK to the parent resource), `organizationId`, `createdAt`, `updatedAt`, plus any feature-specific fields
- Plan limits: `FREE` number, `PRO` Infinity (add to `RESOURCES` in `resources.ts`)
- Permissions map: `OWNER`, `ADMIN`, `MEMBER` → array of permission strings
- `upgradeMessage` string

**Ask:** Approve the proposal before building.

### Step 2.2 — Add to `resources.ts`

**Rules:**
- Add `RESOURCES.<resource>` entry with `FREE`, `PRO`, `permissions`, `upgradeMessage`.
- `ResourceKey = keyof typeof RESOURCES` is exhaustive — adding a key here forces updates to `rules.ts` and `resource.service.ts` (Step 2.3 and 2.4) or typecheck fails.

**Build:** Edit `src/server/resources.ts` (Next.js) or stack equivalent.

### Step 2.3 — Update `rules.ts`

**Rules:**
- Add `resource` to `canCreate` limits map: `{ FREE: N, PRO: Infinity }`
- Add `resource` to `getUpgradeMessage` messages map

**Build:** Edit `src/server/rules.ts` (Next.js) or stack equivalent.

### Step 2.4 — Update `resource.service.ts`

**Rules:**
- Add `case "<resource>": return prisma.<resource>.count({ where: { organizationId } });`
- Must handle every `ResourceKey` or throw `Unhandled resource` in default.

**Build:** Edit `src/server/resource.service.ts` (Next.js) or stack equivalent.

### Step 2.5 — Schema migration

**Goal:** Add the DB table for the new resource.

**Implementation:** Stack sub-recipe (Next.js/Prisma below). For Prisma: add model to `schema.prisma`, run `prisma migrate dev --name add_<resource>`, run `prisma generate`.

**Rules:**
- `organizationId` is a required NOT NULL column on the new table (table starts empty, so this is safe).
- Add opposite relation field on parent model (e.g., `Task.comments Comment[]`).
- Add indexes: `@@index([organizationId])`, `@@index([parentId])`.

**Verify:** Migration applied; table exists; typecheck passes.

### Step 2.6 — Validators

**File:** `src/lib/validators/<resource>.schema.ts` (Next.js) or stack equivalent.

**Rules:**
- `organizationId` is intentionally absent — it comes from `ctx.tenant`, never router input.
- `createSchema`: required fields + `parentId` + optional fields.
- `listSchema`: empty object `z.object({})` when all scoping comes from tenant context.
- Use the stack's enum type directly (e.g., `z.nativeEnum(TaskStatus)`) — no manual mapping.

**Build:** Create validator file.

**Verify:** `npm run typecheck` passes.

### Step 2.7 — Service (with cross-org guard + DB performance rules 11-14)

**File:** `src/server/services/<resource>.service.ts` (Next.js) or stack equivalent.

**Rules (stack-agnostic hard rules 11-14):**
- **Rule 11 (no SELECT *):** `select` only the fields needed — `id`, `title`, `parentId`, `organizationId`, `createdAt`, `updatedAt`. Do not fetch unused columns.
- **Rule 12 (no N+1):** Fetch relations in a single query with `include` / `join` / eager loading. Never loop over results to fetch each relation separately.
- **Rule 13 (pagination):** `listX` accepts `take` (default 20) and `cursor` (optional). Returns paginated results. Never return unbounded results.
- **Rule 14 (no caching):** No `use cache`, no Redis cache unless explicitly requested.

**Cross-org guard (Rule 5):**
```ts
const parent = await prisma.parent.findFirst({
  where: { id: input.parentId, organizationId: scope.organizationId },
  select: { id: true },
});
if (!parent) {
  throw new DomainError("NOT_FOUND", "Parent not found in this organization");
}
```

**Service start:** `import "server-only"`.

**Functions:** `createX(input, scope)` and `listX(scope, { take?, cursor? })`.

**Build:** Create service file.

**Verify:** `npm run typecheck` passes.

### Step 2.8 — Router

**File:** `src/server/routers/<resource>.router.ts` (Next.js) or stack equivalent.

**Rules:**
- `create`: `gatedAuditedProcedure("<resource>", "<resource>.create")` — plan gate + audit.
- `list`: `orgProcedure` — tenant-scoped, paginated.
- `organizationId` comes from `ctx.tenant`, never router input.
- Mount in `_app.ts` (or stack equivalent).

**Build:** Create router file; add mount entry.

**Verify:** `npm run typecheck` passes.

### Step 2.9 — Regression (8/8)

Run `bash test-guardrails.sh`. Must be 8 passed, 0 failed. If below 8/8, roll back and report.

### Step 2.10 — 4 Curls

1. `<resource>.create` (valid parentId, own org) → 200, created row returned
2. `<resource>.create` (bad parentId from other org) → 404 `NOT_FOUND`
3. `<resource>.list` (own org) → returns rows
4. `<resource>.list` (other org) → returns `[]`

### Step 2.11 — Report

Fill in the Report Template (Step 7).

---

## STEP 3 — UI Feature Recipe

Assumes a page, view, or component.

### Step 3.1 — Find the pattern

Run `./scripts/find-sot.sh <component>` or grep for the closest existing page/component. Read at most 3 files: the closest existing page, the closest existing component, and `globals.css` for tokens.

**Rules:**
- Reuse first. Never duplicate similar functionality. Extend or compose what's there.
- Global components → `src/components/global/`
- Route-only components → `src/app/<route>/_components/`
- Never hardcode colors (e.g., `text-white`). Use Tailwind tokens (`text-foreground`) so light/dark mode + `globals.css` work.
- Use slots/props for shared components.

### Step 3.2 — Propose

**Propose:** What to build, where it lives, what it reuses.

**Ask:** Approve before building.

### Step 3.3 — Build

Create page/component following the existing UI pattern.

### Step 3.4 — Verify

- `npm run typecheck` passes.
- `npm run lint` passes.
- `bash test-guardrails.sh` → 8/8 (UI changes shouldn't break guards, but confirm).
- Verify visually / manually that the page renders.

---

## STEP 4 — Hand-off Conditions

Hand off to `setup-guardrail-system` if ANY of these are true:

- The feature needs a new library or dependency.
- The feature needs new middleware or a new procedure factory.
- The feature needs a new entry in `RESOURCES` that the Block's plan gate depends on (this is actually a data feature Step 2.2 — but if the plan gate itself needs changing, hand off).
- The feature needs a new DB table that the Block's middleware queries directly.
- The feature requires changes to `CLAUDE.md` or ESLint config.
- The user explicitly asks for a system change.

**Hand-off message:**
> "This needs the setup skill (setup-guardrail-system) — it's a system change, not a feature. Want me to hand off?"

Wait for confirmation.

---

## STEP 5 — Known Gotchas (Feature Context)

1. **Read cap ≤3 files** — Read at most 3 files per step unless the user explicitly authorizes more. Use `./scripts/find-sot.sh` for discovery first.
2. **tRPC query vs mutation** — `list` endpoints use `.query()`; `create/update/delete` use `.mutation()`. Mixing them breaks caching and audit logging.
3. **Restart after new route** — After adding a new router or mounting it, restart the dev server so Next.js picks up the new route.
4. **curl `{"json":{...}}` wrapper** — tRPC HTTP expects the body as `{"json": {...}}`, not raw JSON. Always wrap curl bodies this way.
5. **Enum in validators** — Use `z.nativeEnum(PrismaEnum)` so Prisma is the single source of truth. No manual string mapping.
6. **Cross-org guard** — `createX` must verify the parent FK belongs to `ctx.tenant.organizationId` before writing. The Block cannot catch this; it's a service-layer integrity check.
7. **N+1** — Never loop over results to fetch relations. Single query with `include` / `join`.
8. **`organizationId` absent from Zod** — Hard rule (Rule 4). It comes from `ctx.tenant`, never router input.

---

## STEP 6 — Stack Sub-Recipes for DB Performance (Rules 11-14)

### Next.js / Prisma branch (fully written)

**Rule 11 — `.select()` only needed fields:**
```ts
return prisma.comment.findMany({
  select: {
    id: true,
    content: true,
    taskId: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
    assignee: { select: { id: true, name: true, email: true } },
  },
  where: { organizationId: scope.organizationId },
  orderBy: { createdAt: "desc" },
  take: take ?? 20,
  cursor: cursor ? { id: cursor } : undefined,
});
```

**Rule 12 — `include` for relations (single query, no N+1):**
```ts
include: {
  assignee: { select: { id: true, name: true, email: true } },
  project: { select: { id: true, name: true } },
},
```

**Rule 13 — `take` + cursor pagination:**
- `take` defaults to 20.
- `cursor` is `{ id: <lastId> }` when resuming after the last item.
- Never call `.findMany()` without `take`.

**Rule 14 — No caching:** No `use cache`, no Redis cache unless explicitly requested.

**Prisma < 7.4:** If query caching matters, suggest a one-line upgrade to Prisma 7.4+ for built-in query caching. Otherwise, skip — fast queries, not cached queries.

### Python / SQLAlchemy branch (placeholder)

Fill in when the stack is chosen:
- Rule 11: `load_only(Model.id, Model.title, ...)` instead of `SELECT *`.
- Rule 12: `selectinload(Model.relation)` for eager loading; `.join()` for single-query relations.
- Rule 13: `.limit(take).offset(cursor)` or keyset pagination.
- Rule 14: No Redis cache unless explicitly requested.

### Other stacks (placeholder)

Fill in when the user selects the stack in `setup-guardrail-system` Phase 1.

---

## STEP 7 — Report Template

After completing the feature, report:

- **Minutes from this prompt to done:** __
- **Files read:** __ (should be ≤3 per step)
- **Files written:** __ (list each)
- **Regression result:** 8/8 passed? (yes/no)
- **The 4 curl results:**
  1. `<resource>.create` (valid): __
  2. `<resource>.create` (bad parent → 404): __
  3. `<resource>.list` (own org): __
  4. `<resource>.list` (other org → empty): __

---

*This skill is project-local. It lives at `.claude/skills/add-feature/SKILL.md` and must not be copied to `~/.claude/skills` or any global path.*
