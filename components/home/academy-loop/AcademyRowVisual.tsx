"use client";

import NextLink from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  LOOP_ORDER,
  LOOP_PHASES,
  LOOP_STEPS,
  type LoopPhaseId,
  type LoopStepId,
} from "./steps";
import {
  ArrowHead,
  HArrow,
  Highlight,
  MonoLabel,
  PulseDot,
  VArrow,
  useLoopTick,
} from "./shared";

const CARD_HOVER =
  "corner-box-hover-stripes transition-[background,border-color] duration-180 ease-out";

const YELLOW_BAND: CSSProperties = {
  borderColor:
    "color-mix(in oklab, var(--surface-cta-primary) 85%, transparent)",
};

function StepCard({
  id,
  active,
  showPhase,
  className,
  style,
}: {
  id: LoopStepId;
  active: boolean;
  showPhase?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const step = LOOP_STEPS[id];
  return (
    <NextLink
      href={step.href}
      className={cn(
        "relative flex flex-col border bg-surface-bg p-3",
        active ? "border-line-cta" : "border-line-structure",
        CARD_HOVER,
        className,
      )}
      style={style}
    >
      <PulseDot active={active} />
      {showPhase ? (
        <MonoLabel className="text-text-secondary">
          <Highlight>{LOOP_PHASES[step.phase].label.toLowerCase()}</Highlight>
        </MonoLabel>
      ) : null}
      <span
        className={cn(
          "flex flex-1 items-center font-analog font-medium leading-[1.05] text-text-primary",
          showPhase ? "mt-1 text-[19px]" : "text-[20px] xl:text-[23px]",
        )}
      >
        {step.title}
      </span>
      <MonoLabel className="mt-2 leading-[1.5]">
        {step.meta.join(" · ")}
      </MonoLabel>
    </NextLink>
  );
}

/**
 * U-shaped return path drawn under the row. `left`/`right` are CSS insets
 * that land on card centers; the arrow points up into the left end.
 */
function ReturnPath({
  left,
  right,
  depth,
  label,
}: {
  left: string;
  right: string;
  depth: number;
  label: string;
}) {
  return (
    <div
      className="absolute top-0"
      style={{ left, right, height: depth }}
      aria-hidden
    >
      <div
        className="absolute -inset-x-[2px] top-0 border-x-[5px] border-b-[5px]"
        style={{ ...YELLOW_BAND, height: depth + 2 }}
      />
      <div className="absolute inset-0 border-x border-b border-text-primary" />
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[3px]">
        <ArrowHead direction="up" dark />
      </div>
      <span
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border border-line-structure bg-surface-bg px-2 py-0.5"
        style={{ top: depth }}
      >
        <MonoLabel className="text-text-secondary">{label}</MonoLabel>
      </span>
    </div>
  );
}

function PhaseBracket({
  phase,
  className,
}: {
  phase: LoopPhaseId;
  className?: string;
}) {
  const p = LOOP_PHASES[phase];
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-[13px] font-medium text-text-primary">
          <Highlight>{p.label}</Highlight>
        </span>
        <MonoLabel>{p.title.toLowerCase()}</MonoLabel>
      </div>
      <div
        className="h-2 border-x border-t border-line-structure"
        aria-hidden
      />
    </div>
  );
}

// Five cards with 24px arrow gutters: card width is (100% - 96px) / 5.
const CARD_W = "((100% - 96px) / 5)";
const center = (i: number, nudge = 0) =>
  `calc(${CARD_W} * ${i + 0.5} + ${i * 24 + nudge}px)`;
const fromRight = (i: number, nudge = 0) =>
  `calc(${CARD_W} * ${4 - i + 0.5} + ${(4 - i) * 24 + nudge}px)`;

function WideRow({ active }: { active: LoopStepId }) {
  return (
    <div className="hidden md:block">
      <div
        className="mb-3 grid"
        style={{
          gridTemplateColumns: `calc(${CARD_W} * 2 + 24px) 24px minmax(0,1fr)`,
        }}
      >
        <PhaseBracket phase="production" />
        <div />
        <PhaseBracket phase="development" />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)]">
        {LOOP_ORDER.map((id, i) => (
          <div key={id} className="contents">
            <StepCard id={id} active={active === id} className="h-[150px]" />
            {i < LOOP_ORDER.length - 1 ? (
              <div className="flex items-center px-1">
                <HArrow />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative h-[84px]">
        <ReturnPath
          left={center(0, 10)}
          right={fromRight(1)}
          depth={26}
          label="iterate"
        />
        <ReturnPath
          left={center(2)}
          right={fromRight(4, 10)}
          depth={26}
          label="iterate"
        />
        <ReturnPath
          left={center(0, -10)}
          right={fromRight(4, -10)}
          depth={64}
          label="deploy"
        />
      </div>
    </div>
  );
}

const M_CARD_H = 84;
const M_GAP = 28;
const mCenter = (i: number) => i * (M_CARD_H + M_GAP) + M_CARD_H / 2;

function CompactColumn({ active }: { active: LoopStepId }) {
  const total = LOOP_ORDER.length * M_CARD_H + (LOOP_ORDER.length - 1) * M_GAP;
  const sideReturn = (
    from: number,
    to: number,
    width: number,
    label: string,
    nudge = 0,
  ) => (
    <div
      aria-hidden
      className="absolute left-0"
      style={{
        top: mCenter(to) + nudge,
        bottom: total - mCenter(from) - nudge,
        width,
      }}
    >
      <div
        className="absolute -inset-y-[2px] left-0 -right-[2px] border-y-[5px] border-r-[5px]"
        style={YELLOW_BAND}
      />
      <div className="absolute inset-0 border-y border-r border-text-primary" />
      <div className="absolute left-0 top-0 -translate-x-[5px] -translate-y-1/2">
        <ArrowHead direction="left" dark />
      </div>
      <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border border-line-structure bg-surface-bg px-0.5 py-2 [writing-mode:vertical-rl]">
        <MonoLabel className="text-text-secondary">{label}</MonoLabel>
      </span>
    </div>
  );

  return (
    <div className="relative pr-14 md:hidden" style={{ height: total }}>
      <div className="flex flex-col">
        {LOOP_ORDER.map((id, i) => (
          <div key={id} className="flex flex-col">
            <StepCard
              id={id}
              active={active === id}
              showPhase
              className="py-2.5"
              style={{ height: M_CARD_H }}
            />
            {i < LOOP_ORDER.length - 1 ? (
              <div className="flex justify-center" style={{ height: M_GAP }}>
                <VArrow />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 right-3 w-11">
        {sideReturn(1, 0, 18, "iterate", 10)}
        {sideReturn(4, 2, 18, "iterate", -10)}
        {sideReturn(4, 0, 40, "deploy")}
      </div>
    </div>
  );
}

export function AcademyRowVisual() {
  const active = LOOP_ORDER[useLoopTick(LOOP_ORDER.length)];
  return (
    <figure
      aria-label="The AI engineering loop from the Langfuse Academy"
      className="not-prose text-left"
    >
      <WideRow active={active} />
      <CompactColumn active={active} />
      <figcaption className="sr-only">
        In production, trace and monitor your application, and iterate directly
        on what monitoring surfaces. During development, build datasets,
        experiment, and evaluate, iterating until a change is good enough.
        Deploy it, and the loop starts again with new traces.
      </figcaption>
    </figure>
  );
}
