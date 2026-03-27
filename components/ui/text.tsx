import * as React from "react";

import { cn } from "@/lib/utils";

/** Body-M / Regular — Inter 15px. */
export const textBodyMRegularClassName = cn(
  "text-center font-sans text-[15px] font-normal not-italic leading-[150%] tracking-[-0.075px] [font-variant-numeric:ordinal] text-text-tertiary"
);

/** Body-S / Regular — Inter 13px. */
export const textBodySRegularClassName = cn(
  "text-center font-sans text-[13px] font-[430] not-italic leading-[120%] tracking-[-0.26px] [font-variant-numeric:ordinal] text-text-tertiary"
);

const sizeClass: Record<"m" | "s", string> = {
  m: textBodyMRegularClassName,
  s: textBodySRegularClassName,
};

export type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** Body-M (15px) or Body-S (13px). Default `"m"`. */
  size?: "m" | "s";
};

/**
 * Body copy primitive (`<p>`). Centered tertiary text; default Body-M/Regular.
 * Override alignment or color via `className`.
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size = "m", ...props }, ref) => (
    <p
      ref={ref}
      className={cn(sizeClass[size], className)}
      {...props}
    />
  )
);
Text.displayName = "Text";

export { Text };
