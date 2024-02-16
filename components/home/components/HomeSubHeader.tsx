import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

const HomeSubHeader = forwardRef<
  HTMLDivElement,
  { title: string; subtitle: string; description: string; className?: string }
>(({ title, subtitle, description, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mx-auto max-w-4xl text-center mb-20", className)}
    >
      <h2 className="text-base font-semibold leading-7">{title}</h2>
      <p className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl text-balance">
        {subtitle}
      </p>
      <p className="mt-6 text-lg leading-8 text-primary/70">{description}</p>
    </div>
  );
});

HomeSubHeader.displayName = "HomeSubHeader";

export default HomeSubHeader;
