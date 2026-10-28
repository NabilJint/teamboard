"use client";

import { forwardRef } from "react";

export interface SegmentedControlProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md";
}

const sizeClasses: Record<NonNullable<SegmentedControlProps["size"]>, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-1.5 text-sm",
};

// AuthKit Theme Toggle / Segmented Control: pill-shaped, 999px radius,
// two segments (moon / sun), 32px tall. Active segment has brighter frost
// background; inactive is transparent.
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, options, value, onValueChange, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "inline-flex items-center gap-1 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] shadow-sm",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onValueChange(option.value)}
              className={[
                "relative flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-200 " +
                  sizeClasses[size] +
                  (active
                    ? "bg-[rgba(186,214,247,0.12)] text-[var(--color-frost-glow)] shadow-sm"
                    : "bg-transparent text-[var(--color-fog-veil)] hover:text-[var(--color-frost-glow)]"),
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
