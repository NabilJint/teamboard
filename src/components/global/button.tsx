"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary-ghost" | "outlined" | "violet-cta";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
  lg: "px-6 py-2 text-base",
};

// AuthKit button rules:
// - Primary ghost: 999px radius, padding 8px 16px, bg rgba(186,214,247,0.06),
//   text #ffffff, 1px inset border rgba(186,215,247,0.12), weight 500, 14px.
//   Hover lightens frost wash to 0.12.
// - Outlined: 999px radius, padding 8px 16px, transparent bg, text #d1e4fa,
//   1px inset border rgba(186,215,247,0.12).
// - Violet CTA (sole chromatic): solid #663af3, white text, 6px radius,
//   padding 12px 24px, weight 500.
const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  "primary-ghost":
    "rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-pure-white)] bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] shadow-[var(--shadow-subtle)] hover:bg-[rgba(186,214,247,0.12)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(186,215,247,0.24)] active:scale-[0.98]",
  outlined:
    "rounded-full px-4 py-1.5 text-sm font-medium text-[var(--color-frost-glow)] border border-[rgba(186,215,247,0.12)] bg-transparent hover:bg-[rgba(186,214,247,0.06)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(186,215,247,0.24)] active:scale-[0.98]",
  "violet-cta":
    "rounded-[var(--radius-badges)] px-6 py-2.5 text-sm font-medium text-[var(--color-pure-white)] bg-[var(--color-void-violet)] shadow-[0_8px_16px_rgba(102,58,243,0.35)] hover:bg-[#5b31e6] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(102,58,243,0.4)] active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary-ghost", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 transition-all duration-200 " +
      "disabled:opacity-50 disabled:pointer-events-none";
    return (
      <button
        ref={ref}
        className={[base, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(" ")}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin text-[var(--color-pure-white)]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
