# Design Reference — TeamBoard Design System

This document captures the design-system tokens extracted from the three reference images and implemented in `src/components/global/`.

## Reference images (design source of truth)

The original screenshots are provided inline in the design task conversation:

| Image | Product | Role |
|-------|---------|------|
| Image 1 | **Aeline** — AI & strategy consulting | Hero layout, stat cards, green CTA, blue hero gradient |
| Image 2 | **Travexa** — Travel intelligence & well-being | Clean travel app, pill CTAs, feature chips, phone mockups |
| Image 3 | **Liquid Glass UI Kit** | Glassmorphism, gradient buttons, toggle, segmented control |

> Note: the inline images are the authoritative visual reference. They are not stored as binary files in this repo (they were supplied as conversation attachments). This markdown file records the extracted tokens so the system can be re-derived from the images later.

---

## Design tokens

Defined in `src/app/globals.css` (`@theme inline`) and mirrored in `src/lib/design-tokens.ts`.

### Radius
| Token | CSS var | Value |
|-------|---------|-------|
| `--radius-card` | `var(--radius-card)` | `1.5rem` (large rounded cards) |
| `--radius-pill` | `var(--radius-pill)` | `9999px` (fully rounded buttons/badges) |
| `--radius-sm` | `var(--radius-sm)` | `0.5rem` |

### Colors (light mode / dark mode)
| Token | Light | Dark | Source image |
|-------|-------|------|--------------|
| `--color-primary` | `#6366f1` (indigo) | inherited | Image 3 primary button |
| `--color-primary-start` | `#8b5cf6` (violet) | — | Image 3 gradient start |
| `--color-primary-end` | `#2563eb` (blue) | — | Image 3 gradient end |
| `--color-secondary` | `#06b6d4` (cyan) | — | Image 3 secondary button |
| `--color-accent` | `#84cc16` (lime) | — | Image 1 "GET STARTED" CTA |
| `--color-glass-bg` | `rgba(255,255,255,0.55)` | `rgba(17,24,39,0.45)` | Image 3 glass cards |
| `--color-glass-border` | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.12)` | Image 3 glass borders |

### Shadows
| Token | Light | Dark |
|-------|-------|------|
| `--shadow-glass` | `0 8px 32px rgba(0,0,0,0.12)` | `0 8px 32px rgba(0,0,0,0.45)` |
| `--shadow-card` | `0 4px 20px rgba(0,0,0,0.06)` | `0 4px 20px rgba(0,0,0,0.35)` |

### Gradients (arbitrary Tailwind values)
- `primary`: violet → indigo → blue (Image 3 "Primary Button")
- `secondary`: cyan → teal → emerald (Image 3 "Secondary Button")
- `accent`: lime → emerald → green (Image 1 "GET STARTED")
- `glassCard`: pink → purple → indigo (Image 3 "Modern Glass UI Design" card)

---

## Components (`src/components/global/`)

| Component | File | Props | Image source |
|-----------|------|-------|--------------|
| `Button` | `button.tsx` | variant, size, isLoading, disabled | Image 1 CTAs, Image 3 gradient buttons |
| `GlassCard` | `glass-card.tsx` | padding, border | Image 3 glass cards |
| `Hero` | `hero.tsx` | headline, subhead, primary/secondary CTAs, badge, image | Image 1 hero, Image 2 hero |
| `StatCard` | `stat-card.tsx` | value, label, icon, trend, variant | Image 1 stat cards |
| `StatGrid` | `stat-grid.tsx` | children | Image 1 stats row |
| `Badge` | `badge.tsx` | variant, size | Image 1 "BUY TEMPLATE", Image 2 "Join 3k+" |
| `SegmentedControl` | `segmented-control.tsx` | options, value, onValueChange | Image 3 "Toast / Tabs" |
| `GlassInput` | `glass-input.tsx` | placeholder, leftIcon, rightElement | Image 3 "Search projects…" |
| `Toggle` | `toggle.tsx` | checked, onCheckedChange, labelOn/Off | Image 3 toggle switch |
| `NavBar` | `nav-bar.tsx` | brand, navItems, ctaLabel, badgeLabel | Image 1 / Image 2 top navs |

All components avoid hardcoded colors (no `text-white`, `bg-black`). They use Tailwind semantic tokens (`text-foreground`, `bg-background`) plus the brand CSS variables above, so light/dark mode and `globals.css` work.

---

## Dev-only showcase route

Route: `/showcase` (`src/app/showcase/page.tsx`)

- Guards on `process.env.NODE_ENV === "development"` — renders `null` in production.
- Renders every component above with representative content from the reference images.

---

## Usage example

```tsx
import { Button, GlassCard, Hero, StatCard, Badge } from "@/components/global";

<Hero
  headline="Building the future with AI and strategy"
  subhead="We help organizations unlock growth through data-driven consulting."
  primaryLabel="Get Started"
  primaryHref="/get-started"
  secondaryLabel="View Demo"
  secondaryHref="/demo"
  badge="Rated 4.9/5 by 4,900+ clients"
/>

<Button variant="primary" size="lg">Create task</Button>
<Badge variant="accent">PRO</Badge>
```

---

## Conventions followed (per `.claude/CLAUDE.md`)

- Global components live in `src/components/global/`.
- No hardcoded colors; use Tailwind tokens + CSS vars.
- Route-only components would live under `src/app/<route>/_components/`.
- Every router input uses a Zod schema from `src/lib/validators/` (not applicable to pure UI components).
