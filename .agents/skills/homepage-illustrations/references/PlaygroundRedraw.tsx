import { useId, type ReactNode } from "react";
import {
  AXO,
  AXO_COLOR,
  AxoPlane,
  AxoText,
  planeMatrix,
  project,
} from "@/components/home/illustrations/axo";

const O = { x: 0.25, y: 0.25 };
const PANEL = "#f4f4f1";
const TOP = "#fcfcfc";

// This export is drawn at 0.8, not the kit's 0.75: one design unit is 1.0667 plane units.
// Grid sheet: 14 cells of 21.33 plus a 4.27 margin left and right, 10 cells tall.
const CELL = 64 / 3;
const SHEET = { x: -69.19, y: 93.59, w: 307.2, h: 213.33 };
const GRID_X0 = SHEET.x + 4.27;
const GRID_LINE = 0.75;
const GRID_COLOR = "#efede5";

const HAIRLINE = 0.535;
const CHIP = { x: -48.96, w: 217.08, h: 20.84 };
// Labels are tracked in by about 3.4% of their size.
const CHIP_TEXT = { size: 8, tracking: -0.28 };
const BLOCK_SIZE = 10.7;
const OUT_TEXT = { size: 8.533, tracking: -0.297 };
const OUT_PITCH = 12;
const WIRE = 1.03;

const TRUNK = -26.55;
const BRANCH = 92.92;
const BRANCH_Y = 163.48;
const RAISE = 6.65;
const BLOCK = { y: 181.06, w: 86.2, h: 31.99 };
// The hairline down the left of the top face sits this far inside the face.
const TOP_INSET = 0.34;

const prompts = [
  { y: 111.43, text: "You're skilled customer service representa…" },
  { y: 136.0, text: "Do I need SDK to run Langfuse on my machine" },
];
const models = [
  { x: -49.4, label: "Opus 4.6", labelX: -31.085, tracking: -0.375 },
  { x: 46.59, label: "GPT 5.2", labelX: 68.355, tracking: -0.4 },
];
const output = [
  "No, you don't need an SDK to run Langfuse locally.",
  "To run Langfuse locally on your machine, you only",
  "need Git, Docker, and Docker Compose installed.",
  "You can use Docker Desktop on Mac and Windows,",
  "which includes Docker Compose1.",
  "The setup process involves cloning the GitHub",
  "repository and starting the service via",
];

/** Kit label at another size and tracking: the kit text is fixed at 13 with none. */
function Label({
  x,
  y,
  size,
  tracking,
  tone,
  children,
}: {
  x: number;
  y: number;
  size: number;
  /** Letter spacing in plane units. */
  tracking: number;
  tone?: "muted" | "strong";
  children: ReactNode;
}) {
  const k = size / AXO.fontSize;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${k})`}
      style={{ letterSpacing: `${tracking / k}px` }}
    >
      <AxoText x={0} y={0} tone={tone}>
        {children}
      </AxoText>
    </g>
  );
}

function Sheet({ id }: { id: string }) {
  const lines = [
    ...Array.from(
      { length: 15 },
      (_, i) => `M${GRID_X0 + i * CELL} ${SHEET.y}v${SHEET.h}`,
    ),
    ...Array.from(
      { length: 11 },
      (_, i) => `M${SHEET.x} ${SHEET.y + i * CELL}h${SHEET.w}`,
    ),
  ].join("");
  return (
    <g>
      <clipPath id={`${id}-sheet`}>
        <rect x={SHEET.x} y={SHEET.y} width={SHEET.w} height={SHEET.h} />
      </clipPath>
      <rect
        x={SHEET.x}
        y={SHEET.y}
        width={SHEET.w}
        height={SHEET.h}
        fill={PANEL}
      />
      <path
        d={lines}
        fill="none"
        stroke={GRID_COLOR}
        strokeWidth={GRID_LINE}
        clipPath={`url(#${id}-sheet)`}
      />
    </g>
  );
}

function Chip({ y, children }: { y: number; children: ReactNode }) {
  return (
    <g>
      <rect
        x={CHIP.x}
        y={y}
        width={CHIP.w}
        height={CHIP.h}
        fill={PANEL}
        stroke={AXO_COLOR.hairline}
        strokeWidth={HAIRLINE}
      />
      {children}
    </g>
  );
}

