"use client";

import { forwardRef } from "react";

export interface AuthFormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const paddingClasses: Record<NonNullable<AuthFormCardProps["padding"]>, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

// AuthKit Auth-Form Modal Card: 16px radius, bg rgba(5,6,15,0.97),
// padding 24-32px. Three-layer shadow stack:
// inset 0 1px 1px rgba(216,236,248,0.2), inset 0 24px 48px rgba(168,216,245,0.06),
// 0 16px 32px rgba(0,0,0,0.3). Floats above the hero.
export const AuthFormCard = forwardRef<HTMLDivElement, AuthFormCardProps>(
  ({ className, padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "relative rounded-[var(--radius-modals)] overflow-hidden " +
            "bg-[var(--surface-deep-glass)] backdrop-blur-md " +
            "shadow-[var(--shadow-subtle-6)] border border-[rgba(186,215,247,0.12)] " +
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

AuthFormCard.displayName = "AuthFormCard";
