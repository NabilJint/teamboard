"use client";

import { forwardRef } from "react";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "luminous" | "deep";
}

// AuthKit Stat Card: frosted glass surface, 16px radius, padding 24px.
// Variants: default (frosted), luminous (soft surface tint), deep (dark modal surface).
const variantClasses: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default:
    "rounded-[var(--radius-cards)] p-6 border border-transparent bg-[var(--surface-frosted-glass)] backdrop-blur-md shadow-[var(--shadow-subtle-4)]",
  luminous:
    "rounded-[var(--radius-cards)] p-6 border border-[var(--color-glass-edge)] bg-[var(--color-luminous-fill)] backdrop-blur-md shadow-[var(--shadow-subtle-5)]",
  deep:
    "rounded-[var(--radius-cards)] p-6 border border-[var(--color-glass-edge)] bg-[var(--surface-deep-glass)] backdrop-blur-md shadow-[var(--shadow-subtle-6)]",
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, icon, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-iconcontainers)] bg-[rgba(186,214,247,0.06)]">
              {icon}
            </span>
          )}
        </div>
        <div className="text-[28px] font-[var(--font-aeonikpro)] font-medium leading-[1.14] tracking-[0px] text-[var(--color-frost-glow)]">
          {value}
        </div>
        <p className="mt-2 text-[14px] font-[var(--font-untitled-sans)] font-medium leading-[1.43] tracking-[0px] text-[var(--color-moon-mist)]">
          {label}
        </p>
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
