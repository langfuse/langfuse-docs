import * as React from "react";

import { cn } from "@/lib/utils";
import { controlTextClassName } from "./button";
import { HoverCorners } from "./corner-box";

const raisedClassName =
  "border-line-structure bg-surface-bg text-text-primary [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]";

export interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  wrapperClassName?: string;
}

/**
 * Segmented-control option in the homepage tab style. Callers own the group
 * semantics (`role="tab"`/`"radio"`, `aria-*`, keyboard handling).
 */
export const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ active, className, wrapperClassName, type = "button", ...props }, ref) => (
    <div
      className={cn(
        "button-wrapper group relative flex items-center overflow-visible p-1",
        wrapperClassName,
      )}
    >
      <HoverCorners />
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-[26px] w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border px-[10px] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          controlTextClassName,
          active
            ? raisedClassName
            : "border-transparent bg-transparent text-text-tertiary hover:border-line-structure hover:bg-surface-bg hover:text-text-primary hover:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
TabButton.displayName = "TabButton";
