import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { FeatureTabData } from "./types";
import { Button } from "@/components/ui/button";


export interface TabButtonProps {
  feature: FeatureTabData;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ feature, isActive, onClick, onMouseEnter, onMouseLeave, className, ...props }, ref) => {

    return (
      <div
        className="px-0.5 group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Button
          ref={ref}
          role="tab"
          aria-selected={isActive}
          aria-controls={`tabpanel-${feature.id}`}
          id={`tab-${feature.id}`}
          onClick={onClick}
          variant="text"
          className={cn([
            "py-0 group-hover:text-primary text-text-disabled focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
            isActive
              ? "text-primary group-hover:text-primary"
              : "",
            className,
          ])}
          {...props}
        >
          {feature.title}
        </Button>
      </div>
    );
  }
);

TabButton.displayName = "TabButton";