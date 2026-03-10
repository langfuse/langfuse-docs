import { cn } from "@/lib/utils";
import React from "react";

const JAPAN_RED = "#BC002D";

export function BilingualBlock({
  en,
  jp,
  className,
}: {
  en: React.ReactNode;
  jp: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-0", className)}>
      <div className="py-4 md:pr-8">{en}</div>
      <div
        className="py-4 md:pl-8 border-t md:border-t-0 md:border-l"
        style={{ borderColor: JAPAN_RED + "40" }}
      >
        {jp}
      </div>
    </div>
  );
}

export function BilingualHeading({
  en,
  jp,
  className,
}: {
  en: string;
  jp: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 md:flex-row md:gap-5",
        className
      )}
    >
      <span className="whitespace-normal text-center md:text-right md:flex-1">
        {en}
      </span>
      <span
        className="hidden md:block w-px self-stretch shrink-0"
        style={{ backgroundColor: JAPAN_RED + "60" }}
      />
      <span className="text-muted-foreground whitespace-normal text-center md:text-left md:flex-1">
        {jp}
      </span>
    </div>
  );
}
