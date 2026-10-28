"use client";

import { forwardRef, useState } from "react";

export interface ToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  size?: "sm" | "md";
}

const sizeClasses: Record<NonNullable<ToggleProps["size"]>, string> = {
  sm: "w-10 h-5",
  md: "w-12 h-6",
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked = false, defaultChecked, onCheckedChange, labelOn, labelOff, size = "md", ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internalChecked;

    const handleChange = () => {
      const next = !isOn;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={handleChange}
        className={[
          "relative inline-flex items-center shrink-0 rounded-full border border-transparent transition-colors duration-200 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-void-violet)] focus-visible:ring-offset-2 " +
            sizeClasses[size],
          isOn ? "bg-[var(--color-void-violet)]" : "bg-[var(--color-fog-veil)]/10",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <span
          className={[
            "inline-block rounded-full bg-[var(--color-pure-white)] shadow ring-0 transition-transform duration-200 ease-in-out " +
              (isOn ? "translate-x-full" : "translate-x-0") +
              (size === "sm" ? "h-3 w-3" : "h-4 w-4"),
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {labelOn || labelOff ? (
          <span className="ml-2 text-[12px] font-medium text-[var(--color-moon-mist)]">
            {isOn ? labelOn : labelOff}
          </span>
        ) : null}
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
