import { cn } from "@/lib/utils";

// Arrow primitives shared by the homepage diagrams so every connector has the
// same stroke color, head shape, and head size. Tips touch the target edge.

export const ARROW_COLOR = "var(--line-cta)";
export const ARROW_HEAD = 8;

type Direction = "left" | "right" | "up" | "down";

// Drawn per direction so the tip stays crisp. Rotating one triangle blurs
// these small heads and lets the stroke show through the edges.
const ARROW_PATH: Record<Direction, string> = {
  right: "M 0 0 L 10 5 L 0 10 Z",
  down: "M 0 0 L 10 0 L 5 10 Z",
  left: "M 10 0 L 0 5 L 10 10 Z",
  up: "M 0 10 L 10 10 L 5 0 Z",
};

export function ArrowHead({
  direction,
  className,
}: {
  direction: Direction;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      width={ARROW_HEAD}
      height={ARROW_HEAD}
      viewBox="0 0 10 10"
      className={cn("block shrink-0", className)}
    >
      <path d={ARROW_PATH[direction]} fill={ARROW_COLOR} />
    </svg>
  );
}

/** Horizontal arrow that stretches to fill its flex/grid cell. */
export function HArrow({
  direction = "right",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-full items-center",
        direction === "left" && "flex-row-reverse",
        className,
      )}
    >
      <div className="h-px flex-1 bg-line-cta" />
      <ArrowHead
        direction={direction}
        className={direction === "left" ? "-mr-px" : "-ml-px"}
      />
    </div>
  );
}

/** Vertical arrow that stretches to fill its cell height. */
export function VArrow({
  direction = "down",
  className,
}: {
  direction?: "up" | "down";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full flex-col items-center",
        direction === "up" && "flex-col-reverse",
        className,
      )}
    >
      <div className="w-px flex-1 bg-line-cta" />
      <ArrowHead
        direction={direction}
        className={direction === "up" ? "-mb-px" : "-mt-px"}
      />
    </div>
  );
}
