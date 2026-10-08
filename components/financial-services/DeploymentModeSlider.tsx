"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  financialServicesDeploymentModes,
  type FinancialServicesDeploymentModeId,
} from "./content";

export function DeploymentModeSlider() {
  const [modeId, setModeId] =
    useState<FinancialServicesDeploymentModeId>("cloud");
  const groupRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const mode =
    financialServicesDeploymentModes.find((item) => item.id === modeId) ??
    financialServicesDeploymentModes[0];

  const selectMode = (id: FinancialServicesDeploymentModeId) => {
    setModeId(id);
  };

  const onRadioKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = financialServicesDeploymentModes.length - 1;
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = last;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const next = financialServicesDeploymentModes[nextIndex];
    selectMode(next.id);
    const buttons =
      groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby={labelId}
        className="inline-flex w-full overflow-hidden rounded-[1px] border border-line-structure sm:w-fit"
      >
        <span id={labelId} className="sr-only">
          Deployment mode
        </span>
        {financialServicesDeploymentModes.map((item, index) => {
          const active = item.id === modeId;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectMode(item.id)}
              onKeyDown={(event) => onRadioKeyDown(event, index)}
              className={cn(
                "flex-1 px-3 py-1.5 text-left sm:flex-none",
                index > 0 && "border-l border-line-structure",
                active
                  ? "bg-surface-1 text-text-primary"
                  : "bg-surface-bg text-text-primary hover:bg-surface-1",
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.06em]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 border border-line-structure bg-surface-bg p-4 sm:p-5">
        <p className="text-[16px] leading-[1.35] text-text-primary">
          {mode.title}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-secondary">
          {mode.flow.map((step, index) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span
                className={cn(
                  "border px-2 py-1",
                  index === mode.flow.length - 1
                    ? "border-line-cta bg-surface-cta-primary text-text-primary"
                    : "border-line-structure bg-surface-bg",
                )}
              >
                {step}
              </span>
              {index < mode.flow.length - 1 ? (
                <span className="text-text-tertiary">→</span>
              ) : null}
            </span>
          ))}
        </p>
        <dl className="mt-4 grid gap-2">
          {mode.specs.map((spec) => (
            <div
              key={spec.k}
              className="flex justify-between gap-3 border-t border-line-structure pt-2 font-mono text-[11px]"
            >
              <dt className="text-text-tertiary">{spec.k}</dt>
              <dd className="text-right text-text-primary">{spec.v}</dd>
            </div>
          ))}
        </dl>
        <a
          href={mode.href}
          className="mt-4 inline-block text-[13px] text-text-primary underline decoration-line-structure underline-offset-4 hover:text-text-primary"
        >
          {"Docs →"}
        </a>
      </div>
    </div>
  );
}
