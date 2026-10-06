"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { financialServicesTrace } from "./content";

const barClassByType = {
  agent: "bg-surface-2",
  tool: "bg-[var(--callout-info)]",
  llm: "bg-text-secondary",
  eval: "bg-surface-cta-primary",
} as const;

const scoreToneClass = {
  success: "border-[var(--callout-success)] text-[var(--callout-success)]",
  warning: "border-[var(--callout-warning)] text-[var(--callout-warning)]",
  neutral: "border-text-secondary text-text-secondary",
} as const;

export function CreditOnboardingTraceMock() {
  const [spanIndex, setSpanIndex] = useState(4);
  const [whyIndex, setWhyIndex] = useState<number | null>(2);
  const selected = financialServicesTrace.spans[spanIndex];

  return (
    <div className="corner-box-corners relative w-full overflow-hidden border border-line-structure bg-surface-bg shadow-sm">
      <div className="flex flex-col gap-4 border-b border-line-structure bg-surface-bg px-5 py-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-line-structure bg-surface-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] text-text-tertiary">
              Illustrative example
            </span>
            <span className="font-mono text-[11px] text-text-tertiary">
              Outcome
            </span>
          </div>
          <p className="max-w-[36rem] text-[17px] font-medium leading-snug text-text-primary">
            {financialServicesTrace.outcome}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-text-tertiary">Why:</span>
          {financialServicesTrace.reasons.map((reason, index) => (
            <button
              key={reason.label}
              type="button"
              onClick={() => {
                setSpanIndex(reason.span);
                setWhyIndex(index);
              }}
              className={cn(
                "rounded-[2px] border px-2.5 py-1.5 font-mono text-[11px] leading-none",
                whyIndex === index
                  ? "border-line-cta bg-surface-cta-primary text-text-primary"
                  : "border-line-structure bg-surface-bg text-text-secondary hover:border-line-cta",
              )}
            >
              {reason.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-10 items-center gap-3 overflow-hidden border-b border-line-structure px-4 font-mono text-[11px] text-text-tertiary">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line-structure" />
          <span className="size-2 rounded-full bg-line-structure" />
          <span className="size-2 rounded-full bg-line-structure" />
        </span>
        <span className="min-w-0 truncate">
          {financialServicesTrace.path}{" "}
          <span className="text-text-primary">
            {financialServicesTrace.traceId}
          </span>
        </span>
        <span className="ml-auto shrink-0 whitespace-nowrap">
          {financialServicesTrace.duration} · {financialServicesTrace.cost} ·{" "}
          {financialServicesTrace.tokens}
        </span>
      </div>

      <div className="flex flex-wrap">
        <div className="min-w-0 flex-[1_1_560px] lg:border-r lg:border-line-structure">
          <div className="grid grid-cols-[minmax(160px,240px)_minmax(0,1fr)_56px] gap-3 border-b border-dashed border-line-divider-dash px-4 py-2 font-mono text-[10px] uppercase tracking-[0.04em] text-text-tertiary">
            <span>Span</span>
            <span>Timeline</span>
            <span className="text-right">Dur.</span>
          </div>
          {financialServicesTrace.spans.map((span, index) => (
            <button
              key={span.name}
              type="button"
              onClick={() => {
                setSpanIndex(index);
                setWhyIndex(null);
              }}
              className={cn(
                "grid w-full grid-cols-[minmax(160px,240px)_minmax(0,1fr)_56px] items-center gap-3 border-b border-dashed border-line-divider-dash px-4 py-2.5 text-left hover:bg-surface-2",
                index === spanIndex && "bg-surface-2",
              )}
            >
              <div
                className="flex min-w-0 items-center gap-2"
                style={{ paddingLeft: span.indent }}
              >
                <span className="shrink-0 rounded-[2px] border border-line-structure px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.04em] text-text-tertiary">
                  {span.type}
                </span>
                <span className="truncate font-mono text-[12px] text-text-primary">
                  {span.name}
                </span>
              </div>
              <div className="relative h-3.5">
                <div className="absolute inset-x-0 top-1.5 border-t border-dashed border-line-divider-dash" />
                <div
                  className={cn(
                    "absolute top-0 h-3.5 rounded-[1px]",
                    barClassByType[span.type],
                  )}
                  style={{ left: `${span.left}%`, width: `${span.width}%` }}
                />
              </div>
              <span className="text-right font-mono text-[11px] text-text-tertiary">
                {span.dur}
              </span>
            </button>
          ))}
          <div className="flex flex-col gap-2 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.04em] text-text-tertiary">
              {selected.name} · {selected.label}
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-[2px] bg-surface-code p-3 font-mono text-[12px] leading-[1.7] text-text-code-secondary">
              {selected.io}
            </pre>
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_300px] flex-col">
          <div className="flex flex-col gap-2.5 border-b border-dashed border-line-divider-dash p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.04em] text-text-tertiary">
              Scores
            </p>
            {financialServicesTrace.scores.map((score) => (
              <div
                key={score.k}
                className="flex items-center justify-between gap-2"
              >
                <span className="font-mono text-[12px] text-text-secondary">
                  {score.k}
                </span>
                <span
                  className={cn(
                    "rounded-[2px] border px-1.5 py-px font-mono text-[11px]",
                    scoreToneClass[score.tone],
                  )}
                >
                  {score.v}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 p-4">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.04em] text-text-tertiary">
              <span>Audit log</span>
              <span>Activity</span>
            </div>
            {financialServicesTrace.audit.map((entry, index) => (
              <div
                key={`${entry.t}-${index}`}
                className="grid grid-cols-[62px_minmax(0,1fr)] gap-2.5 font-mono text-[11px] leading-[150%]"
              >
                <span className="text-text-tertiary">{entry.t}</span>
                <span className="text-text-secondary">{entry.e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
