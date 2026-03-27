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
 * “outer” (no neighbor on that side). Prevents doubled 8×8 markers when cells
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

/** Offset by −1px so brackets sit on the border stroke (absolute children align to the padding box, inside the border). */
const cornerLayout: Record<
  BoxCornerKey,
  { className: string; rotateClass: string }
> = {
  tl: { className: "-top-px -left-px", rotateClass: "" },
  tr: { className: "-top-px -right-px", rotateClass: "rotate-90" },
  br: { className: "-bottom-px -right-px", rotateClass: "rotate-180" },
  bl: { className: "-bottom-px -left-px", rotateClass: "-rotate-90" },
};

function CornerBracket({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      className={cn("size-2 shrink-0 text-line-cta", className)}
      aria-hidden
    >
      <path
        d="M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Per-corner bracket visibility. Omitted keys default to true. */
  corners?: BoxCorners;
}

/**
 * Container with four optional 8×8 corner brackets (Figma-style).
 * For grouped layouts, pass `corners` from `cornersFromNeighbors` or hide
 * individual corners so shared vertices don’t stack two SVGs.
 */
const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, corners, children, ...props }, ref) => {
    const resolved = resolveCorners(corners);

    return (
      <div ref={ref} className={cn("relative border bg-surface-bg border-line-structure", className)} {...props}>
        {(Object.keys(cornerLayout) as BoxCornerKey[]).map((cornerKey) => {
          if (!resolved[cornerKey]) return null;
          const { className: pos, rotateClass } = cornerLayout[cornerKey];
          return (
            <div
              key={cornerKey}
              className={cn(
                "absolute z-10 origin-center pointer-events-none size-2",
                pos,
                rotateClass
              )}
            >
              <CornerBracket />
            </div>
          );
        })}
        {children}
      </div>
    );
  }
);
Box.displayName = "Box";

export { Box };
