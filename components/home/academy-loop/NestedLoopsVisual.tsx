"use client";

import NextLink from "next/link";
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

// Shared column template so the production row, the connectors, and the
// development row line up: three step columns with arrow gutters between.
const GRID =
  "grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)_28px_minmax(0,1fr)]";

function StepCard({ id, active }: { id: LoopStepId; active: boolean }) {
  const step = LOOP_STEPS[id];
  const index = LOOP_ORDER.indexOf(id) + 1;
  return (
    <NextLink
      href={step.href}
      className={cn(
        "relative flex min-h-[64px] flex-col gap-1 border bg-surface-bg p-2.5 sm:min-h-[88px] sm:p-3",
        active ? "border-line-cta" : "border-line-structure",
        CARD_HOVER,
      )}
    >
      <PulseDot active={active} />
      <MonoLabel>{String(index).padStart(2, "0")}</MonoLabel>
      <span className="font-analog text-[15px] font-medium leading-tight text-text-primary sm:text-[19px]">
        {step.title}
      </span>
      <span className="hidden text-[12px] leading-snug text-text-tertiary md:block">
        {step.summary}
      </span>
    </NextLink>
  );
}

function PhaseHeader({ phase }: { phase: LoopPhaseId }) {
  const p = LOOP_PHASES[phase];
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-[13px] font-medium text-text-primary">
        <Highlight>{p.loop}</Highlight>
      </span>
      <MonoLabel>{p.title.toLowerCase()}</MonoLabel>
    </div>
  );
}

function Connector({
  direction,
  label,
  labelSide = "right",
}: {
  direction: "up" | "down";
  label: string;
  labelSide?: "left" | "right";
}) {
  return (
    <div className="relative flex h-14 justify-center sm:h-16">
      <VArrow direction={direction} />
      <MonoLabel
        className={cn(
          "absolute top-1/2 -translate-y-1/2 whitespace-nowrap",
          labelSide === "right"
            ? "left-[calc(50%+8px)]"
            : "right-[calc(50%+8px)]",
        )}
      >
        {label}
      </MonoLabel>
    </div>
  );
}

export function NestedLoopsVisual() {
  const active = LOOP_ORDER[useLoopTick(LOOP_ORDER.length)];

  return (
    <figure
      aria-label="The inner and outer loop of AI engineering"
      className="not-prose text-left"
    >
      <div className="border border-dashed border-line-divider-dash p-2 sm:p-4">
        <div className="px-2 pb-3 sm:px-3">
          <PhaseHeader phase="production" />
        </div>

        <div className={cn(GRID, "px-2 sm:px-3")}>
          <StepCard id="trace" active={active === "trace"} />
          <div className="col-span-3 flex items-center px-2">
            <HArrow />
          </div>
          <StepCard id="monitor" active={active === "monitor"} />
        </div>

        <div className={cn(GRID, "px-2 sm:px-3")}>
          <Connector direction="up" label="deploy" />
          <div className="col-span-3" />
          <Connector direction="down" label="new test cases" labelSide="left" />
        </div>

        <div className="border border-line-structure bg-surface-1 px-2 pb-2 pt-3 sm:px-3 sm:pb-3">
          <div className="pb-3">
            <PhaseHeader phase="development" />
          </div>
          <div className={GRID}>
            <StepCard id="eval" active={active === "eval"} />
            <div className="flex items-center px-1">
              <HArrow direction="left" />
            </div>
            <StepCard id="experiment" active={active === "experiment"} />
            <div className="flex items-center px-1">
              <HArrow direction="left" />
            </div>
            <StepCard id="dataset" active={active === "dataset"} />
          </div>

          {/* Iterate: from Evaluate back to Build datasets, without deploying. */}
          <div className={cn(GRID, "h-9")} aria-hidden>
            <div className="relative col-span-5 mx-[calc((100%-56px)/6)]">
              <div
                className="absolute -inset-x-[2px] top-0 h-[22px] border-x-[5px] border-b-[5px] opacity-80"
                style={{ borderColor: "var(--surface-cta-primary)" }}
              />
              <div className="absolute inset-x-0 top-0 h-5 border-x border-b border-text-primary" />
              <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-[3px]">
                <ArrowHead direction="up" dark />
              </div>
              <span className="absolute left-1/2 top-5 -translate-x-1/2 -translate-y-1/2 border border-line-structure bg-surface-bg px-2 py-0.5">
                <MonoLabel className="whitespace-nowrap">
                  iterate
                  <span className="hidden sm:inline">
                    {" "}
                    until it&apos;s good enough to ship
                  </span>
                </MonoLabel>
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        The outer loop runs in production: trace every request, monitor it, and
        turn what you find into new test cases. The inner loop runs during
        development: build datasets, experiment, and evaluate, iterating until a
        change is good enough to deploy. Deploying starts the outer loop again.
      </figcaption>
    </figure>
  );
}
