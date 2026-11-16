"use client";

import { useEffect, useState } from "react";
import { Bell, Check, KeyRound, Lock, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALL_PROVIDERS,
  type DoorAnimation as DoorAnimationSpec,
} from "./doors";

function useTick(intervalMs: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

function Stage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "adv-stage relative flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-[6px] p-4 sm:min-h-[230px] sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

function RouteAnimation({ from, to }: { from: string[]; to: string[] }) {
  const tick = useTick(2400);
  const source = from[tick % from.length];
  const target = to[tick % to.length];
  return (
    <Stage>
      <div className="relative grid w-full max-w-[520px] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div key={`from-${tick}`} className="adv-node adv-pop">
          {source}
        </div>
        <div className="adv-node adv-node-hub">
          <span className="adv-hub-glow" />
          Langfuse
          <br />
          AI Gateway
          <span key={`trace-${tick}`} className="adv-trace-badge">
            +1 trace
          </span>
        </div>
        <div key={`to-${tick}`} className="adv-node adv-pop">
          {target}
        </div>
        <div className="adv-wire adv-wire-left">
          <span key={`a-${tick}`} className="adv-packet" />
        </div>
        <div className="adv-wire adv-wire-right">
          <span key={`b-${tick}`} className="adv-packet adv-packet-late" />
        </div>
      </div>
    </Stage>
  );
}

function TerminalAnimation({ lines }: { lines: string[] }) {
  const full = lines.join("\n");
  const [chars, setChars] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setChars((c) => (c > full.length + 60 ? 0 : c + 2));
    }, 30);
    return () => clearInterval(id);
  }, [full.length]);
  const shown = full.slice(0, chars);
  return (
    <Stage className="items-stretch justify-start">
      <div className="adv-terminal w-full">
        <div className="adv-terminal-bar">
          <span />
          <span />
          <span />
        </div>
        <pre className="adv-terminal-body">
          {shown.split("\n").map((line, i) => (
            <div
              key={i}
              className={cn(line.startsWith("✓") && "adv-terminal-ok")}
            >
              {line || " "}
            </div>
          ))}
          <span className="adv-cursor" />
        </pre>
      </div>
    </Stage>
  );
}

