import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[2px] border border-line-structure bg-surface-bg px-3 py-2 text-base text-text-secondary shadow-sm ring-offset-surface-bg placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-cta focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
