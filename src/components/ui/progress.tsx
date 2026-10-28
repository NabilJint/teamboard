"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className }: ProgressProps) {
  return (
    <div
      className={cn(
        "w-full h-4 rounded-full border border-border bg-slate-200",
        className
      )}
    >
      <div
        className="h-full bg-slate-900 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
