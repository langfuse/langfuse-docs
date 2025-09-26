import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { TabButtonProps } from "./types";
import { Button } from "@/components/ui/button";


export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ feature, isActive, onClick, className, ...props }, ref) => {
    const Icon = feature.icon;

    console.log("isActive", isActive, feature.title);

    return (
      <Button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${feature.id}`}
        id={`tab-${feature.id}`}
        onClick={onClick}
        variant="ghost"
        className={cn([
          isActive ? "bg-primary/10 text-accent-foreground" : "", 
          className
        ])}
        {...props}
      >
        <div className="flex flex-row flex-nowrap items-center gap-2">
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
      </Button>
    );
  }
);

TabButton.displayName = "TabButton";