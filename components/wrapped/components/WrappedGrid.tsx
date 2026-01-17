import { cn } from "@/lib/utils";
import React from "react";
import { HoverStars } from "./HoverStars";

interface WrappedGridProps {
  children: React.ReactNode;
  className?: string;
}

export function WrappedGrid({ children, className }: WrappedGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-border auto-rows-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

interface WrappedGridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: number;
  hideStars?: boolean;
}

export function WrappedGridItem({
  children,
  className,
  colSpan = 1,
  rowSpan,
  hideStars = false,
}: WrappedGridItemProps) {
  const spanClasses = {
    1: "",
    2: "sm:col-span-2",
    3: "sm:col-span-2 lg:col-span-3",
    4: "sm:col-span-2 lg:col-span-3 xl:col-span-4",
  };

  const rowSpanStyle = rowSpan ? { gridRow: `span ${rowSpan}` } : {};

  return (
    <div
      className={cn(
        "relative group border-r border-b border-border",
        spanClasses[colSpan],
        className
      )}
      style={rowSpanStyle}
    >
      {!hideStars && <HoverStars />}
      {children}
    </div>
  );
}