const pt = (px: number, py: number, z = 0) => project(O, px, py, z);
const silhouetteOf = (x: number) => {
  const x1 = x + BLOCK.w;
  const y1 = BLOCK.y + BLOCK.h;
  return [
    pt(x, BLOCK.y, RAISE),
    pt(x1, BLOCK.y, RAISE),
    pt(x1, y1, RAISE),
    pt(x1, y1),
    pt(x, y1),
    pt(x, BLOCK.y),
  ].join(" ");
};

/** Raised block with a thinner silhouette than the kit block; its shadow is drawn separately, under the stubs. */
function Block({ x, children }: { x: number; children: ReactNode }) {
  const { y, w, h } = BLOCK;
  const x1 = x + w;
  const y1 = y + h;
  const xi = x + TOP_INSET;
  const silhouette = silhouetteOf(x);
  return (
    <g>
      <polygon points={silhouette} fill={PANEL} />
      <polygon
        points={[
          pt(xi, y, RAISE),
          pt(x1, y, RAISE),
          pt(x1, y1, RAISE),
          pt(xi, y1, RAISE),
        ].join(" ")}
        fill={TOP}
      />
      <path
        d={`M${pt(xi, y, RAISE)}L${pt(xi, y1, RAISE)}M${pt(x, y1, RAISE)}L${pt(x1, y1, RAISE)}M${pt(x, y1, RAISE)}L${pt(x, y1)}`}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeWidth={0.42}
      />
      <polygon
        points={silhouette}
        fill="none"
        stroke={AXO_COLOR.outline}
        strokeWidth={0.775}
      />
      <g transform={planeMatrix(O, RAISE)}>{children}</g>
    </g>
  );
}

export function PlaygroundRedraw() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width={214} height={188} viewBox="0 0 214 188">
      <defs>
        <filter
          id={`${id}-shadow`}
          x="-20%"
          y="-40%"
          width="140%"
          height="200%"
        >
          <feGaussianBlur stdDeviation={2.4} />
        </filter>
        {/* Output text fades from full strength to nothing, down the sheet and slightly to the right. */}
        <linearGradient
          id={`${id}-fade`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={239.34}
          x2={12.06}
          y2={325.31}
        >
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask
          id={`${id}-fademask`}
          maskUnits="userSpaceOnUse"
          x={-80}
          y={215}
          width={340}
          height={110}
        >
          <rect
            x={-80}
            y={215}
            width={340}
            height={110}
            fill={`url(#${id}-fade)`}
          />
        </mask>
      </defs>
      <rect x={16} y={48} width={182} height={140} rx={2} fill={PANEL} />
      <AxoPlane origin={O}>
        <Sheet id={id} />
        {prompts.map((p) => (
          <Chip key={p.text} y={p.y}>
            <Label
              x={CHIP.x + 10.35}
              y={p.y + CHIP.h / 2 + 2.67}
              {...CHIP_TEXT}
            >
              {p.text}
            </Label>
          </Chip>
        ))}
        <path
          d={`M${TRUNK} 156.5V200M${TRUNK} ${BRANCH_Y}H${BRANCH}V200`}
          fill="none"
          stroke={AXO_COLOR.hairline}
          strokeWidth={WIRE}
        />
      </AxoPlane>
      <g
        fill="#000"
        opacity={0.075}
        filter={`url(#${id}-shadow)`}
        transform="translate(0 4.25)"
      >
        {models.map((m) => (
          <polygon key={m.label} points={silhouetteOf(m.x)} />
        ))}
      </g>
      <AxoPlane origin={O}>
        <path
          d={`M${TRUNK} 205V223.8M${BRANCH} 205V223.8`}
          fill="none"
          stroke={AXO_COLOR.outline}
          strokeWidth={WIRE}
        />
        <g mask={`url(#${id}-fademask)`}>
          {output.map((line, i) => (
            <Label
              key={line}
              x={-44.65}
              y={234.65 + i * OUT_PITCH}
              {...OUT_TEXT}
            >
              {line}
            </Label>
          ))}
        </g>
      </AxoPlane>
      {models.map((m) => (
        <Block key={m.label} x={m.x}>
          <Label
            x={m.labelX}
            y={201.16}
            size={BLOCK_SIZE}
            tracking={m.tracking}
            tone="strong"
          >
            {m.label}
          </Label>
        </Block>
      ))}
    </svg>
  );
}
