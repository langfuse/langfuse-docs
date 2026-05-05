"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

// Cast to make `children` optional — with React 19 types, React.FC<P> no
// longer adds implicit `children` via PropsWithChildren, so JSX children
// don't automatically satisfy a required `children` prop in the strict
// attribute check. Making it optional here allows the standard JSX usage
// `<TooltipProvider>...</TooltipProvider>` to remain valid.
type TooltipProviderProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
  "children" | "delayDuration" | "skipDelayDuration" | "disableHoverableContent"
> & {
  children?: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
};

const TooltipPrimitiveProvider = TooltipPrimitive.Provider as React.ComponentType<
  Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
    "children"
  > & { children?: React.ReactNode }
>;

const TooltipProvider: React.ComponentType<TooltipProviderProps> = ({
  delayDuration = 0,
  skipDelayDuration = 0,
  disableHoverableContent = true,
  ...props
}) => (
  <TooltipPrimitiveProvider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    disableHoverableContent={disableHoverableContent}
    {...props}
  />
);

const Tooltip = TooltipPrimitive.Root as React.ComponentType<
  Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
    "children"
  > & { children?: React.ReactNode }
>;

const TooltipTrigger = TooltipPrimitive.Trigger;

export const tooltipContentClassName = cn(
  "tooltip-label z-50 inline-flex h-[15px] items-center justify-center gap-[3px] overflow-hidden rounded-none border-0 bg-primary px-1 py-0.5 font-mono text-[10px] leading-none text-white shadow-none outline-hidden"
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 0, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentClassName, className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
