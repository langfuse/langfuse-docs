import localFont from "next/font/local";
import { useId, type ReactNode } from "react";

// The exported designs set labels in Geist Mono Regular; the site font is Medium.
const labelFont = localFont({
  src: "../../../public/fonts/GeistMono-Regular.woff2",
  weight: "400",
  display: "block",
});

// Drawing kit for the homepage card illustrations. Shapes are laid out flat in
// plane units and one matrix tilts them, matching the exported designs in
// img/tools: plane x runs up-right at -20deg, plane y down-right at +60deg,
// both at 0.75 scale.
export const EX = { x: 0.7048, y: -0.2565 };
export const EY = { x: 0.375, y: 0.6495 };

export type Point = { x: number; y: number };

const round = (n: number) => Math.round(n * 100) / 100;

export const planeMatrix = (origin: Point, z = 0) =>
  `matrix(${EX.x} ${EX.y} ${EY.x} ${EY.y} ${origin.x} ${origin.y - z})`;

export const project = (origin: Point, x: number, y: number, z = 0) =>
  `${round(origin.x + EX.x * x + EY.x * y)},${round(origin.y + EX.y * x + EY.y * y - z)}`;

export const AXO = {
  grid: 24,
  fontSize: 13,
  charWidth: 7.8,
  /** Baseline offset below a box's vertical centre. */
  baseline: 4.65,
  padX: 12,
  /** Lift of a raised block, in screen units. */
  raise: 7.35,
  smallFontSize: 9.4,
  hairline: 0.6,
  gridLine: 0.8,
  wire: 1.2,
  node: 3.4,
} as const;

export const AXO_COLOR = {
  hairline: "var(--line-structure)",
  outline: "var(--line-cta)",
  grid: "#efede5",
  /** Chips and frames carry a faint tint over the card background. */
  chip: "#f4f4f1",
  face: "var(--axo-face, var(--surface-bg))",
  top: "var(--axo-top, #fefefe)",
  tag: "var(--surface-2)",
  badge: "var(--surface-code)",
  muted: "var(--text-disabled)",
  strong: "var(--text-primary)",
  subtle: "var(--text-tertiary)",
  inverse: "var(--surface-bg)",
  good: "#00a63e",
  bad: "var(--text-code-pink)",
} as const;

export function AxoPlane({
  origin,
  z = 0,
  children,
}: {
  origin: Point;
  z?: number;
  children: ReactNode;
}) {
  return <g transform={planeMatrix(origin, z)}>{children}</g>;
}

