"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { financialServicesTrace } from "./content";

export function CreditOnboardingTraceMock() {
  const [spanIndex, setSpanIndex] = useState(4);
  const selected = financialServicesTrace.spans[spanIndex];

  return (
    <div className="corner-box-corners relative w-full border border-line-structure bg-surface-bg shadow-sm">
      <div className="border-b border-line-structure px-3 py-2.5 sm:px-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
          Illustrative example · credit-onboarding
        </p>
        <p className="mt-1 text-[13px] leading-[1.4] text-text-primary">
          {financialServicesTrace.outcome}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {financialServicesTrace.reasons.map((reason) => (
            <button
              key={reason.label}
              type="button"
              onClick={() => setSpanIndex(reason.span)}
              className={cn(
                "border px-2 py-1 font-mono text-[10px] leading-none",
                spanIndex === reason.span
                  ? "border-line-cta bg-surface-cta-primary text-text-primary"
                  : "border-line-structure bg-surface-bg text-text-secondary hover:border-line-cta",
              )}
            >
              {reason.label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-text-tertiary">
          {financialServicesTrace.traceId} · {financialServicesTrace.duration} ·{" "}
          {financialServicesTrace.cost} · {financialServicesTrace.tokens}
        </p>
      </div>

      <div className="grid border-b border-line-structure lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-1.5 border-b border-line-structure px-3 py-3 lg:border-b-0 lg:border-r">
          {financialServicesTrace.spans.map((span, index) => (
            <button
              key={span.name}
              type="button"
              onClick={() => setSpanIndex(index)}
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1.5 text-left",
                index === spanIndex ? "bg-surface-2" : "hover:bg-surface-1",
              )}
            >
              <span
                className={cn(
                  "h-2.5 shrink-0",
                  span.highlight
                    ? "w-10 border border-text-primary bg-surface-cta-primary"
                    : "w-7 bg-text-secondary",
                  span.indent && "ml-3",
                )}
              />
              <span className="min-w-0 flex-1 font-mono text-[11px] text-text-primary">
                {span.name}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
                {span.type} · {span.dur}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3 px-3 py-3 sm:px-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
              {selected.type}
            </p>
            <p className="mt-1 font-mono text-[12px] text-text-primary">
              {selected.name}
            </p>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[10px] leading-[1.45] text-text-secondary">
              {selected.io}
            </pre>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
              Scores
            </p>
            <ul className="mt-1 space-y-1">
              {financialServicesTrace.scores.map((score) => (
                <li
                  key={score.k}
                  className="flex justify-between gap-3 font-mono text-[10px] text-text-secondary"
                >
                  <span>{score.k}</span>
                  <span className="text-text-primary">{score.v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
              Audit log
            </p>
            <ul className="mt-1 space-y-1">
              {financialServicesTrace.audit.map((entry) => (
                <li
                  key={`${entry.t}-${entry.e}`}
                  className="flex gap-2 font-mono text-[10px] text-text-secondary"
                >
                  <span className="shrink-0 text-text-tertiary">{entry.t}</span>
                  <span>{entry.e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
