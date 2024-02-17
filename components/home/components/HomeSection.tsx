import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export const HomeSection = forwardRef<
  HTMLElement,
  { children: React.ReactNode; className?: string }
>((props, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "py-24 sm:py-32 mx-auto max-w-7xl px-2 sm:px-6 xl:px-8 first:pt-0",
        props.className
      )}
    >
      {props.children}
    </section>
  );
});

HomeSection.displayName = "HomeSection";
