"use client";

import Link from "next/link";
import { forwardRef } from "react";

export interface LogoMarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

// AuthKit Logo Mark: Untitled Sans weight 500 at 16px in #d1e4fa.
const sizeClasses: Record<NonNullable<LogoMarkProps["size"]>, string> = {
  sm: "text-[14px]",
  md: "text-[16px]",
  lg: "text-[20px]",
};

export const LogoMark = forwardRef<HTMLSpanElement, LogoMarkProps>(
  ({ className, text, href, size = "md", ...props }, ref) => {
    const base =
      "flex items-center gap-2 " +
      sizeClasses[size] +
      " font-[var(--font-untitled-sans)] font-medium tracking-[-0.01em] text-[var(--color-frost-glow)]";
    if (href) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={[base, className].filter(Boolean).join(" ")}
          {...props}
        >
          {text}
        </Link>
      );
    }
    return (
      <span
        ref={ref}
        className={[base, className].filter(Boolean).join(" ")}
        {...props}
      >
        {text}
      </span>
    );
  },
);

LogoMark.displayName = "LogoMark";
