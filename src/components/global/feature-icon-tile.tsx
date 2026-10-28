"use client";

import { forwardRef } from "react";

export interface FeatureIconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
}

// AuthKit Feature Icon Tile: 9999px radius (perfect circle), ~56-64px square,
// background frosted tint, outlined line-art glyph icon in #d1e4fa (1.5px stroke).
const sizeClasses: Record<NonNullable<FeatureIconTileProps["size"]>, string> = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

export const FeatureIconTile = forwardRef<HTMLDivElement, FeatureIconTileProps>(
  ({ className, icon, label, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "flex flex-col items-center gap-2",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <div
          className={[
            "flex items-center justify-center rounded-[var(--radius-iconcontainers)] bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] " +
              sizeClasses[size],
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {icon}
        </div>
        <p className="text-[12px] font-[var(--font-untitled-sans)] font-medium leading-[1.33] tracking-[0px] text-[var(--color-moon-mist)]">
          {label}
        </p>
      </div>
    );
  },
);

FeatureIconTile.displayName = "FeatureIconTile";
