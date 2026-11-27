"use client";

import { useEffect, useId, useState } from "react";
import { Bell, Check, KeyRound, Lock, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProviderMark,
  type ProviderMarkName,
} from "@/components/home/AiGatewayProviderMarks";
import {
  ALL_PROVIDERS,
  type DoorAnimation as DoorAnimationSpec,
  type GuardrailTemplate,
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

const FLOW_CLIENTS = ["Claude Code", "Codex", "OpenCode", "Your apps"];
const FLOW_PROVIDERS: { label: string; mark: ProviderMarkName }[] = [
  { label: "Anthropic", mark: "anthropic" },
  { label: "OpenAI", mark: "openai" },
  { label: "Google AI", mark: "gemini" },
  { label: "Bedrock", mark: "aws" },
  { label: "Azure", mark: "azure" },
];
const FLOW_HUB = { x: 216, y: 122 };
const FLOW_CLIENT_ROWS = [47, 97, 147, 197];
const FLOW_PROVIDER_ROWS = [22, 62, 102, 142, 182, 222];
const flowIn = (y: number) =>
  `M114 ${y}C160 ${y} 158 ${FLOW_HUB.y} 194 ${FLOW_HUB.y}`;
const flowOut = (y: number) =>
  `M238 ${FLOW_HUB.y}C282 ${FLOW_HUB.y} 280 ${y} 318 ${y}`;

function FlowChip({
  x,
  y,
  w,
  label,
  mark,
  hit,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  mark?: ProviderMarkName;
  hit?: boolean;
}) {
  const h = 28;
  return (
    <g>
      <rect
        x={x}
        y={y - h / 2}
        width={w}
        height={h}
        rx={6}
        fill="var(--surface-bg)"
        stroke="var(--line-structure)"
        className={hit ? "adv-flow-hit" : undefined}
      />
      {mark ? <ProviderMark name={mark} x={x + 9} y={y - 7} size={14} /> : null}
      <text
        x={x + (mark ? 30 : 11)}
        y={y}
        dominantBaseline="central"
        fontSize={13}
        className="font-mono"
        fill="var(--text-secondary)"
      >
        {label}
      </text>
    </g>
  );
}

/** Coding agents and apps call the gateway, which fans out to providers. */
function GatewayAnimation() {
  const tick = useTick(2400);
  const gridId = `adv-flow-grid-${useId().replace(/[^\w-]/g, "")}`;
  const client = tick % FLOW_CLIENT_ROWS.length;
  const provider = tick % FLOW_PROVIDERS.length;
  const moreY = FLOW_PROVIDER_ROWS[FLOW_PROVIDERS.length];

  return (
    <Stage className="p-2 sm:p-4">
      <svg
        viewBox="0 0 440 244"
        className="h-auto w-full max-w-[520px]"
        role="img"
        aria-label="Claude Code, Codex, OpenCode, and your apps send requests through the Langfuse AI Gateway to Anthropic, OpenAI, Google AI, Amazon Bedrock, Microsoft Azure, and more providers. Every call becomes a trace."
      >
        <defs>
          <pattern
            id={gridId}
            width={16}
            height={16}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1} cy={1} r={0.8} fill="var(--line-structure)" />
          </pattern>
        </defs>
        <rect width={440} height={244} fill={`url(#${gridId})`} />

        {FLOW_CLIENT_ROWS.map((y, i) => (
          <g key={y}>
            <path
              d={flowIn(y)}
              fill="none"
              stroke="var(--text-disabled)"
              strokeWidth={1.25}
            />
            <path
              d={flowIn(y)}
              pathLength={100}
              className="adv-flow-pulse adv-flow-ambient"
              style={{ animationDelay: `${-0.3 - i * 0.7}s` }}
            />
          </g>
        ))}
        {FLOW_PROVIDER_ROWS.map((y, i) => (
          <g key={y}>
            <path
              d={flowOut(y)}
              fill="none"
              stroke="var(--text-disabled)"
              strokeWidth={1.25}
              strokeDasharray="3 4"
              opacity={y === moreY ? 0.6 : 1}
            />
            <path
              d={flowOut(y)}
              pathLength={100}
              className="adv-flow-pulse adv-flow-ambient"
              style={{ animationDelay: `${-1.1 - i * 0.47}s` }}
            />
          </g>
        ))}

        <g key={`focus-${tick}`}>
          <path
            d={flowIn(FLOW_CLIENT_ROWS[client])}
            pathLength={100}
            className="adv-flow-pulse adv-flow-focus"
          />
          <path
            d={flowOut(FLOW_PROVIDER_ROWS[provider])}
            pathLength={100}
            className="adv-flow-pulse adv-flow-focus adv-flow-focus-late"
          />
        </g>

        {FLOW_CLIENTS.map((label, i) => (
          <FlowChip
            key={label}
            x={2}
            y={FLOW_CLIENT_ROWS[i]}
            w={112}
            label={label}
          />
        ))}
        {FLOW_PROVIDERS.map((p, i) => (
          <FlowChip
            key={`${p.label}-${i === provider ? tick : "idle"}`}
            x={318}
            y={FLOW_PROVIDER_ROWS[i]}
            w={120}
            label={p.label}
            mark={p.mark}
            hit={i === provider}
          />
        ))}
        <g>
          <circle
            cx={330}
            cy={moreY}
            r={12}
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
          />
          <ProviderMark name="openrouter" x={323} y={moreY - 7} size={14} />
          <circle
            cx={351}
            cy={moreY}
            r={12}
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
          />
          <path
            d={`M351 ${moreY - 5.5}L357 ${moreY + 4.5}H345Z`}
            fill="var(--text-tertiary)"
          />
          <text
            x={371}
            y={moreY}
            dominantBaseline="central"
            fontSize={12}
            className="font-mono"
            fill="var(--text-tertiary)"
          >
            and more
          </text>
        </g>

        <rect
          x={FLOW_HUB.x - 26}
          y={FLOW_HUB.y - 26}
          width={52}
          height={52}
          rx={13}
          fill="none"
          stroke="var(--line-cta)"
          className="adv-flow-ring"
        />
        <rect
          x={FLOW_HUB.x - 22}
          y={FLOW_HUB.y - 22}
          width={44}
          height={44}
          rx={10}
          fill="var(--surface-bg)"
          stroke="var(--line-structure)"
        />
        <image
          href="/langfuse-icon.svg"
          x={FLOW_HUB.x - 14}
          y={FLOW_HUB.y - 14}
          width={28}
          height={28}
        />
        <g key={`trace-${tick}`} className="adv-flow-trace">
          <rect
            x={FLOW_HUB.x - 28}
            y={FLOW_HUB.y + 30}
            width={56}
            height={18}
            rx={9}
            fill="var(--adv-mint)"
          />
          <text
            x={FLOW_HUB.x}
            y={FLOW_HUB.y + 39}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10}
            fontWeight={600}
            fill="#0b1626"
          >
            +1 trace
          </text>
        </g>
      </svg>
    </Stage>
  );
}

