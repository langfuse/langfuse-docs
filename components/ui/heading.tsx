import * as React from "react";
import { cn } from "@/lib/utils";

export type HeadingSize = "big" | "large" | "normal";
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Rendered HTML tag. Default `"h2"`. */
  as?: HeadingLevel;
  /** Visual size variant. Default `"normal"`. */
  size?: HeadingSize;
}

const sizeClasses: Record<HeadingSize, string> = {
  // 68px / line-height 105%
  big: cn(
    "max-[390px]:text-[35px] text-[44px] md:text-[54px] lg:text-[68px] leading-[105%]",
    "text-center"
  ),
  // 50px / line-height 110% (between big and normal)
  large: cn(
    "text-[50px] leading-[110%]"
  ),
  // 32px / line-height 115%
  normal: cn(
    "text-[32px] leading-[115%]"
  ),
};

/** Shared typographic base for all heading sizes. */
const headingBaseClasses = cn(
  "text-text-primary",
  "font-analog font-medium not-italic",
  "[font-variant-numeric:ordinal]",
  "[font-feature-settings:'dlig'_on]"
);

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", size = "normal", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(headingBaseClasses, sizeClasses[size], className)}
      {...props}
    />
  )
);
Heading.displayName = "Heading";

export { Heading };
