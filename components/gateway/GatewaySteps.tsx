"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import { steps } from "./content";

const TICKS = 6;
const TICK_MS = 1000;

/**
 * Hover click-through for the step dialogs. Returns `null` at rest (dialog
 * shows its filled state) and 0..TICKS-1 while hovered.
 */
function useDemoTick() {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setTick(null);
  }, []);

  const start = useCallback(() => {
    if (reduceMotion) return;
    if (timer.current) clearInterval(timer.current);
    setTick(0);
    timer.current = setInterval(
      () => setTick((t) => ((t ?? 0) + 1) % TICKS),
      TICK_MS,
    );
  }, [reduceMotion]);

  useEffect(() => stop, [stop]);

  return { tick, handlers: { onMouseEnter: start, onMouseLeave: stop } };
}

const fieldLabel = "text-[13px] font-semibold leading-[1.3] text-text-primary";
const field =
  "flex h-[34px] items-center justify-between gap-2 rounded-[6px] border bg-card px-2.5 text-[13px] transition-colors duration-200";

function DialogFrame({
  title,
  status,
  action,
  pressed,
  cursor,
  children,
  ...handlers
}: {
  title: string;
  status: string;
  action: string;
  pressed: boolean;
  cursor: { x: number; y: number } | null;
  children: React.ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      {...handlers}
      aria-hidden
      className="relative mt-2 @2xl:mt-0 @3xl:mt-2 overflow-hidden rounded-[10px] border border-line-structure bg-card shadow-[0_8px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between border-b border-line-structure px-4 py-3 text-[16px] font-semibold tracking-[-0.01em] text-text-primary">
        <span>{title}</span>
        <span className="font-normal text-text-tertiary">×</span>
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-3.5">{children}</div>
      <div className="flex items-center justify-end gap-2 border-t border-line-structure px-4 py-3">
        <span className="mr-auto min-w-0 truncate font-mono text-[11px] text-muted-green">
          {status}
        </span>
        <span
          className={cn(
            "inline-flex h-[30px] items-center whitespace-nowrap rounded-[6px] px-3 text-[12px] font-[450] text-surface-bg transition-colors duration-150",
            pressed ? "bg-text-tertiary" : "bg-text-primary",
          )}
        >
          {action}
        </span>
      </div>
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        className={cn(
          styles.cursor,
          "pointer-events-none absolute transition-[opacity,left,top] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
          cursor ? "opacity-100" : "opacity-0",
        )}
        style={{ left: `${cursor?.x ?? 82}%`, top: `${cursor?.y ?? 88}%` }}
      >
        <path
          d="M1 1v13l3.6-3.2 2.3 5.4 2.2-.9-2.3-5.3H12z"
          fill="var(--text-primary)"
          stroke="var(--surface-bg)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function AddConnectionDialog() {
  const { tick, handlers } = useDemoTick();
  const t = tick ?? 2;
  const idle = tick === null;
  const pos = [
    { x: 40, y: 38 },
    { x: 40, y: 68 },
    { x: 82, y: 88 },
  ][Math.min(t, 2)];

  return (
    <DialogFrame
      {...handlers}
      title="Add connection"
      status={t >= 4 ? "Connection saved" : ""}
      action="Test and save"
      pressed={t === 3}
      cursor={idle ? null : pos}
    >
      <div className={fieldLabel}>Provider</div>
      <div
        className={cn(
          field,
          !idle && t === 0 ? "border-text-primary" : "border-line-structure",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-2",
            t >= 1 ? "text-text-primary" : "text-text-disabled",
          )}
        >
          {t >= 1 && (
            <span className="flex size-5 items-center justify-center rounded-[5px] border border-line-structure bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/integrations/anthropic_icon.png"
                alt=""
                className="block size-[13px] object-contain"
              />
            </span>
          )}
          <span>{t >= 1 ? "Anthropic" : "Select provider"}</span>
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6">
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.2"
          />
        </svg>
      </div>
      <div className="h-1" />
      <div className={fieldLabel}>Anthropic API key</div>
      <div
        className={cn(
          field,
          !idle && t === 1 ? "border-text-primary" : "border-line-structure",
        )}
      >
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap",
            t >= 2
              ? "font-mono text-[12px] text-text-primary"
              : "text-text-disabled",
          )}
        >
          {t >= 2
            ? "sk-ant-api03-••••••••••••••••••••4f2A"
            : "Enter Anthropic API key"}
        </span>
      </div>
    </DialogFrame>
  );
}

