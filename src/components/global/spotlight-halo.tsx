"use client";

import { forwardRef } from "react";

export interface SpotlightHaloProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  opacity?: number;
}

// AuthKit Spotlight Halo: conic-gradient spotlight at top center
// (transparent → rgba(124,145,182,0.5) → transparent) to anchor the composition.
export const SpotlightHalo = forwardRef<HTMLDivElement, SpotlightHaloProps>(
  ({ className, opacity = 50, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gradient-spotlight)] blur-[120px] pointer-events-none",
          `opacity-${opacity}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

SpotlightHalo.displayName = "SpotlightHalo";
