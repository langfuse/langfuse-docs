"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { controlTextClassName } from "@/components/ui/button";
import { TabButton } from "@/components/ui/tab-button";
import { cn } from "@/lib/utils";
import { financialServicesDeploymentModes } from "./content";

type DeploymentMode = {
  id: string;
  label: string;
  title: string;
  href: string;
  flow: readonly string[];
  specs: readonly { k: string; v: string }[];
};

export function DeploymentModeSlider({
  modes = financialServicesDeploymentModes,
}: {
  modes?: readonly DeploymentMode[];
} = {}) {
  const [modeId, setModeId] = useState(modes[0]?.id ?? "cloud");
  const groupRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const mode = modes.find((item) => item.id === modeId) ?? modes[0];

  if (!mode) return null;

  const selectMode = (id: string) => {
    setModeId(id);
  };

  const onRadioKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = modes.length - 1;
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
    const next = modes[nextIndex];
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
        className="-m-1 flex flex-wrap"
      >
        <span id={labelId} className="sr-only">
          Deployment mode
        </span>
        {modes.map((item, index) => {
          const active = item.id === modeId;
          return (
            <TabButton
              key={item.id}
              active={active}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectMode(item.id)}
              onKeyDown={(event) => onRadioKeyDown(event, index)}
            >
              {item.label}
            </TabButton>
          );
        })}
      </div>

      <div className="mt-4 border border-line-structure bg-surface-bg p-4 sm:p-5">
        <p className="text-[16px] leading-[1.35] text-text-primary">
          {mode.title}
        </p>
        <p
          className={cn(
            "mt-3 flex flex-wrap items-center gap-2 text-text-secondary",
            controlTextClassName,
          )}
        >
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
              className={cn(
                "flex justify-between gap-3 border-t border-line-structure pt-2",
                controlTextClassName,
              )}
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
