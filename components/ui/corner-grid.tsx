import type { HTMLAttributes } from "react";

import { CornerBox } from "./corner-box";
import { cn } from "@/lib/utils";

export function CornerGrid({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-2", className)}
      {...props}
    />
  );
}

export function CornerGridItem({
  index,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { index: number }) {
  const withStripes = index % 3 === 1;

  return (
    <CornerBox
      withStripes={withStripes}
      hoverStripes={!withStripes}
      className={cn(
        "-mt-px flex min-h-[176px] min-w-0 flex-col p-5 sm:-ml-px sm:p-6",
        className,
      )}
      {...props}
    />
  );
}
