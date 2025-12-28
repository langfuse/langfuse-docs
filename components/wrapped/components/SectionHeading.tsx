import { cn } from "@/lib/utils";
import { HoverStars } from "./HoverStars";
import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeading({
  title,
  subtitle,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn("relative group border-t border-l border-r border-b border-border p-6 lg:p-8", className)}>
      <HoverStars />
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono text-balance">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="mt-4 lg:mt-0 lg:text-right">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

