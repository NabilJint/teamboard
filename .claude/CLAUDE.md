# CLAUDE.md — TeamBoard Guardrails

## Architecture
Router → protectedProcedure/planGatedProcedure → Service → Prisma → DB
- Router: business logic only, never imports Prisma
- Service: DB only, always import "server-only" (Phase 5)
- organizationId NEVER in router input — from ctx.tenant (Phase 6)

## TypeScript Rules (enforced by ESLint)
- NEVER use any or unknown
- NEVER use @ts-ignore or @ts-expect-error
- Types come from @/generated/prisma/client or are derived
- Do not hand-roll types Prisma already generates
- Run `npm run typecheck` before handing over

## Resources & Plans
- Plan limits live in src/server/resources.ts (single source of truth)
- Do not hardcode "FREE" or "PRO" elsewhere
- Plan type comes from Prisma enum

## Git
- NEVER use git. Do not commit, checkout, or read session history.

## Delivery
- Never leave a feature incomplete
- Run `npm run typecheck` before saying "done"

## Grep-First Discovery

Before reading any file to understand or modify code:
1. Run `rg -l "SOT: <keyword>" src/` (or `./scripts/find-sot.sh <keyword>`)
2. This returns file paths only — no contents, ~10 tokens per path
3. Read ONLY the file whose path matches what you need
4. Do NOT read multiple files "to be safe" — grep first, read one

Use `rg -l` (paths only). Never use `rg` without -l (returns content).
Never use `grep -rn` for discovery (returns content, expensive).

Keywords available (16 SOT blocks):
- auth, tenant, permission, plan, rate-limit, audit
- resources, rules, context, procedures
- project, membership, usage, session, resource, audit


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

## Phase 10 — NEXT: Zod validation + UI rules