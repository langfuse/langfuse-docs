import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

export const HomeSection = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[840px]",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

HomeSection.displayName = "HomeSection";