function CreateKeyDialog() {
  const { tick, handlers } = useDemoTick();
  const t = tick ?? 2;
  const idle = tick === null;
  const service = t >= 1;
  const pos = [
    { x: 70, y: 37 },
    { x: 40, y: 64 },
    { x: 84, y: 86 },
  ][Math.min(t, 2)];

  const segment = (selected: boolean) =>
    cn(
      "flex h-7 flex-1 items-center justify-center whitespace-nowrap rounded-[6px] text-[12px] font-[450] transition-colors duration-200",
      selected
        ? "bg-card text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
        : "text-text-tertiary",
    );

  return (
    <DialogFrame
      {...handlers}
      title="Create gateway key"
      status={t >= 4 ? "Key created, shown only once" : ""}
      action="Create key"
      pressed={t === 3}
      cursor={idle ? null : pos}
    >
      <div className={fieldLabel}>Issued as</div>
      <div className="flex gap-0.5 rounded-[8px] bg-surface-1 p-[3px]">
        <span className={segment(!service)}>My user</span>
        <span className={segment(service)}>Service account</span>
      </div>
      <div className="h-1" />
      <div className={fieldLabel}>Name</div>
      <div
        className={cn(
          field,
          !idle && t === 1 ? "border-text-primary" : "border-line-structure",
        )}
      >
        <span className="text-text-primary">
          {t >= 2 ? "CI release pipeline" : ""}
        </span>
      </div>
    </DialogFrame>
  );
}

type DiffLine = { kind: " " | "-" | "+"; text: string };

const diff: DiffLine[] = [
  { kind: " ", text: "client = OpenAI(" },
  { kind: "-", text: '  api_key="sk-proj-••••••••",' },
  { kind: "+", text: "  # EU region. US: gateway.us.cloud.langfuse.com" },
  {
    kind: "+",
    text: '  base_url="https://gateway.cloud.langfuse.com/openai/v1",',
  },
  { kind: "+", text: '  api_key="<your-gateway-key>",' },
  { kind: " ", text: ")" },
];

function CodeDiff() {
  return (
    <div className="mt-2 @2xl:mt-0 @3xl:mt-2 overflow-hidden rounded-[2px] border border-line-structure bg-card font-mono text-[12.5px] leading-[1.7]">
      <div className="border-b border-line-structure bg-surface-1 px-3 py-1.5 text-[11px] text-text-tertiary">
        client.py
      </div>
      <pre className="m-0 overflow-x-auto bg-transparent py-2 font-mono">
        {diff.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex w-max min-w-full gap-2.5 px-3 py-px",
              line.kind === " " && "text-text-tertiary",
              line.kind === "-" && "bg-destructive/10 text-destructive",
              line.kind === "+" && "bg-muted-green/15 text-text-primary",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "w-2 shrink-0",
                line.kind === "+" && "text-muted-green",
              )}
            >
              {line.kind}
            </span>
            <span className="whitespace-pre">{line.text}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function Step({
  number,
  step,
  children,
  className,
}: {
  number: string;
  step: { title: string; body: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Stacked on phones, text beside the visual at medium widths, and
        // stacked again inside each of the three columns from medium-wide cards.
        "grid min-w-0 items-start gap-x-8 gap-y-2.5 bg-surface-bg px-5 pb-7 pt-6 @2xl:grid-cols-2 @3xl:grid-cols-1",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="font-mono text-[11px] text-text-tertiary">{number}</div>
        <h3 className="font-analog text-[22px] leading-[1.2] text-text-primary">
          {step.title}
        </h3>
        <p className="text-[14px] leading-[1.5] text-text-secondary">
          {step.body}
        </p>
        <Link
          href={step.href}
          className="mt-1 self-start whitespace-nowrap text-[13px] text-text-secondary underline decoration-line-structure underline-offset-4 hover:text-text-primary"
        >
          Read the docs →
        </Link>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function GatewaySteps() {
  return (
    <CornerBox className="grid gap-px bg-line-structure @3xl:grid-cols-3">
      <Step number="01" step={steps.connect}>
        <AddConnectionDialog />
      </Step>
      <Step number="02" step={steps.keys}>
        <CreateKeyDialog />
      </Step>
      <Step number="03" step={steps.url}>
        <CodeDiff />
      </Step>
    </CornerBox>
  );
}
