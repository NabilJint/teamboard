"use client";

import Image from "next/image";
import { forwardRef } from "react";

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
  className?: string;
}

export const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ className, eyebrow, headline, subhead, primaryLabel, primaryHref, secondaryLabel, secondaryHref, image, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "relative w-full overflow-hidden bg-[var(--surface-midnight-canvas)] text-[var(--color-frost-glow)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {/* Ambient blueprint grid layer */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" />
        {/* Spotlight halo at top center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gradient-spotlight)] blur-[120px] opacity-50 pointer-events-none"
        />
        {eyebrow && (
          <div className="relative z-10 mx-auto max-w-[var(--page-max-width)] px-6 pt-20 pb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[rgba(186,215,247,0.12)] to-transparent" />
              <span className="text-[15px] font-[var(--font-dotdigital)] font-medium tracking-[0.1em] text-[var(--color-moon-mist)] uppercase">
                {eyebrow}
              </span>
              <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[rgba(186,215,247,0.12)] to-transparent" />
            </div>
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-[var(--page-max-width)] px-6 pb-24 text-center lg:text-left">
          <h1
            className="text-[48px] font-[var(--font-aeonikpro)] font-medium leading-[1.17] tracking-[0px] text-[var(--color-ice-highlight)] bg-[var(--gradient-ice-highlight)] bg-clip-text text-transparent sm:text-[64px] lg:text-[96px] xl:text-[120px]"
          >
            {headline}
          </h1>
          {subhead && (
            <p className="mt-8 text-[16px] font-[var(--font-untitled-sans)] font-medium leading-[1.5] tracking-[-0.16px] text-[var(--color-moon-mist)] max-w-[640px] mx-auto lg:mx-0 lg:text-left">
              {subhead}
            </p>
          )}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-badges)] px-6 py-2.5 text-sm font-medium text-[var(--color-pure-white)] bg-[var(--color-void-violet)] shadow-[0_8px_16px_rgba(102,58,243,0.35)] hover:bg-[#5b31e6] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(102,58,243,0.4)]"
            >
              {primaryLabel}
            </a>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-frost-glow)] border border-[rgba(186,215,247,0.12)] bg-[rgba(186,214,247,0.06)] hover:bg-[rgba(186,214,247,0.12)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(186,215,247,0.24)]"
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
        {image && (
          <div className="relative z-10 mx-auto max-w-[var(--page-max-width)] px-6 pb-20 flex justify-center lg:justify-end opacity-90">
            <Image
              src={image}
              alt="hero preview"
              width={900}
              height={600}
              className="max-w-full h-auto drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>
        )}
      </div>
    );
  },
);

Hero.displayName = "Hero";
