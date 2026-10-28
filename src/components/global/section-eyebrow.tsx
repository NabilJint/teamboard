"use client";

import { forwardRef } from "react";

export interface SectionEyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  className?: string;
}

// AuthKit Section Eyebrow Label: 15px dotDigital, weight 400, letter-spacing 0.10em,
// color #c7d3ea, centered. Flanked by thin horizontal lines that fade from
// transparent to rgba(186,215,247,0.12) and back.
export const SectionEyebrow = forwardRef<HTMLDivElement, SectionEyebrowProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex items-center justify-center gap-3 mb-8",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[rgba(186,215,247,0.12)] to-transparent" />
        <span className="text-[15px] font-[var(--font-dotdigital)] font-medium tracking-[0.1em] text-[var(--color-moon-mist)] uppercase">
          {label}
        </span>
        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[rgba(186,215,247,0.12)] to-transparent" />
      </div>
    );
  },
);

SectionEyebrow.displayName = "SectionEyebrow";
