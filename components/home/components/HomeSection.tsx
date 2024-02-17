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
        "py-24 sm:py-32 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10 first:pt-10 last:pb-36",
        props.className
      )}
    >
      {props.children}
    </section>
  );
});

HomeSection.displayName = "HomeSection";
