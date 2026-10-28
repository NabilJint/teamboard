"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { Badge } from "./badge";
import { Button } from "./button";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  brand: string;
  brandHref?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  badgeLabel?: string;
  className?: string;
}

// AuthKit Nav Bar: top navigation with brand (Untitled Sans 500 at 16px in #d1e4fa),
// nav items (ghost text buttons), and optional CTA.
export const NavBar = forwardRef<HTMLElement, NavBarProps>(
  ({ className, brand, brandHref = "/", navItems = [], ctaLabel, ctaHref, badgeLabel, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={[
          "relative z-50 flex h-16 items-center justify-between px-6 py-3 border-b border-[var(--color-glass-edge)] bg-[var(--surface-midnight-canvas)]/90 backdrop-blur-md",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex items-center gap-3">
          {brandHref ? (
            <Link href={brandHref} className="flex items-center gap-2">
              <span className="text-[16px] font-[var(--font-untitled-sans)] font-medium tracking-[-0.01em] text-[var(--color-frost-glow)]">
                {brand}
              </span>
            </Link>
          ) : (
            <span className="text-[16px] font-[var(--font-untitled-sans)] font-medium tracking-[-0.01em] text-[var(--color-frost-glow)]">
              {brand}
            </span>
          )}
          {badgeLabel && <Badge variant="default" size="sm">{badgeLabel}</Badge>}
        </div>
        <div className="hidden lg:flex items-center gap-6 text-[13px] font-[var(--font-untitled-sans)] font-medium text-[var(--color-moon-mist)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-frost-glow)] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {ctaLabel && ctaHref && (
            <Link href={ctaHref}>
              <Button variant="violet-cta" size="sm">
                {ctaLabel}
              </Button>
            </Link>
          )}
        </div>
      </nav>
    );
  },
);

NavBar.displayName = "NavBar";
