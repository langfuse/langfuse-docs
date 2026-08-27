import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { FeatureTabData } from "./types";

export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  feature: FeatureTabData;
  isActive: boolean;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ feature, isActive, className, ...props }, ref) => {
    const Icon = feature.icon;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${feature.id}`}
        id={`tab-${feature.id}`}
        className={cn(
          "group relative inline-flex shrink-0 items-center gap-1.5 px-3 py-2",
          "whitespace-nowrap rounded-[1px] border border-transparent",
          "text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
          "transition-colors duration-150 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isActive
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary",
          className,
        )}
        {...props}
      >
        <Icon
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 transition-colors duration-150 ease-out",
            isActive
              ? "text-text-primary"
              : "text-text-tertiary group-hover:text-text-primary",
          )}
        />
        <span>{feature.name}</span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-2 bottom-0 h-px transition-colors duration-150 ease-out",
            isActive ? "bg-text-primary" : "bg-transparent",
          )}
        />
      </button>
    );
  },
);

TabButton.displayName = "TabButton";
