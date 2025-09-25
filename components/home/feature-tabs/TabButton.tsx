import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { TabButtonProps } from "./types";

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ feature, isActive, onClick, className, ...props }, ref) => {
    const Icon = feature.icon;

    console.log("isActive", isActive, feature.title)

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${feature.id}`}
        id={`tab-${feature.id}`}
        onClick={onClick}
        className={cn(
          "min-w-[80px] flex flex-col items-center text-center gap-1 px-2 py-2 transition-all duration-200 ease-out border-b-2 border-transparent hover:border-primary/30 ring-transparent outline-transparent flex-shrink-0 ",
          isActive
            ? "border-primary bg-primary/5 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            className
        )}

        {...props}
      >
        <div className="flex flex-col items-center gap-2">
          <Icon
            size={18}
            className={cn(
              "shrink-0 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "font-semibold text-sm transition-colors",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {feature.title}
          </span>
        </div>
        <p
          className={cn(
            "text-xs leading-tight max-w-[140px] transition-colors px-2",
            // Make text more compact on mobile
            "sm:max-w-[180px]",
            isActive ? "text-primary/80" : "text-muted-foreground"
          )}
        >
          {feature.subtitle}
        </p>
      </button>
    );
  }
);

TabButton.displayName = "TabButton";