import * as React from "react";

import { cn } from "@/lib/utils";

export type DotProps = React.HTMLAttributes<HTMLSpanElement>;

const Dot = React.forwardRef<HTMLSpanElement, DotProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        "inline-block size-[2px] shrink-0 bg-text-secondary",
        className
      )}
      {...props}
    />
  )
);
Dot.displayName = "Dot";

export { Dot };
