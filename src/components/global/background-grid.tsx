"use client";

import { forwardRef } from "react";

export interface BackgroundGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cellSize?: number;
  className?: string;
}

// AuthKit Background Grid Layer: full-bleed SVG/div layer with 1px lines at
// rgba(186,215,247,0.06), ~80-100px cell spacing, masked to fade at edges.
export const BackgroundGrid = forwardRef<HTMLDivElement, BackgroundGridProps>(
  ({ className, cellSize = 96, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "absolute inset-0 pointer-events-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="authkit-grid"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                stroke="rgba(186, 215, 247, 0.06)"
                strokeWidth="1"
              />
            </pattern>
            <mask id="grid-mask" width="100%" height="100%">
              <rect width="100%" height="100%" fill="white" />
              <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="15%" stopColor="white" stopOpacity="1" />
                <stop offset="85%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#authkit-grid)" mask="url(#grid-mask)" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-transparent opacity-[0.6]" />
      </div>
    );
  },
);

BackgroundGrid.displayName = "BackgroundGrid";
