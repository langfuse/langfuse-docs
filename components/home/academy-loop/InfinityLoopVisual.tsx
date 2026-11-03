"use client";

import NextLink from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  LOOP_ORDER,
  LOOP_PHASES,
  LOOP_STEPS,
  type LoopPhaseId,
  type LoopStepId,
} from "./steps";
import {
  Highlight,
  MonoLabel,
  PulseDot,
  useLoopTick,
  usePrefersReducedMotion,
} from "./shared";

type Pt = [number, number];
type Segment = [Pt, Pt, Pt];

// Figure-eight in a 840×320 design space. Development is the left lobe,
// production the right lobe; the path crosses itself at (420, 160).
const W = 840;
const H = 320;
const START: Pt = [420, 160];
const SEGMENTS: Segment[] = [
  [
    [470, 90],
    [510, 40],
    [590, 40],
  ], // → Trace
  [
    [690, 40],
    [750, 100],
    [750, 160],
  ],
  [
    [750, 220],
    [690, 280],
    [590, 280],
  ], // → Monitor
  [
    [510, 280],
    [470, 230],
    [420, 160],
  ],
  [
    [370, 90],
    [330, 40],
    [250, 40],
  ], // → Build datasets
  [
    [150, 40],
    [90, 100],
    [90, 160],
  ], // → Experiment
  [
    [90, 220],
    [150, 280],
    [250, 280],
  ], // → Evaluate
  [
    [330, 280],
    [370, 230],
    [420, 160],
  ],
];

const STATIONS: { id: LoopStepId; at: Pt }[] = [
  { id: "trace", at: [590, 40] },
  { id: "monitor", at: [590, 280] },
  { id: "dataset", at: [250, 40] },
  { id: "experiment", at: [90, 160] },
  { id: "eval", at: [250, 280] },
];

const PHASE_CENTERS: { phase: LoopPhaseId; at: Pt }[] = [
  { phase: "development", at: [250, 160] },
  { phase: "production", at: [590, 160] },
];

// Segment index → label drawn on the path at its midpoint.
const SEGMENT_LABELS: Record<number, string> = {
  0: "deploy",
  4: "new test cases",
};

type Layout = { w: number; h: number; tf: (p: Pt) => Pt };

const WIDE: Layout = { w: W, h: H, tf: (p) => p };

// Phones: rotate so the lobes stack vertically (development on top), and
// compress the long axis so the figure stays roughly one screen tall.
const TALL: Layout = {
  w: 360,
  h: 640,
  tf: ([x, y]) => [70 + (y - 40) * (220 / 240), 60 + (x - 90) * 0.78],
};

function bezierAt(p0: Pt, [p1, p2, p3]: Segment, t: number) {
  const u = 1 - t;
  const pt: Pt = [
    u * u * u * p0[0] +
      3 * u * u * t * p1[0] +
      3 * u * t * t * p2[0] +
      t * t * t * p3[0],
    u * u * u * p0[1] +
      3 * u * u * t * p1[1] +
      3 * u * t * t * p2[1] +
      t * t * t * p3[1],
  ];
  const d: Pt = [
    3 * u * u * (p1[0] - p0[0]) +
      6 * u * t * (p2[0] - p1[0]) +
      3 * t * t * (p3[0] - p2[0]),
    3 * u * u * (p1[1] - p0[1]) +
      6 * u * t * (p2[1] - p1[1]) +
      3 * t * t * (p3[1] - p2[1]),
  ];
  return { pt, angle: (Math.atan2(d[1], d[0]) * 180) / Math.PI };
}

