import * as React from "react";

import { cn } from "@/lib/utils";

/** Body-M / Regular — Inter 15px. */
export const textBodyMRegularClassName = cn(
  "text-center font-sans text-[15px] font-normal not-italic leading-[150%] tracking-[-0.075px] [font-variant-numeric:ordinal] text-text-tertiary"
);

/** Body-S / Regular — Inter 13px. */
export const textBodySRegularClassName = cn(
  "text-center font-sans text-[13px] font-[430] not-italic leading-[150%] lg:leading-[120%] tracking-[-0.26px] [font-variant-numeric:ordinal] text-text-tertiary"
);

/** Body-XS Mono / Regular — Geist Mono 10px underlined. */
export const textBodyXsMonoRegularClassName = cn(
  "text-center font-mono text-[10px] font-normal not-italic leading-[120%] tracking-[-0.2px] [font-variant-numeric:ordinal] [color:var(--text-text-tertiary,#6B6B66)] [text-shadow:0_0_0_#B5AFEA] underline decoration-solid [text-decoration-skip-ink:auto] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font]"
);

const sizeClass: Record<"m" | "s" | "xs", string> = {
  m: textBodyMRegularClassName,
  s: textBodySRegularClassName,
  xs: textBodyXsMonoRegularClassName,
};

export type TextProps<T extends React.ElementType = "p"> =
  React.ComponentPropsWithoutRef<T> & {
    /** Body-M (15px), Body-S (13px), or Body-XS Mono (10px). Default `"m"`. */
    size?: "m" | "s" | "xs";
    /** Render as a different element. Default `"p"`. */
    as?: T;
  };

/**
 * Body copy primitive. Centered tertiary text; default Body-M/Regular.
 * Override alignment or color via `className`.
 */
const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size = "m", as: Comp = "p", ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(sizeClass[size], className)}
      {...props}
    />
  )
);
Text.displayName = "Text";

export { Text };