/** Hard-edged grid of `cols` x `rows` cells; border lines show at half width. */
export function AxoGrid({
  x,
  y,
  cols,
  rows,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const w = cols * AXO.grid;
  const h = rows * AXO.grid;
  const lines = [
    ...Array.from(
      { length: cols + 1 },
      (_, i) => `M${x + i * AXO.grid} ${y}v${h}`,
    ),
    ...Array.from(
      { length: rows + 1 },
      (_, i) => `M${x} ${y + i * AXO.grid}h${w}`,
    ),
  ].join("");
  return (
    <g>
      <clipPath id={`${id}-clip`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <path
        d={lines}
        fill="none"
        stroke={AXO_COLOR.grid}
        strokeWidth={AXO.gridLine}
        clipPath={`url(#${id}-clip)`}
      />
    </g>
  );
}

export function AxoText({
  x,
  y,
  tone = "muted",
  anchor,
  small,
  size,
  tracking,
  children,
}: {
  x: number;
  y: number;
  tone?: "muted" | "strong" | "subtle" | "inverse";
  anchor?: "middle" | "end";
  small?: boolean;
  /** Overrides the label size, for redraws of exports set at another size. */
  size?: number;
  tracking?: number;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={labelFont.className}
      fontSize={size ?? (small ? AXO.smallFontSize : AXO.fontSize)}
      letterSpacing={tracking}
      fill={AXO_COLOR[tone]}
    >
      {children}
    </text>
  );
}

/** Flat outlined box; its fill hides the grid behind it. */
export function AxoChip({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={AXO_COLOR.chip}
        stroke={AXO_COLOR.hairline}
        strokeWidth={AXO.hairline}
      />
      {children}
    </g>
  );
}

/** Square marker where a wire meets a box. */
export function AxoNode({
  x,
  y,
  color = AXO_COLOR.hairline,
}: {
  x: number;
  y: number;
  color?: string;
}) {
  const s = AXO.node;
  return <rect x={x - s / 2} y={y - s / 2} width={s} height={s} fill={color} />;
}

export function AxoWire({
  d,
  color = AXO_COLOR.hairline,
  dashed,
}: {
  d: string;
  color?: string;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={dashed ? 0.85 : AXO.wire}
      strokeDasharray={dashed ? "3 2" : undefined}
    />
  );
}

/** Tinted frame with dark corner marks, for the highlighted result. */
export function AxoBracket({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  const arm = 8.3;
  const x0 = x;
  const y0 = y;
  const x1 = x + w;
  const y1 = y + h;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={AXO_COLOR.chip}
        stroke={AXO_COLOR.hairline}
        strokeWidth={AXO.hairline}
      />
      <path
        d={`M${x0} ${y0 + arm}V${y0}H${x0 + arm}M${x1 - arm} ${y0}H${x1}V${y0 + arm}M${x1} ${y1 - arm}V${y1}H${x1 - arm}M${x0 + arm} ${y1}H${x0}V${y1 - arm}`}
        fill="none"
        stroke={AXO_COLOR.outline}
        strokeWidth={AXO.wire}
      />
      {children}
    </g>
  );
}

/** Small filled label: `badge` is dark with light text, `tag` is grey. */
export function AxoPill({
  x,
  y,
  w,
  h,
  kind,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "badge" | "tag";
  children: string;
}) {
  const small = kind === "tag";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={AXO_COLOR[kind]} />
      <AxoText
        x={x + w / 2}
        y={y + h / 2 + (small ? 2.85 : AXO.baseline)}
        anchor="middle"
        tone={small ? "subtle" : "inverse"}
        small={small}
      >
        {children}
      </AxoText>
    </g>
  );
}

/** Status dot with a soft halo. Exports use r 2.1 in rows and 3 in a frame. */
export function AxoDot({
  cx,
  cy,
  r = 2.1,
  color = AXO_COLOR.good,
}: {
  cx: number;
  cy: number;
  r?: number;
  color?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.45} fill={color} opacity={0.35} />
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  );
}

/** Raised white block with a dark silhouette; children sit on its top face. */
export function AxoBlock({
  origin,
  x,
  y,
  w,
  h,
  raise = AXO.raise,
  shadow = true,
  children,
}: {
  origin: Point;
  x: number;
  y: number;
  w: number;
  h: number;
  raise?: number;
  shadow?: boolean;
  children?: ReactNode;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = (px: number, py: number, z = 0) => project(origin, px, py, z);
  const x1 = x + w;
  const y1 = y + h;
  const silhouette = [
    p(x, y, raise),
    p(x1, y, raise),
    p(x1, y1, raise),
    p(x1, y1),
    p(x, y1),
    p(x, y),
  ].join(" ");
  return (
    <g>
      {shadow && (
        <>
          <filter
            id={`${id}-shadow`}
            x="-20%"
            y="-40%"
            width="140%"
            height="200%"
          >
            <feGaussianBlur stdDeviation={2.5} />
          </filter>
          <polygon
            points={silhouette}
            transform="translate(0.3 3.5)"
            fill="#000"
            opacity={0.085}
            filter={`url(#${id}-shadow)`}
          />
        </>
      )}
      <polygon
        points={[p(x, y, raise), p(x, y1, raise), p(x, y1), p(x, y)].join(" ")}
        fill={AXO_COLOR.face}
      />
      <polygon
        points={[p(x, y1, raise), p(x1, y1, raise), p(x1, y1), p(x, y1)].join(
          " ",
        )}
        fill={AXO_COLOR.face}
      />
      <polygon
        points={[
          p(x, y, raise),
          p(x1, y, raise),
          p(x1, y1, raise),
          p(x, y1, raise),
        ].join(" ")}
        fill={AXO_COLOR.top}
      />
      <path
        d={`M${p(x, y, raise)}L${p(x, y1, raise)}L${p(x1, y1, raise)}M${p(x, y1, raise)}L${p(x, y1)}`}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeWidth={0.42}
      />
      <polygon
        points={silhouette}
        fill="none"
        stroke={AXO_COLOR.outline}
        strokeWidth={0.87}
      />
      <g transform={planeMatrix(origin, raise)}>{children}</g>
    </g>
  );
}
