import * as React from "react";

import { cn } from "@/lib/utils";

export type BoxCornerKey = "tl" | "tr" | "bl" | "br";

const ALL_CORNERS: Record<BoxCornerKey, true> = {
  tl: true,
  tr: true,
  bl: true,
  br: true,
};

export type BoxCorners = Partial<Record<BoxCornerKey, boolean>>;

/** Which sides of this cell touch another cell (shared border). */
export type BoxNeighbors = {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
};

/**
 * Corner bracket at each vertex: show only when both edges meeting there are
 * "outer" (no neighbor on that side). Prevents doubled 8×8 markers when cells
 * sit in a grid or row.
 */
export function cornersFromNeighbors(
  neighbors: BoxNeighbors
): Record<BoxCornerKey, boolean> {
  const { top, right, bottom, left } = neighbors;
  return {
    tl: !top && !left,
    tr: !top && !right,
    bl: !bottom && !left,
    br: !bottom && !right,
  };
}

/** Convenience for a uniform rows×cols grid: infers neighbors from indices. */
export function cornersForGridCell(
  row: number,
  col: number,
  rows: number,
  cols: number
): Record<BoxCornerKey, boolean> {
  return cornersFromNeighbors({
    top: row > 0,
    left: col > 0,
    right: col < cols - 1,
    bottom: row < rows - 1,
  });
}

function resolveCorners(corners?: BoxCorners): Record<BoxCornerKey, boolean> {
  return {
    ...ALL_CORNERS,
    ...corners,
  };
}

export interface CornerBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Per-corner bracket visibility. Omitted keys default to true. */
  corners?: BoxCorners;
  withStripes?: boolean;
  /** Diagonal stripe background on hover (same tokens as `bg-stripe-pattern`). */
  hoverStripes?: boolean;
  /** Omit border; corner brackets align flush with element edge instead of −1px inset for border stroke. */
  noBorder?: boolean;
}

/**
 * Container with four optional 8×8 corner brackets (Figma-style).
 * Corners are rendered via a single CSS ::before pseudo-element using
 * mask-image — no SVG DOM nodes. For grouped layouts, pass `corners` from
 * `cornersFromNeighbors` or hide individual corners so shared vertices don't
 * overlap.
 */
const CornerBox = React.forwardRef<HTMLDivElement, CornerBoxProps>(
  ({ className, corners, withStripes, hoverStripes, noBorder, style, children, ...props }, ref) => {
    const resolved = resolveCorners(corners);

    // Build per-corner CSS custom properties: hidden corners are set to "none"
    // so that mask-image layer for that corner contributes nothing (mask-composite: add).
    const cornerStyle: Record<string, string> = {};
    if (!resolved.tl) cornerStyle["--cx-mask-tl"] = "none";
    if (!resolved.bl) cornerStyle["--cx-mask-bl"] = "none";
    if (!resolved.br) cornerStyle["--cx-mask-br"] = "none";
    if (!resolved.tr) cornerStyle["--cx-mask-tr"] = "none";

    const hasCustomCorners = Object.keys(cornerStyle).length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-surface-bg",
          noBorder ? "corner-box-corners-flush" : "border border-line-structure corner-box-corners",
          withStripes && "with-stripes",
          hoverStripes &&
            "group corner-box-hover-stripes transition-[background] duration-180 ease-out",
          className
        )}
        style={hasCustomCorners ? { ...cornerStyle, ...style } : style}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CornerBox.displayName = "CornerBox";

/**
 * Hover-only corner brackets for any `relative` container with a recognised
 * hover-trigger class (`link-box`, `button-wrapper`, `card-hover-stripes`).
 * Renders a single absolutely-positioned span whose ::before shows on parent
 * hover — no SVG nodes. Valid inside <a> tags (uses <span>).
 */
export function HoverCorners() {
  return <span aria-hidden className="corner-box-hover-child" />;
}

export { CornerBox };