function buildGeometry({ tf }: Layout) {
  const start = tf(START);
  const segs = SEGMENTS.map((s) => s.map(tf) as Segment);
  const d =
    `M ${start[0]} ${start[1]} ` +
    segs.map((s) => `C ${s.map((p) => p.join(" ")).join(", ")}`).join(" ") +
    " Z";
  const mids = segs.map((s, i) => {
    const p0 = i === 0 ? start : segs[i - 1][2];
    return bezierAt(p0, s, i in SEGMENT_LABELS ? 0.4 : 0.5);
  });
  return { d, mids };
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Station({
  id,
  at,
  layout,
  active,
}: {
  id: LoopStepId;
  at: Pt;
  layout: Layout;
  active: boolean;
}) {
  const step = LOOP_STEPS[id];
  const [x, y] = layout.tf(at);
  return (
    <NextLink
      href={step.href}
      className={cn(
        "absolute flex w-[108px] -translate-x-1/2 -translate-y-1/2 flex-col gap-1 border bg-surface-bg px-2.5 py-2 md:w-[136px]",
        "corner-box-hover-stripes transition-[background,border-color] duration-180 ease-out",
        active ? "border-line-cta" : "border-line-structure",
      )}
      style={{ left: pct(x, layout.w), top: pct(y, layout.h) }}
    >
      <PulseDot active={active} />
      <span className="font-analog text-[16px] font-medium leading-tight text-text-primary md:text-[18px]">
        {step.title}
      </span>
      <MonoLabel className="leading-[1.4]">
        {step.meta.slice(0, 2).join(" · ")}
      </MonoLabel>
    </NextLink>
  );
}

function Figure({
  layout,
  active,
  className,
}: {
  layout: Layout;
  active: LoopStepId;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const pathId = `lf-infinity-${uid}`;
  const reducedMotion = usePrefersReducedMotion();
  const { d, mids } = buildGeometry(layout);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${layout.w} / ${layout.h}` }}
    >
      <svg
        viewBox={`0 0 ${layout.w} ${layout.h}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          stroke="color-mix(in oklab, var(--surface-cta-primary) 80%, transparent)"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        <path
          id={pathId}
          d={d}
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {mids.map(({ pt, angle }, i) =>
          SEGMENT_LABELS[i] ? null : (
            <path
              key={i}
              d="M -5 -5 L 5 0 L -5 5 z"
              fill="var(--text-primary)"
              transform={`translate(${pt[0]} ${pt[1]}) rotate(${angle})`}
            />
          ),
        )}
        {reducedMotion ? null : (
          <circle r="5" fill="var(--callout-success)">
            <animateMotion dur="14s" repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        )}
      </svg>

      {mids.map(({ pt }, i) =>
        SEGMENT_LABELS[i] ? (
          <span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-line-structure bg-surface-bg px-2 py-0.5"
            style={{ left: pct(pt[0], layout.w), top: pct(pt[1], layout.h) }}
          >
            <MonoLabel className="text-text-secondary">
              {SEGMENT_LABELS[i]}
            </MonoLabel>
          </span>
        ) : null,
      )}

      {PHASE_CENTERS.map(({ phase, at }) => {
        const [x, y] = layout.tf(at);
        const p = LOOP_PHASES[phase];
        return (
          <NextLink
            key={phase}
            href={p.href}
            className="absolute flex w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center no-underline md:w-[150px]"
            style={{ left: pct(x, layout.w), top: pct(y, layout.h) }}
          >
            <span className="text-[13px] font-medium text-text-primary md:text-[15px]">
              <Highlight>{p.label}</Highlight>
            </span>
            <MonoLabel className="hidden leading-[1.4] md:block">
              {p.title.toLowerCase()}
            </MonoLabel>
          </NextLink>
        );
      })}

      {STATIONS.map(({ id, at }) => (
        <Station
          key={id}
          id={id}
          at={at}
          layout={layout}
          active={active === id}
        />
      ))}
    </div>
  );
}

export function InfinityLoopVisual() {
  const active = LOOP_ORDER[useLoopTick(LOOP_ORDER.length)];
  return (
    <figure
      aria-label="The AI engineering loop as two connected cycles"
      className="not-prose text-left"
    >
      <Figure layout={WIDE} active={active} className="hidden md:block" />
      <Figure layout={TALL} active={active} className="md:hidden" />
      <figcaption className="sr-only">
        Two connected cycles. In development, build datasets, experiment, and
        evaluate. Deploy the change to production, where you trace and monitor
        it. What you learn becomes new test cases, and the development cycle
        starts again.
      </figcaption>
    </figure>
  );
}
