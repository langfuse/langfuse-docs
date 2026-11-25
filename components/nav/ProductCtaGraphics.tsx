import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  ProviderMark,
  type ProviderMarkName,
} from "@/components/home/AiGatewayProviderMarks";
import styles from "./ProductCtaGraphics.module.css";

const LINE = "var(--text-disabled)";
const CHIP_FILL = "var(--surface-bg)";
const FONT = 10;
const W = 240;
const H = 100;

export function CtaGraphicPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden", styles.panel, className)}>
      {children}
    </div>
  );
}

function Traffic({ d, delay }: { d: string; delay: number }) {
  return (
    <path
      d={d}
      pathLength={100}
      strokeWidth={2.25}
      strokeLinecap="round"
      stroke="var(--text-tertiary)"
      fill="none"
      className={styles.pulse}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function Chip({
  x,
  y,
  w,
  h = 20,
  label,
  mark,
  strong,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  mark?: ProviderMarkName;
  strong?: boolean;
}) {
  const markSize = 11;
  return (
    <g>
      <rect
        x={x}
        y={y - h / 2}
        width={w}
        height={h}
        rx={4}
        fill={CHIP_FILL}
        stroke={strong ? "var(--text-disabled)" : "var(--line-structure)"}
        strokeWidth={0.75}
        className={styles.chip}
      />
      {mark ? (
        <ProviderMark
          name={mark}
          x={x + 7}
          y={y - markSize / 2}
          size={markSize}
        />
      ) : null}
      <text
        x={x + (mark ? 7 + markSize + 6 : 8)}
        y={y}
        dominantBaseline="central"
        fontSize={FONT}
        className="font-mono"
        fill={strong ? "var(--text-secondary)" : "var(--text-tertiary)"}
      >
        {label}
      </text>
    </g>
  );
}

function Hub({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g>
      <rect
        x={x - size / 2 - 5}
        y={y - size / 2 - 5}
        width={size + 10}
        height={size + 10}
        rx={6}
        fill={CHIP_FILL}
        stroke="var(--line-structure)"
        strokeWidth={0.75}
        className={styles.chip}
      />
      <image
        href="/langfuse-icon.svg"
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
      />
    </g>
  );
}

/** Traffic fans in to the Langfuse hub and out to model providers. */
export function GatewayCtaGraphic({ className }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");
  const hub = { x: 88, y: 50 };
  const fanInX = hub.x - 17;
  const fanOutX = hub.x + 17;
  const fanRows = [6, 22, 38, 62, 78, 94];
  const pillX = 136;
  const pillRows = [22, 50];
  const moreY = 78;
  const inLine = (y: number) =>
    `M0 ${y}C34 ${y} 44 ${hub.y} ${fanInX} ${hub.y}`;
  const outLine = (y: number, endX: number) =>
    `M${fanOutX} ${hub.y}C${pillX - 22} ${hub.y} ${pillX - 18} ${y} ${endX} ${y}`;
  const more: ProviderMarkName[] = ["gemini", "aws", "azure"];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={fanInX}
          y2={0}
        >
          <stop offset={0} stopColor={LINE} stopOpacity={0} />
          <stop offset={0.55} stopColor={LINE} stopOpacity={0.6} />
          <stop offset={1} stopColor={LINE} stopOpacity={1} />
        </linearGradient>
      </defs>
      {fanRows.map((y) => (
        <path
          key={y}
          d={inLine(y)}
          stroke={`url(#${gradientId})`}
          strokeWidth={1}
        />
      ))}
      {[fanRows[1], fanRows[4]].map((y, index) => (
        <Traffic key={y} d={inLine(y)} delay={index * -1.6} />
      ))}
      {[...pillRows, moreY].map((y) => (
        <path
          key={y}
          d={outLine(y, pillX)}
          stroke={LINE}
          strokeWidth={1}
          strokeDasharray="2.5 3"
          opacity={y === moreY ? 0.6 : 1}
        />
      ))}
      <Chip
        x={pillX}
        y={pillRows[0]}
        w={92}
        label="Anthropic"
        mark="anthropic"
      />
      <Chip x={pillX} y={pillRows[1]} w={92} label="OpenAI" mark="openai" />
      {more.map((mark, index) => {
        const cx = pillX + 10 + index * 14;
        return (
          <g key={mark}>
            <circle
              cx={cx}
              cy={moreY}
              r={9}
              fill={CHIP_FILL}
              stroke="var(--line-structure)"
              strokeWidth={0.75}
              className={styles.chip}
            />
            <ProviderMark name={mark} x={cx - 5} y={moreY - 5} size={10} />
          </g>
        );
      })}
      <text
        x={pillX + 10 + 2 * 14 + 16}
        y={moreY}
        dominantBaseline="central"
        fontSize={FONT}
        className="font-mono"
        fill="var(--text-tertiary)"
      >
        and more
      </text>
      <Hub x={hub.x} y={hub.y} size={18} />
    </svg>
  );
}

/** An app call enters the Langfuse hub and unfolds into a span tree. */
export function TracingCtaGraphic({ className }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");
  const hub = { x: 30, y: 22 };
  const rows = [22, 50, 78];
  const rootX = 60;
  const childX = 84;
  const spineX = 70;
  const barX = 176;
  const hubToRoot = `M${hub.x + 15} ${hub.y}H${rootX}`;
  const elbow = (y: number) =>
    `M${spineX} ${rows[0] + 10}V${y - 6}Q${spineX} ${y} ${spineX + 6} ${y}H${childX}`;
  const bars = [
    { y: rows[0], x: barX, w: 58 },
    { y: rows[1], x: barX, w: 18 },
    { y: rows[2], x: barX + 16, w: 40 },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden="true"
      className={cn("block h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={0}
          y1={0}
          x2={hub.x - 15}
          y2={0}
        >
          <stop offset={0} stopColor={LINE} stopOpacity={0} />
          <stop offset={1} stopColor={LINE} stopOpacity={1} />
        </linearGradient>
      </defs>
      {[hub.y - 8, hub.y, hub.y + 8].map((y) => (
        <path
          key={y}
          d={`M0 ${y}C8 ${y} 10 ${hub.y} ${hub.x - 15} ${hub.y}`}
          stroke={`url(#${gradientId})`}
          strokeWidth={1}
        />
      ))}
      <path d={hubToRoot} stroke={LINE} strokeWidth={1} />
      <Traffic d={`M0 ${hub.y}H${rootX}`} delay={0} />
      {rows.slice(1).map((y, index) => (
        <g key={y}>
          <path
            d={elbow(y)}
            stroke={LINE}
            strokeWidth={1}
            strokeDasharray="2.5 3"
          />
          <Traffic d={elbow(y)} delay={-1.4 - index * 1.2} />
        </g>
      ))}
      {bars.map((bar) => (
        <g key={bar.y}>
          <rect
            x={barX}
            y={bar.y - 0.5}
            width={58}
            height={1}
            fill="var(--line-structure)"
          />
          <rect
            x={bar.x}
            y={bar.y - 3}
            width={bar.w}
            height={6}
            rx={1.5}
            fill={
              bar.y === rows[2]
                ? "var(--text-tertiary)"
                : "var(--text-disabled)"
            }
          />
        </g>
      ))}
      <Chip x={rootX} y={rows[0]} w={86} label="agent-run" strong />
      <Chip x={childX} y={rows[1]} w={80} label="retrieve" />
      <Chip x={childX} y={rows[2]} w={80} label="llm-call" mark="openai" />
      <Hub x={hub.x} y={hub.y} size={18} />
    </svg>
  );
}
