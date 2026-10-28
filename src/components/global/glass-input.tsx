"use client";

import { forwardRef } from "react";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

// AuthKit Text Input: 6px radius, background rgba(199,211,234,0.06),
// text #ffffff, placeholder #c7d3ea at ~60% opacity,
// 1px inset border rgba(186,215,247,0.12). Focus increases border opacity to 0.24.
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, placeholder, leftIcon, rightElement, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <div className="absolute inset-0 flex items-center pointer-events-none pl-3">
          {leftIcon && <span className="text-[var(--color-fog-veil)]">{leftIcon}</span>}
        </div>
        <input
          ref={ref}
          placeholder={placeholder}
          className={[
            "w-full rounded-[var(--radius-inputs)] border border-solid border-[var(--color-glass-edge)] " +
              "bg-[rgba(199,211,234,0.06)] backdrop-blur-md " +
              "px-4 pl-10 pr-3 py-2 text-sm text-[var(--color-pure-white)] placeholder-[var(--color-moon-mist)]/60 " +
              "outline-none focus:border-[rgba(186,215,247,0.24)] focus:ring-1 focus:ring-[rgba(186,215,247,0.24)] transition-colors",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 flex items-center pr-2">{rightElement}</div>
        )}
      </div>
    );
  },
);

GlassInput.displayName = "GlassInput";
