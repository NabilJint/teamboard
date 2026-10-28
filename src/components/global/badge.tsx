"use client";

import { forwardRef } from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "luminous";
  size?: "sm" | "md";
}

// AuthKit Badge / Tag: 6px radius, background rgba(199,211,234,0.12),
// text #d1e4fa, padding 4px 8px, 12px Untitled Sans weight 500.
const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[var(--color-luminous-fill)] text-[var(--color-frost-glow)] shadow-[var(--shadow-subtle-3)]",
  luminous: "bg-[var(--color-frost-glow)]/10 text-[var(--color-ice-highlight)] border border-[var(--color-glass-edge)]",
};

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-[12px]",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          "inline-flex items-center gap-1 rounded-[var(--radius-badges)] font-medium whitespace-nowrap transition-colors",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
