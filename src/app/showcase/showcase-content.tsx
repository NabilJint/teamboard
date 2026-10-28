"use client";

import {
  SectionEyebrow,
  BackgroundGrid,
  SpotlightHalo,
  Hero,
  Button,
  Badge,
  StatGrid,
  StatCard,
  GlassCard,
  AuthFormCard,
  GlassInput,
  SegmentedControl,
  FeatureIconTile,
} from "@/components/global";

export default function ShowcaseContent() {
  return (
    <main className="max-w-[var(--page-max-width)] mx-auto px-6 py-12 space-y-[var(--section-gap)]">
      <section className="space-y-4">
        <SectionEyebrow label="AuthKit Design System" />
        <h1 className="text-[44px] font-[var(--font-aeonikpro)] font-medium leading-[1.16] tracking-[0px] text-[var(--color-ice-highlight)] bg-[var(--gradient-ice-highlight)] bg-clip-text text-transparent">
          Design System Showcase
        </h1>
        <p className="text-[16px] font-[var(--font-untitled-sans)] font-medium leading-[1.5] tracking-[-0.16px] text-[var(--color-moon-mist)] max-w-[640px]">
          A dark, frosted-glass design system generated from the AuthKit
          style reference — midnight canvas, blueprint grid, void violet
          accent, and glass-card surfaces lit from below. This route is
          <strong>dev-only</strong> and will not render in production.
        </p>
        <div className="flex gap-4">
          <a
            href="https://tailwindcss.com/"
            className="text-sm font-medium text-[var(--color-fog-veil)] hover:text-[var(--color-frost-glow)] transition-colors"
          >
            Tailwind CSS reference
          </a>
        </div>
      </section>

      {/* Hero */}
      <section className="relative">
        <BackgroundGrid />
        <SpotlightHalo />
        <Hero
          eyebrow="Introducing AuthKit"
          headline="Frosted glass cathedral at midnight"
          subhead="A midnight product-launch aesthetic: near-black canvas with frosted-glass surfaces, blueprint grid, and luminous text lit from behind a glass layer."
          primaryLabel="Get started"
          primaryHref="/get-started"
          secondaryLabel="View demo"
          secondaryHref="/demo"
        />
      </section>

      {/* Buttons */}
      <section>
        <SectionEyebrow label="Buttons" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Buttons</h2>
        <p className="text-[14px] font-[var(--font-untitled-sans)] font-medium leading-[1.43] tracking-[0px] text-[var(--color-moon-mist)] max-w-[640px]">
          Pill buttons, outlined secondary, and the sole chromatic Void
          Violet CTA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button variant="primary-ghost" size="md">
            Get started
          </Button>
          <Button variant="outlined" size="md">
            Learn more
          </Button>
          <Button variant="violet-cta" size="md">
            Continue
          </Button>
          <Button variant="primary-ghost" size="md" disabled>
            Disabled
          </Button>
          <Button variant="violet-cta" size="md" isLoading>
            Loading
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <SectionEyebrow label="Badges" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Badges</h2>
        <div className="flex flex-wrap gap-3 mt-6">
          <Badge variant="default" size="md">
            Default
          </Badge>
          <Badge variant="luminous" size="md">
            Luminous
          </Badge>
          <Badge variant="default" size="sm">
            Small
          </Badge>
        </div>
      </section>

      {/* Stat cards */}
      <section>
        <SectionEyebrow label="Stat Cards" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Stat Cards</h2>
        <StatGrid className="mt-6">
          <StatCard value="120+" label="Collaborating with leading AI providers" />
          <StatCard value="100%" label="Commitment to measurable" />
          <StatCard value="520k+" label="Analyzed monthly" variant="luminous" />
          <StatCard value="20+" label="Continents" variant="deep" />
        </StatGrid>
      </section>

      {/* Glass cards */}
      <section>
        <SectionEyebrow label="Glass Surfaces" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Glass Cards</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          <GlassCard padding="md">
            <h3 className="text-[18px] font-[var(--font-untitled-sans)] font-medium leading-[1.33] tracking-[0px] text-[var(--color-frost-glow)]">Feature Card</h3>
            <p className="mt-2 text-[14px] font-[var(--font-untitled-sans)] font-medium leading-[1.43] tracking-[0px] text-[var(--color-moon-mist)]">
              Glass plate lit from below — frosted surface, no hard border.
            </p>
          </GlassCard>
          <GlassCard padding="md" elevated={false}>
            <h3 className="text-[18px] font-[var(--font-untitled-sans)] font-medium leading-[1.33] tracking-[0px] text-[var(--color-frost-glow)]">Flat Glass</h3>
            <p className="mt-2 text-[14px] font-[var(--font-untitled-sans)] font-medium leading-[1.43] tracking-[0px] text-[var(--color-moon-mist)]">
              Nearly invisible tint — reads as glass above the canvas.
            </p>
          </GlassCard>
          <AuthFormCard padding="md">
            <h3 className="text-[18px] font-[var(--font-untitled-sans)] font-medium leading-[1.33] tracking-[0px] text-[var(--color-frost-glow)]">Auth Modal</h3>
            <p className="mt-2 text-[14px] font-[var(--font-untitled-sans)] font-medium leading-[1.43] tracking-[0px] text-[var(--color-moon-mist)]">
              Deep glass surface with three-layer shadow stack.
            </p>
          </AuthFormCard>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <SectionEyebrow label="Inputs" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Glass Input</h2>
        <div className="w-full max-w-md mt-6 relative flex items-center">
          <span className="absolute left-3 flex items-center pointer-events-none text-[var(--color-fog-veil)]">🔍</span>
          <GlassInput placeholder="Search projects…" />
        </div>
      </section>

      {/* Toggle */}
      <section>
        <SectionEyebrow label="Toggle / Theme" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Theme Toggle</h2>
        <div className="flex items-center gap-4 mt-6">
          <SegmentedControl
            value="dark"
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
            onValueChange={() => {}}
          />
        </div>
      </section>

      {/* Feature icon tiles */}
      <section>
        <SectionEyebrow label="Feature Icons" />
        <h2 className="text-[28px] font-[var(--font-untitled-sans)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">Feature Icon Tiles</h2>
        <div className="flex flex-wrap gap-6 mt-6">
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            label="Single Sign-On"
          />
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
            label="Password"
          />
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            label="MFA"
          />
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            label="Social Login"
          />
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            label="RBAC"
          />
          <FeatureIconTile
            icon={<svg className="h-5 w-5 text-[var(--color-frost-glow)]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
            label="Magic Auth"
          />
        </div>
      </section>
    </main>
  );
}
