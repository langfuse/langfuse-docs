import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tailwind classes applied to the highlight span (background, color, etc). */
  highlightClassName?: string;
}

/**
 * Wraps children in a `<span>` with a positioned highlight layer behind the text.
 * The highlight `<span>` is `absolute inset-0` — size it via `highlightClassName`
 * or the inherited Tailwind classes on the container.
 *
 * Usage:
 *   <TextHighlight>key word</TextHighlight>
 */
const TextHighlight = React.forwardRef<HTMLSpanElement, TextHighlightProps>(
  ({ className, highlightClassName, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex relative items-center", className)}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-x-0 top-1/2 h-[0.75em] -translate-y-1/2",
          "bg-[#FBFF7A]",
          highlightClassName
        )}
        aria-hidden
      />
      <span className="relative">{children}</span>
    </span>
  )
);
TextHighlight.displayName = "TextHighlight";

export { TextHighlight };
