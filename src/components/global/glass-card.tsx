"use client";

import { forwardRef } from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  border?: boolean;
  elevated?: boolean;
}

const paddingClasses: Record<NonNullable<GlassCardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// AuthKit Glass Card (Feature): 16px radius, bg rgba(186,214,247,0.03),
// padding 24px, no hard border. Elevation built from inset frost highlight +
// soft outer halo — reads as a glass plate lit from behind.
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, padding = "md", border = false, elevated = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "relative rounded-[var(--radius-cards)] overflow-hidden " +
            "bg-[var(--surface-frosted-glass)] backdrop-blur-[16px] backdrop-saturate-[180%] " +
            (border ? "border border-[var(--color-glass-edge)]" : "border-transparent") +
            (elevated ? " shadow-[var(--shadow-subtle-4)]" : " shadow-sm") +
            " " +
            paddingClasses[padding],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";
