"use client";

import NextLink from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  LOOP_COPY,
  LOOP_ORDER,
  LOOP_STEP_PHASE,
  type LoopCopy,
  type LoopStepId,
} from "./steps";
import { ARROW_HEAD, ArrowHead, HArrow, VArrow } from "../diagram-arrows";
import { Highlight, MonoLabel, PulseDot, useLoopTick } from "./shared";

const CARD_HOVER =
  "corner-box-hover-stripes transition-[background,border-color] duration-180 ease-out";

function StepCard({
  copy,
  id,
  active,
  showPhase,
  className,
  style,
}: {
  copy: LoopCopy;
  id: LoopStepId;
  active: boolean;
  showPhase?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const step = copy.steps[id];
  return (
    <NextLink
      href={step.href}
      className={cn(
        "corner-box-corners relative flex flex-col border bg-surface-bg p-3",
        active ? "border-line-cta" : "border-line-structure",
        CARD_HOVER,
        className,
      )}
      style={style}
    >
      <PulseDot active={active} />
      {showPhase ? (
        <MonoLabel className="text-text-secondary">
          <Highlight>
            {copy.phases[LOOP_STEP_PHASE[id]].toLowerCase()}
          </Highlight>
        </MonoLabel>
      ) : null}
      <span
        className={cn(
          "flex flex-1 items-center whitespace-pre-line font-analog font-medium leading-[1.05] text-text-primary break-keep",
          showPhase
            ? "mt-1 text-[19px]"
            : "text-[20px] @3xl:text-[23px] [&:lang(ja)]:text-[14px]",
        )}
      >
        {showPhase ? step.title.replace("\n", "") : step.title}
      </span>
      <MonoLabel className="mt-2 leading-[1.5] break-keep">
        {step.meta.join("\u00a0· ")}
      </MonoLabel>
    </NextLink>
  );
}

/**
 * U-shaped return path drawn under the row. `left`/`right` are CSS insets
 * that land on card centers. The path starts at the bottom edge of the right
 * card and its arrow tip touches the bottom edge of the left card.
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
      className="absolute"
      style={{ left, right, top: 0, height: depth }}
      aria-hidden
    >
      <div
        className="absolute bg-line-cta"
        style={{ left: 0, width: 1, top: ARROW_HEAD - 1, bottom: 0 }}
      />
      <div
        className="absolute bg-line-cta"
        style={{ right: 0, width: 1, top: 0, bottom: 0 }}
      />
      <div
        className="absolute bg-line-cta"
        style={{ left: 0, right: 0, height: 1, bottom: 0 }}
      />
      <div
        className="absolute z-10 -translate-x-1/2"
        style={{ left: 0.5, top: 0 }}
      >
        <ArrowHead direction="up" />
      </div>
      <span
        className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 border border-line-structure bg-surface-bg px-2 py-1"
        style={{ top: depth }}
      >
        <MonoLabel className="text-text-secondary">{label}</MonoLabel>
      </span>
    </div>
  );
}

function PhaseBracket({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="px-1 text-[13px] font-medium text-text-primary">
        <Highlight>{label}</Highlight>
      </span>
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

type RowProps = { copy: LoopCopy; active: LoopStepId };

function WideRow({ copy, active }: RowProps) {
  return (
    <div className="hidden @2xl:block">
      <div
        className="mb-3 grid"
        style={{
          gridTemplateColumns: `calc(${CARD_W} * 2 + 24px) 24px minmax(0,1fr)`,
        }}
      >
        <PhaseBracket label={copy.phases.production} />
        <div />
        <PhaseBracket label={copy.phases.development} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)_24px_minmax(0,1fr)]">
        {LOOP_ORDER.map((id, i) => (
          <div key={id} className="contents">
            <StepCard
              copy={copy}
              id={id}
              active={active === id}
              className="h-[150px]"
            />
            {i < LOOP_ORDER.length - 1 ? (
              <div className="flex items-center">
                <HArrow />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="relative" style={{ height: 84 }}>
        <ReturnPath
          left={center(0, 10)}
          right={fromRight(1)}
          depth={26}
          label={copy.iterate}
        />
        <ReturnPath
          left={center(3)}
          right={fromRight(4, 10)}
          depth={26}
          label={copy.iterate}
        />
        <ReturnPath
          left={center(0, -10)}
          right={fromRight(4, -10)}
          depth={64}
          label={copy.deploy}
        />
      </div>
    </div>
  );
}

const M_CARD_H = 84;
const M_GAP = 28;
const mCenter = (i: number) => i * (M_CARD_H + M_GAP) + M_CARD_H / 2;

function CompactColumn({ copy, active }: RowProps) {
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
        className="absolute bg-line-cta"
        style={{ left: ARROW_HEAD - 1, right: 0, top: 0, height: 1 }}
      />
      <div
        className="absolute bg-line-cta"
        style={{ left: 0, right: 0, bottom: 0, height: 1 }}
      />
      <div
        className="absolute bg-line-cta"
        style={{ right: 0, width: 1, top: 0, bottom: 0 }}
      />
      <div
        className="absolute z-10 -translate-y-1/2"
        style={{ left: 0, top: 0.5 }}
      >
        <ArrowHead direction="left" />
      </div>
      <span className="absolute right-0 top-1/2 flex translate-x-1/2 -translate-y-1/2 border border-line-structure bg-surface-bg px-1 py-2 [writing-mode:vertical-rl]">
        <MonoLabel className="text-text-secondary">{label}</MonoLabel>
      </span>
    </div>
  );

  // 56px is the return rail (right-3 + w-11), so the arrow tips touch the cards.
  return (
    <div
      className="relative @2xl:hidden"
      style={{ height: total, paddingRight: 56 }}
    >
      <div className="flex flex-col">
        {LOOP_ORDER.map((id, i) => (
          <div key={id} className="flex flex-col">
            <StepCard
              copy={copy}
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
        {sideReturn(1, 0, 18, copy.iterate, 10)}
        {sideReturn(4, 3, 18, copy.iterate, -10)}
        {sideReturn(4, 0, 40, copy.deploy, -10)}
      </div>
    </div>
  );
}

/**
 * Breakpoints are container queries, so the row also fits the narrower docs
 * column. Passing `highlight` pins that step instead of cycling.
 */
export function AcademyRowVisual({
  copy = LOOP_COPY,
  highlight,
  className,
}: {
  copy?: LoopCopy;
  highlight?: LoopStepId;
  className?: string;
}) {
  const tick = useLoopTick(LOOP_ORDER.length, highlight !== undefined);
  const active = highlight ?? LOOP_ORDER[tick];
  return (
    <figure
      lang={copy.lang}
      aria-label={copy.ariaLabel}
      className={cn("not-prose @container text-left", className)}
    >
      <WideRow copy={copy} active={active} />
      <CompactColumn copy={copy} active={active} />
      <figcaption className="sr-only">{copy.caption}</figcaption>
    </figure>
  );
}
