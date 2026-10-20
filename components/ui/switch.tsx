"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  alwaysOn = false,
  decorative = false,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  alwaysOn?: boolean;
  /**
   * Renders the switch as a non-interactive span. Use when the switch is only
   * a visual affordance and something else owns the interaction (e.g. a link
   * wrapping it), so we don't nest a button inside an anchor.
   */
  decorative?: boolean;
}) {
  const rootClassName = cn(
    "peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    alwaysOn
      ? "bg-primary dark:bg-primary"
      : "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
    className,
  );

  const thumbClassName = cn(
    "pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
    alwaysOn
      ? "bg-background dark:bg-primary-foreground"
      : "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
  );

  if (decorative) {
    const state = props.checked ? "checked" : "unchecked";
    return (
      <span
        data-slot="switch"
        data-state={state}
        aria-hidden="true"
        className={rootClassName}
      >
        <span
          data-slot="switch-thumb"
          data-state={state}
          className={thumbClassName}
        />
      </span>
    );
  }

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={rootClassName}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={thumbClassName}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
