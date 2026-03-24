import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled replacement for <details> used in MDX content.
 * Replicates the accordion-style appearance that Nextra provided by default.
 * Uses `group` so the chevron icon can rotate when the disclosure is open
 * via the Tailwind `group-open:` variant.
 */
export function MdxDetails({
  children,
  className,
  ...props
}: React.DetailsHTMLAttributes<HTMLDetailsElement>) {
  return (
    <details
      className={cn(
        "group my-3 rounded-lg border border-border overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </details>
  );
}

/**
 * Styled replacement for <summary> used inside <details> in MDX content.
 * Hides the native browser disclosure marker and adds a custom
 * ChevronRight icon that rotates 90° when the parent <details> is open.
 */
export function MdxSummary({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={cn(
        // Hide the native disclosure triangle in all browsers
        "list-none [&::-webkit-details-marker]:hidden",
        "flex cursor-pointer select-none items-center justify-between",
        "px-4 py-3 font-semibold text-sm",
        "hover:bg-muted/50 transition-colors",
        className
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
    </summary>
  );
}
