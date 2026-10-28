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



## UI / Component Rules
- Check for a reusable component first. Never duplicate similar
  functionality. Extend or compose what's there.
- If you catch yourself copying a pattern from another component,
  globalize it instead.
- Global components → src/components/global/
- Route-only components → src/app/<route>/_components/
- Never hardcode colors (e.g., text-white). Use Tailwind tokens
  (e.g., text-foreground) so light/dark mode + global.css work.
- Use slots/props for shared components (e.g., header with slots).

## Validation Rules
- Every router input must use a Zod schema from src/lib/validators/.
- Do NOT use inline z.object() in routers — put schemas in the
  validators folder so they can be shared with client forms.
- Schemas must match what the service actually does. Do not validate
  fields the service ignores.