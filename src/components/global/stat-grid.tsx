"use client";

import { type StatCardProps } from "./stat-card";

interface StatGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StatGrid({ children, className }: StatGridProps) {
  const classes = [
    "grid grid-cols-1 gap-[var(--element-gap)] sm:grid-cols-2 lg:grid-cols-4",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

StatGrid.displayName = "StatGrid";

export type { StatCardProps };
