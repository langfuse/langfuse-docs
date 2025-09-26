import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { FeatureTabData } from "./types";
import { Button } from "@/components/ui/button";


export interface TabButtonProps {
  feature: FeatureTabData;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ feature, isActive, onClick, onMouseEnter, onMouseLeave, className, ...props }, ref) => {
    const Icon = feature.icon;

    return (
      <div className="px-0.5 group" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Button
          ref={ref}
          role="tab"
          aria-selected={isActive}
          aria-controls={`tabpanel-${feature.id}`}
          id={`tab-${feature.id}`}
          onClick={onClick}
          variant="ghost"
          className={cn([
            "group-hover:bg-primary/5 group-hover:text-accent-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
            isActive ? "bg-primary/10 text-accent-foreground group-hover:bg-primary/10 group-hover:text-accent-foreground" : "",
            className,
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
      </div>
    );
  }
);

TabButton.displayName = "TabButton";