const GUARDRAIL_TEMPLATES: {
  id: GuardrailTemplate;
  name: string;
  pill: [string, string];
}[] = [
  { id: "pii", name: "PII", pill: ["email", "dana@example.com"] },
  {
    id: "secrets",
    name: "Secrets and API keys",
    pill: ["openai_key", "sk-proj-4f9a…"],
  },
  {
    id: "injection",
    name: "Prompt injection",
    pill: ["heuristic", "Ignore previous instructions"],
  },
  { id: "keyword", name: "Keyword list", pill: ["keyword", "Falcon"] },
  { id: "regex", name: "Custom regex", pill: ["regex", "CUST-\\d{6}"] },
];

function GuardrailPill({
  pill,
  compact,
}: {
  pill: [string, string];
  compact?: boolean;
}) {
  return (
    <span className="adv-guard-pill font-mono">
      {compact ? null : <span className="adv-guard-pill-key">{pill[0]}:</span>}
      <span className="adv-guard-pill-value">{pill[1]}</span>
    </span>
  );
}

/** One guardrail template catches a match while the others wait their turn. */
function GuardrailAnimation({
  active,
  action,
  prompt,
  match,
  label = "[REDACTED]",
}: {
  active: GuardrailTemplate;
  action: "redact" | "block";
  prompt: string;
  match: string;
  label?: string;
}) {
  const phase = useTick(1100) % 4;
  const template = GUARDRAIL_TEMPLATES.find((t) => t.id === active)!;
  const others = GUARDRAIL_TEMPLATES.filter((t) => t.id !== active);
  const [before, after] = prompt.split(match);
  const caught = phase >= 2;
  const matchState = caught
    ? action === "redact"
      ? "redacted"
      : "blocked"
    : phase === 1
      ? "flagged"
      : "idle";

  return (
    <Stage className="p-3 sm:p-4">
      <div className="flex w-full max-w-[520px] flex-col gap-2.5">
        <div className="adv-guard-card adv-guard-active">
          <div className="adv-guard-preview">
            <GuardrailPill pill={template.pill} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold">{template.name}</span>
            <span className="adv-guard-live">Live</span>
          </div>
          <div
            className="adv-guard-prompt font-mono"
            data-blocked={caught && action === "block"}
          >
            {before}
            <span className="adv-guard-match" data-state={matchState}>
              {caught && action === "redact" ? label : match}
            </span>
            {after}
          </div>
          <div className="adv-guard-result" data-visible={caught}>
            {action === "redact" ? (
              "Redacted before the provider sees it"
            ) : (
              <>
                <span className="font-mono">400 guardrail_blocked</span>: never
                reaches the provider
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {others.map((t) => (
            <div key={t.id} className="adv-guard-card adv-guard-teased">
              <div className="adv-guard-preview">
                <GuardrailPill pill={t.pill} compact />
              </div>
              <span className="truncate text-[11px] font-medium">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

const BENCHMARK_RUNTIMES = ["Rust", "Node.js", "Python"];

/** Rust vs. Node.js vs. Python, alternating between throughput and latency. */
function BenchmarkAnimation({
  metrics,
}: {
  metrics: { label: string; unit: string; values: number[] }[];
}) {
  const tick = useTick(3200);
  const metric = metrics[tick % metrics.length];
  const max = Math.max(...metric.values);

  return (
    <Stage>
      <div className="flex w-full max-w-[440px] flex-col gap-3">
        <span
          key={`label-${tick}`}
          className="adv-slide-in text-[12px] font-medium text-text-secondary"
        >
          {metric.label}
        </span>
        {BENCHMARK_RUNTIMES.map((runtime, i) => {
          const value = metric.values[i];
          return (
            <div
              key={runtime}
              className="grid grid-cols-[64px_1fr_72px] items-center gap-3 text-[12px]"
            >
              <span className={cn("font-mono", i === 0 && "font-semibold")}>
                {runtime}
              </span>
              <div className="adv-bench-track">
                <div
                  key={`bar-${tick}`}
                  className={cn("adv-bench-bar", i === 0 && "is-ours")}
                  style={{ width: `${Math.max((value / max) * 100, 1.5)}%` }}
                />
              </div>
              <span className="text-right font-mono tabular-nums">
                {value.toLocaleString("en-US")}
                {metric.unit}
              </span>
            </div>
          );
        })}
        <span className="text-[11px] text-text-tertiary">
          Same workload, 2 vCPUs and 4 GiB each
        </span>
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
    case "gateway":
      return <GatewayAnimation />;
    case "guardrail":
      return (
        <GuardrailAnimation
          active={spec.active}
          action={spec.action}
          prompt={spec.prompt}
          match={spec.match}
          label={spec.label}
        />
      );
    case "benchmark":
      return <BenchmarkAnimation metrics={spec.metrics} />;
  }
}
