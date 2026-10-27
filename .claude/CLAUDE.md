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
