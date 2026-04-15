"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { HoverCorners } from "./corner-box";
import { ChevronDownIcon } from "lucide-react";

type DropdownButtonSize = "default" | "small";

const sizeClasses: Record<DropdownButtonSize, { root: string }> = {
  default: {
    root: "h-[32px]",
  },
  small: {
    root: "h-[26px]",
  },
};

const buttonBaseClasses =
  "inline-flex w-full min-w-0 max-w-full items-center justify-center no-underline overflow-hidden shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";


export interface DropdownButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: DropdownButtonSize;
  className?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  (
    {
      className,
      size,
      wrapperClassName,
      children,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedSize: DropdownButtonSize = size === "small" ? "small" : "default";

    const innerRef = React.useRef<HTMLElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const iconEl = icon ?? <ChevronDownIcon className="h-3 w-3" />;

    const isSmallSize = resolvedSize === "small";
    const leftSegmentClass = isSmallSize
      ? "px-[6px] text-[11px] min-w-[64px]"
      : "px-[8px] text-[12px] min-w-[80px]";

    const buttonControlClassName = cn(
      buttonBaseClasses,
      sizeClasses[resolvedSize].root,
      "inline-flex items-stretch rounded-[1px] border border-line-structure bg-surface-bg text-text-secondary [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
      disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-surface-1/80",
      className
    );

    const buttonEl = (
      <button
        ref={setRefs}
        disabled={disabled}
        className={buttonControlClassName}
        {...props}
      >
        <span
          className={cn(
            "inline-flex items-center py-0.75 font-sans font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] transition-colors",
            leftSegmentClass,
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <span className="min-w-0 truncate w-full">{children}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "inline-flex w-[32px] items-center justify-center border-l border-line-structure transition-colors",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {iconEl}
        </span>
      </button>
    );


    return (
      <div className={cn("relative p-1 group button-wrapper", wrapperClassName)}>
        <HoverCorners />
        {buttonEl}
      </div>
    );
  }
);
DropdownButton.displayName = "DropdownButton";

export { DropdownButton };