function KeysAnimation() {
  const people = ["jane@acme.com", "ci-release", "max@acme.com"];
  return (
    <Stage>
      <div className="flex w-full max-w-[520px] items-center justify-between gap-3">
        <div className="adv-vault">
          <Lock className="size-5" />
          <span className="font-mono text-[11px]">sk-provider-••••</span>
          <span className="text-[11px] opacity-70">stays in Langfuse</span>
        </div>
        <div className="flex flex-col gap-3">
          {people.map((person, i) => (
            <div key={person} className="flex items-center gap-2">
              <span
                className="adv-key-chip"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <KeyRound className="size-3.5" />
                lf-gw-{i + 1}
              </span>
              <span className="adv-person">
                <User className="size-3.5" />
                {person}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

function ProvidersAnimation({ highlight }: { highlight: string[] }) {
  return (
    <Stage>
      <div className="flex max-w-[520px] flex-wrap justify-center gap-2">
        {ALL_PROVIDERS.map((provider, i) => {
          const isNew = highlight.includes(provider);
          return (
            <span
              key={provider}
              className={cn("adv-provider", isNew && "adv-provider-new")}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {provider}
              {isNew ? <span className="adv-new-tag">new</span> : null}
            </span>
          );
        })}
      </div>
    </Stage>
  );
}

function TraceAnimation({
  rows,
}: {
  rows: { label: string; start: number; width: number }[];
}) {
  const tick = useTick(4000);
  return (
    <Stage>
      <div key={tick} className="flex w-full max-w-[520px] flex-col gap-2">
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-3"
          >
            <span
              className="truncate font-mono text-[11px] opacity-85"
              style={{ paddingLeft: i === 0 ? 0 : 12 }}
            >
              {row.label}
            </span>
            <div className="adv-track">
              <span
                className={cn("adv-bar", i === 0 && "adv-bar-root")}
                style={{
                  left: `${row.start}%`,
                  width: `${row.width}%`,
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

const MODE_FIELDS = [
  "model and cost",
  "tokens and latency",
  "user and session",
  "prompts and responses",
];
const MODES = [
  { name: "FULL", fields: 4 },
  { name: "USAGE", fields: 3 },
];

function ModesAnimation() {
  const tick = useTick(2200);
  const mode = MODES[tick % MODES.length];
  return (
    <Stage>
      <div className="flex w-full max-w-[420px] flex-col gap-4">
        <div className="adv-segmented">
          {MODES.map((m) => (
            <span
              key={m.name}
              className={cn(m.name === mode.name && "adv-segment-active")}
            >
              {m.name}
            </span>
          ))}
        </div>
        <ul className="flex flex-col gap-1.5">
          {MODE_FIELDS.map((field, i) => {
            const on = i < mode.fields;
            return (
              <li
                key={field}
                className={cn("adv-field", !on && "adv-field-off")}
              >
                {on ? (
                  <Check className="size-3.5" />
                ) : (
                  <X className="size-3.5" />
                )}
                {field}
              </li>
            );
          })}
        </ul>
      </div>
    </Stage>
  );
}

function HeadersAnimation({ headers }: { headers: [string, string][] }) {
  const tick = useTick(4500);
  return (
    <Stage>
      <div
        key={tick}
        className="grid w-full max-w-[540px] items-center gap-4 sm:grid-cols-[1.3fr_1fr]"
      >
        <div className="adv-terminal">
          <pre className="adv-terminal-body">
            {headers.map(([key, value], i) => (
              <div
                key={key}
                className="adv-slide-in"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <span className="adv-terminal-key">{key}</span>: {value}
              </div>
            ))}
          </pre>
        </div>
        <div className="adv-trace-card">
          <span className="text-[11px] font-medium opacity-70">Trace</span>
          <div className="flex flex-wrap gap-1.5">
            {headers.map(([key, value], i) => (
              <span
                key={key}
                className="adv-chip adv-pop"
                style={{ animationDelay: `${0.4 * headers.length + i * 0.2}s` }}
              >
                {value.split(",")[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

const CHART_BARS = [32, 48, 41, 63, 55, 78, 92];

function ChartAnimation() {
  const tick = useTick(4200);
  return (
    <Stage>
      <div key={tick} className="flex w-full max-w-[460px] flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] opacity-70">
            Total cost, last 7 days
          </span>
          <span className="adv-counter font-mono text-lg font-semibold">
            $1,284
          </span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {CHART_BARS.map((h, i) => (
            <span
              key={i}
              className="adv-column"
              style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <div className="flex gap-3 text-[11px] opacity-80">
          <span className="adv-legend adv-legend-a">jane@</span>
          <span className="adv-legend adv-legend-b">ci-release</span>
          <span className="adv-legend adv-legend-c">max@</span>
        </div>
      </div>
    </Stage>
  );
}

function AlertAnimation() {
  const tick = useTick(4500);
  return (
    <Stage>
      <div key={tick} className="relative w-full max-w-[460px]">
        <svg viewBox="0 0 300 120" className="w-full">
          <line
            x1="0"
            y1="40"
            x2="300"
            y2="40"
            className="adv-threshold"
            strokeDasharray="5 5"
          />
          <text x="4" y="34" className="adv-threshold-label">
            $500 / day
          </text>
          <polyline
            points="0,110 40,100 80,96 120,84 160,78 200,60 240,38 280,22 300,18"
            className="adv-line"
            pathLength={1}
          />
        </svg>
        <div className="adv-toast">
          <Bell className="adv-bell size-4" />
          Gateway spend above $500 today
        </div>
      </div>
    </Stage>
  );
}

const EXAMPLE_MODELS = [
  "openai-prod:large",
  "openai-prod:mini",
  "anthropic-prod:claude",
  "openrouter:experimental",
];

function TogglesAnimation() {
  const tick = useTick(1200);
  const states = EXAMPLE_MODELS.map(
    (_, i) => i === 0 || (tick + i * 2) % 6 < 4,
  );
  return (
    <Stage>
      <ul className="flex w-full max-w-[380px] flex-col gap-2">
        {EXAMPLE_MODELS.map((model, i) => (
          <li key={model} className="adv-field justify-between">
            <span className="font-mono text-[12px]">{model}</span>
            <span className={cn("adv-switch", states[i] && "adv-switch-on")}>
              <span />
            </span>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function PatternsAnimation({ pattern }: { pattern: string }) {
  const tick = useTick(80);
  const cycle = tick % 60;
  const typed = pattern.slice(0, Math.max(0, cycle - 4));
  const done = typed.length === pattern.length;
  const regex = new RegExp(
    "^" +
      pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") +
      "$",
    "i",
  );
  return (
    <Stage>
      <div className="flex w-full max-w-[380px] flex-col gap-3">
        <div className="adv-input font-mono text-[13px]">
          {typed}
          <span className="adv-cursor" />
        </div>
        <ul className="flex flex-col gap-1.5">
          {EXAMPLE_MODELS.map((model) => {
            const allowed = !done || regex.test(model);
            return (
              <li
                key={model}
                className={cn(
                  "adv-field",
                  done && (allowed ? "adv-field-match" : "adv-field-off"),
                )}
              >
                {done ? (
                  allowed ? (
                    <Check className="size-3.5" />
                  ) : (
                    <X className="size-3.5" />
                  )
                ) : (
                  <span className="size-3.5" />
                )}
                <span className="font-mono text-[12px]">{model}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Stage>
  );
}

function ChatAnimation({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const tick = useTick(6000);
  return (
    <Stage>
      <div key={tick} className="flex w-full max-w-[440px] flex-col gap-3">
        <div className="adv-bubble adv-bubble-user adv-pop">{question}</div>
        <div className="adv-bubble adv-bubble-typing">
          <span />
          <span />
          <span />
        </div>
        <div className="adv-bubble adv-bubble-halo">
          <span className="mb-1 block text-[10px] font-semibold opacity-70">
            Halo
          </span>
          {answer}
        </div>
      </div>
    </Stage>
  );
}

export function DoorAnimation({ spec }: { spec: DoorAnimationSpec }) {
  switch (spec.kind) {
    case "route":
      return <RouteAnimation from={spec.from} to={spec.to} />;
    case "terminal":
      return <TerminalAnimation lines={spec.lines} />;
    case "keys":
      return <KeysAnimation />;
    case "providers":
      return <ProvidersAnimation highlight={spec.highlight} />;
    case "trace":
      return <TraceAnimation rows={spec.rows} />;
    case "modes":
      return <ModesAnimation />;
    case "headers":
      return <HeadersAnimation headers={spec.headers} />;
    case "chart":
      return <ChartAnimation />;
    case "alert":
      return <AlertAnimation />;
    case "toggles":
      return <TogglesAnimation />;
    case "patterns":
      return <PatternsAnimation pattern={spec.pattern} />;
    case "chat":
      return <ChatAnimation question={spec.question} answer={spec.answer} />;
  }
}
