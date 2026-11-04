"use client";

import { useId } from "react";

// Same axonometric projection as the other bento illustrations: plane x runs
// up-right, plane y runs down-right, and raised chips extrude upward.
const EX = { x: 0.866, y: -0.4 };
const EY = { x: 0.5, y: 0.69 };
const ORIGIN = { x: 40, y: 270 };
const PLANE = `matrix(${EX.x} ${EX.y} ${EY.x} ${EY.y} ${ORIGIN.x} ${ORIGIN.y})`;
const RAISE = 10;

const project = (x: number, y: number, z = 0) =>
  `${ORIGIN.x + EX.x * x + EY.x * y},${ORIGIN.y + EX.y * x + EY.y * y - z}`;

type Chip = { label: string; x: number; y: number; w: number };

const CHIP_H = 30;
const clients: Chip[] = [
  { label: "Your apps", x: 0, y: 0, w: 130 },
  { label: "Claude Code", x: 0, y: 44, w: 130 },
  { label: "Codex", x: 0, y: 88, w: 130 },
];
const providers: Chip[] = [
  { label: "OpenAI", x: 400, y: 0, w: 130 },
  { label: "Anthropic", x: 400, y: 44, w: 130 },
];
const gateway = { x: 190, y: 34, w: 150, h: 50 };
const ROW_H = 22;
const checks = [{ label: "trace", value: "1.2s $0.0031" }];
const trace = { x: 180, y: 120, w: 170, h: ROW_H * checks.length + 8 };
const CENTER = { x: 299, y: 205 };

const gatewayMidY = gateway.y + gateway.h / 2;

function FadedChip({ chip }: { chip: Chip }) {
  return (
    <g>
      <rect
        x={chip.x}
        y={chip.y}
        width={chip.w}
        height={CHIP_H}
        fill="var(--surface-1)"
        stroke="var(--line-structure)"
      />
      <text
        x={chip.x + 12}
        y={chip.y + 20}
        className="font-mono"
        fontSize={14}
        fill="var(--text-disabled)"
      >
        {chip.label}
      </text>
    </g>
  );
}

function Node({ x, y, active }: { x: number; y: number; active?: boolean }) {
  return (
    <rect
      x={x - 2.5}
      y={y - 2.5}
      width={5}
      height={5}
      fill={active ? "var(--line-cta)" : "var(--text-disabled)"}
    />
  );
}

function Bracket({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const l = 7;
  return (
    <path
      d={[
        `M${x} ${y + l}V${y}H${x + l}`,
        `M${x + w - l} ${y}H${x + w}V${y + l}`,
        `M${x + w} ${y + h - l}V${y + h}H${x + w - l}`,
        `M${x + l} ${y + h}H${x}V${y + h - l}`,
      ].join("")}
      fill="none"
      stroke="var(--line-cta)"
      strokeWidth={1.25}
    />
  );
}

export function AiGatewayVisual({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const gridId = `${id}-grid`;
  const fadeId = `${id}-fade`;
  const maskId = `${id}-mask`;

  const g = gateway;
  const x1 = g.x + g.w;
  const y1 = g.y + g.h;

  return (
    <svg
      viewBox="22 44 554 322"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern
          id={gridId}
          width={32}
          height={32}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="var(--line-structure)"
            strokeWidth={1}
          />
        </pattern>
        <radialGradient
          id={fadeId}
          gradientUnits="userSpaceOnUse"
          cx={CENTER.x}
          cy={CENTER.y}
          r={320}
          gradientTransform={`translate(${CENTER.x} ${CENTER.y}) scale(1 0.62) translate(${-CENTER.x} ${-CENTER.y})`}
        >
          <stop offset="0%" stopColor="white" stopOpacity={0.9} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect
            x={-300}
            y={-200}
            width={1200}
            height={800}
            fill={`url(#${fadeId})`}
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <g transform={PLANE}>
          <rect
            x={-400}
            y={-400}
            width={1400}
            height={900}
            fill={`url(#${gridId})`}
          />
        </g>
      </g>

      <g transform={PLANE}>
        {clients.map((chip) => {
          const cy = chip.y + CHIP_H / 2;
          return (
            <g key={chip.label}>
              <path
                d={`M${chip.x + chip.w} ${cy}H${g.x - 30}V${gatewayMidY}H${g.x}`}
                fill="none"
                stroke="var(--text-disabled)"
              />
              <Node x={chip.x + chip.w} y={cy} />
            </g>
          );
        })}
        {providers.map((chip) => {
          const cy = chip.y + CHIP_H / 2;
          return (
            <g key={chip.label}>
              <path
                d={`M${x1} ${gatewayMidY}H${x1 + 30}V${cy}H${chip.x}`}
                fill="none"
                stroke="var(--text-disabled)"
              />
              <Node x={chip.x} y={cy} />
            </g>
          );
        })}
        <path
          d={`M${trace.x + trace.w / 2} ${y1}V${trace.y}`}
          fill="none"
          stroke="var(--line-cta)"
        />
        <Node x={trace.x + trace.w / 2} y={trace.y} active />
        {clients.map((chip) => (
          <FadedChip key={chip.label} chip={chip} />
        ))}
        {providers.map((chip) => (
          <FadedChip key={chip.label} chip={chip} />
        ))}

        <rect
          x={trace.x}
          y={trace.y}
          width={trace.w}
          height={trace.h}
          fill="var(--surface-1)"
          opacity={0.7}
        />
        <Bracket {...trace} />
        {checks.map((check, i) => {
          const rowY = trace.y + 4 + i * ROW_H;
          const textY = rowY + ROW_H / 2 + 4;
          return (
            <g key={check.label}>
              {i > 0 && (
                <path
                  d={`M${trace.x + 10} ${rowY}H${trace.x + trace.w - 10}`}
                  stroke="var(--line-structure)"
                />
              )}
              <text
                x={trace.x + 14}
                y={textY}
                className="font-mono"
                fontSize={12}
                fill="var(--text-tertiary)"
              >
                {check.label}
              </text>
              <text
                x={trace.x + trace.w - 28}
                y={textY}
                textAnchor="end"
                className="font-mono"
                fontSize={12}
                fill="var(--text-secondary)"
              >
                {check.value}
              </text>
              <circle
                cx={trace.x + trace.w - 16}
                cy={rowY + ROW_H / 2}
                r={3.5}
                fill="var(--callout-success)"
              />
            </g>
          );
        })}
      </g>

      <polygon
        points={[
          project(g.x, y1, RAISE),
          project(x1, y1, RAISE),
          project(x1, y1),
          project(g.x, y1),
        ].join(" ")}
        fill="var(--surface-2)"
        stroke="var(--line-cta)"
        strokeLinejoin="round"
      />
      <polygon
        points={[
          project(g.x, g.y, RAISE),
          project(g.x, y1, RAISE),
          project(g.x, y1),
          project(g.x, g.y),
        ].join(" ")}
        fill="var(--surface-1)"
        stroke="var(--line-cta)"
        strokeLinejoin="round"
      />
      <g transform={`translate(0 ${-RAISE}) ${PLANE}`}>
        <rect
          x={g.x}
          y={g.y}
          width={g.w}
          height={g.h}
          fill="var(--surface-bg)"
          stroke="var(--line-cta)"
          strokeWidth={1.5}
        />
        <text
          x={g.x + g.w / 2}
          y={g.y + 31}
          textAnchor="middle"
          className="font-mono"
          fontSize={16}
          fill="var(--text-primary)"
        >
          AI Gateway
        </text>
      </g>
    </svg>
  );
}
