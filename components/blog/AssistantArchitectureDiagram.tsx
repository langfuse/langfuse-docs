"use client";

import { useEffect, useRef, useState } from "react";
import { HorizontalArrow, VerticalArrow } from "./diagram-primitives";
import { cn } from "@/lib/utils";

import { assistantArchitectureSteps as steps } from "@/lib/assistant-architecture-steps";

const FLOW_DURATION_MS = {
  start: 1187,
  save: 950,
  enqueue: 950,
  pickup: 1187,
  "model-request": 1978,
  "model-response": 2435,
  "mcp-request": 1978,
  "mcp-response": 1978,
  "sandbox-start": 1978,
  "sandbox-request": 2783,
  "sandbox-response": 1978,
  "sandbox-suspend": 1978,
} satisfies Record<(typeof steps)[number]["flow"], number>;

function Box({
  children,
  optional,
  active,
}: {
  children: React.ReactNode;
  optional?: boolean;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-w-0 items-center justify-center border border-line-structure px-2 py-1.5 text-center font-medium text-text-primary transition-opacity motion-reduce:transition-none",
        optional ? "border-dashed bg-surface-bg/50" : "bg-surface-bg",
        active ? "halo-active-box" : "halo-inactive",
      )}
    >
      {children}
    </div>
  );
}

function Connection({
  children,
  direction = "right",
  dashed,
  responseLabel,
  active,
  responseActive,
  continuous,
}: Pick<
  React.ComponentProps<typeof HorizontalArrow>,
  "direction" | "dashed"
> & {
  children: React.ReactNode;
  responseLabel?: string;
  active: boolean;
  responseActive?: boolean;
  continuous?: boolean;
}) {
  return (
    <div className="flex w-full flex-col justify-center gap-1 py-1">
      <div
        className={cn(
          "px-1 text-center leading-snug",
          !active && "halo-inactive",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "relative",
          active ? "halo-active-line" : "halo-inactive",
        )}
      >
        <HorizontalArrow direction={direction} dashed={dashed} />
        {active && (
          <span
            aria-hidden="true"
            className={cn(
              "halo-packet",
              !continuous && "halo-packet-once",
              direction === "left" && "halo-packet-reverse",
            )}
          />
        )}
      </div>
      {responseLabel && (
        <>
          <div
            className={cn(
              "relative",
              responseActive ? "halo-active-line" : "halo-inactive",
            )}
          >
            <HorizontalArrow direction="left" />
            {responseActive && (
              <span
                aria-hidden="true"
                className="halo-packet halo-packet-reverse halo-packet-once"
              />
            )}
          </div>
          <div
            className={cn(
              "px-1 text-center leading-snug",
              !responseActive && "halo-inactive",
            )}
          >
            {responseLabel}
          </div>
        </>
      )}
    </div>
  );
}

export function AssistantArchitectureDiagram() {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const stepTimer = useRef({ step: -1, remaining: 0 });
  const overview = step === -1;
  const currentStep = overview ? undefined : steps[step];
  const executing = currentStep?.executing === true;
  const flow = currentStep?.flow;
  const modelAndToolsActive = executing || flow === "sandbox-suspend";
  const runManagementActive = !overview && !modelAndToolsActive;
  const stepDuration = currentStep
    ? Math.max(
        FLOW_DURATION_MS[currentStep.flow],
        2174,
        522 +
          `${currentStep.title} ${currentStep.description}`.trim().split(/\s+/)
            .length *
            209,
      )
    : 0;
  const activeNodes = new Set<string>(currentStep?.nodes);
  if (executing) {
    activeNodes.add("worker");
    activeNodes.add("postgres");
    activeNodes.add("web");
    activeNodes.add("browser");
  }
  const playbackLabel = (() => {
    if (playing) return "Pause";
    if (overview) return "Play example";
    return "Resume";
  })();

  useEffect(() => {
    if (stepTimer.current.step !== step) {
      stepTimer.current = { step, remaining: stepDuration };
    }
    if (!playing) return;
    const startedAt = performance.now();
    const timer = window.setTimeout(() => {
      if (step === steps.length - 1) {
        setPlaying(false);
        setStep(-1);
        return;
      }
      setStep(step + 1);
    }, stepTimer.current.remaining);
    return () => {
      window.clearTimeout(timer);
      stepTimer.current.remaining = Math.max(
        0,
        stepTimer.current.remaining - (performance.now() - startedAt),
      );
    };
  }, [playing, step, stepDuration]);

  return (
    <figure
      aria-label="Halo high-level architecture, from browser through run management to model and tools"
      className="halo-architecture not-prose"
      data-playing={playing}
      data-overview={overview}
      style={
        { "--halo-step-duration": `${stepDuration}ms` } as React.CSSProperties
      }
    >
      <div
        className="overflow-x-auto pb-2"
        role="region"
        aria-label="Architecture diagram"
        tabIndex={0}
      >
        <div className="flex min-w-[560px] flex-col gap-4 text-xs leading-snug text-text-secondary">
          <div
            className={cn(
              "border border-dashed border-line-divider-dash p-2",
              modelAndToolsActive && "halo-panel-muted",
            )}
          >
            <h3 className="mb-2 font-medium text-text-tertiary">
              Run management
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1fr 1.2fr 1fr",
                gridTemplateRows: "auto 2.5rem auto",
              }}
            >
              <Box active={activeNodes.has("browser")}>Browser</Box>
              <div className="flex flex-col gap-1 py-1">
                <Connection active={flow === "start"}>Start run</Connection>
                <Connection
                  active={executing}
                  direction="left"
                  dashed
                  continuous
                >
                  SSE
                </Connection>
              </div>
              <Box active={activeNodes.has("web")}>Langfuse web</Box>
              <div className="flex flex-col justify-center gap-1">
                <Connection active={flow === "save"}>Save run</Connection>
                <Connection
                  active={executing}
                  direction="left"
                  dashed
                  continuous
                >
                  New events
                </Connection>
              </div>
              <Box active={activeNodes.has("postgres")}>
                <div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    Postgres
                  </div>
                  <div className="mt-1 font-normal text-text-secondary">
                    Run state + events
                  </div>
                </div>
              </Box>

              <div
                className={cn(
                  "relative",
                  flow !== "enqueue" && "halo-inactive",
                )}
                style={{ gridColumn: 3, gridRow: 2 }}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-1/2",
                    flow === "enqueue" && "halo-active-line",
                  )}
                >
                  <VerticalArrow />
                  {flow === "enqueue" && (
                    <span className="halo-packet halo-packet-down halo-packet-once" />
                  )}
                </div>
                <div className="absolute right-[calc(50%+0.75rem)] top-1/2 w-24 -translate-y-1/2 text-right">
                  Enqueue run ID
                </div>
              </div>
              <div
                className={cn("relative", !executing && "halo-inactive")}
                style={{ gridColumn: 5, gridRow: 2 }}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-1/2",
                    executing && "halo-active-line",
                  )}
                >
                  <VerticalArrow direction="up" />
                  {executing && <span className="halo-packet halo-packet-up" />}
                </div>
                <div className="absolute right-[calc(50%+0.75rem)] top-1/2 -translate-y-1/2 whitespace-nowrap text-right">
                  Save progress and results
                </div>
              </div>

              <div style={{ gridColumn: 3, gridRow: 3 }}>
                <Box active={activeNodes.has("queue")}>BullMQ</Box>
              </div>
              <div
                className="flex flex-col justify-center"
                style={{ gridColumn: 4, gridRow: 3 }}
              >
                <Connection active={flow === "pickup"}>Pick up run</Connection>
              </div>
              <div style={{ gridColumn: 5, gridRow: 3 }}>
                <Box active={activeNodes.has("worker")}>
                  <div>
                    Langfuse worker
                    <div className="mt-1 font-normal text-text-secondary">
                      Agent loop
                    </div>
                  </div>
                </Box>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "border border-dashed border-line-divider-dash p-2",
              runManagementActive && "halo-panel-muted",
            )}
          >
            <h3 className="mb-2 font-medium text-text-tertiary">
              Model and tools
            </h3>
            <div
              className="gap-y-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr 1.5fr",
              }}
            >
              <div className="min-w-0" style={{ gridRow: "span 3" }}>
                <Box active={activeNodes.has("worker")}>
                  <div>
                    Langfuse worker
                    <div className="mt-1 font-normal text-text-secondary">
                      Agent loop
                    </div>
                  </div>
                </Box>
              </div>
              <Connection
                active={flow === "model-request"}
                responseActive={flow === "model-response"}
                responseLabel="Model responses"
              >
                Model calls
              </Connection>
              <Box active={activeNodes.has("model")}>Claude on Bedrock</Box>
              <Connection
                active={flow === "mcp-request"}
                responseActive={flow === "mcp-response"}
                responseLabel="Tool results"
              >
                MCP request
              </Connection>
              <Box active={activeNodes.has("mcp")}>
                <div>
                  Langfuse MCP server
                  <div className="mt-1 font-normal text-text-secondary">
                    Project-scoped access
                  </div>
                </div>
              </Box>
              <Connection
                active={flow === "sandbox-start" || flow === "sandbox-request"}
                responseActive={flow === "sandbox-response"}
                responseLabel="Files and script output"
              >
                {flow === "sandbox-start" ? (
                  "Start sandbox on first use"
                ) : (
                  <span className="font-mono">read, write, edit, bash</span>
                )}
              </Connection>
              <Box optional active={activeNodes.has("sandbox")}>
                <div>
                  Lambda MicroVM{" "}
                  <span className="text-[10px] font-normal text-text-tertiary">
                    (optional)
                  </span>
                  <div className="mt-1 font-normal text-text-secondary">
                    No egress by default
                  </div>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 border border-line-structure bg-surface-bg p-4">
        <div className="mb-3">
          <nav aria-label="Example run timeline" className="mb-1 flex gap-1">
            {steps.map((item, index) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title}
                aria-current={index === step ? "step" : undefined}
                title={item.title}
                className="group flex h-6 min-w-0 flex-1 cursor-pointer items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-links"
                onClick={() => {
                  setStep(index);
                  if (overview) setPlaying(true);
                }}
              >
                <span className="h-1 w-full overflow-hidden bg-primary/10 group-hover:bg-text-links/25">
                  {index <= step && (
                    <span
                      key={step}
                      className={cn(
                        "block h-full origin-left bg-text-links",
                        index === step && "halo-step-progress",
                      )}
                      style={
                        index === step
                          ? { animationDuration: `${stepDuration}ms` }
                          : undefined
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs text-text-secondary">
              Example run{!overview && ` · ${steps[step].title}`}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="border border-line-structure px-3 py-1.5 text-xs text-text-primary"
                onClick={() => {
                  if (overview) setStep(0);
                  setPlaying(!playing);
                }}
              >
                {playbackLabel}
              </button>
              <button
                type="button"
                disabled={overview}
                className="border border-line-structure px-3 py-1.5 text-xs text-text-primary disabled:opacity-40"
                onClick={() => {
                  setPlaying(false);
                  setStep(-1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          <p
            title={overview ? undefined : steps[step].description}
            className={cn(
              "m-0 text-sm text-text-secondary",
              !overview && "border-l-2 border-text-links/30 pl-3 italic",
            )}
          >
            {overview
              ? "See how a run moves through the architecture."
              : steps[step].description}
          </p>
        </div>
      </div>
      <style jsx global>{`
        .halo-architecture .halo-active-box {
          border-color: var(--text-links);
          background: color-mix(in srgb, var(--text-links) 7%, var(--surface-bg));
        }
        .halo-architecture .halo-active-line > [aria-hidden="true"] { border-color: var(--text-links); }
        .halo-architecture .halo-active-line svg { color: var(--text-links); }
        .halo-architecture .halo-panel-muted { opacity: 0.35; }
        .halo-architecture[data-overview="false"] .halo-panel-muted .halo-inactive { opacity: 1; }
        .halo-architecture .halo-step-progress {
          animation: halo-step-fill linear forwards;
          animation-play-state: paused;
        }
        .halo-architecture[data-playing="true"] .halo-step-progress { animation-play-state: running; }
        @keyframes halo-step-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .halo-architecture[data-overview="false"] .halo-inactive { opacity: 0.4; }
        .halo-architecture .halo-packet {
          position: absolute;
          left: 0;
          top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-links);
          animation: halo-travel-right 0.7s linear infinite;
          animation-play-state: paused;
        }
        .halo-architecture[data-playing="true"] .halo-packet { animation-play-state: running; }
          .halo-architecture .halo-packet-once { animation-duration: var(--halo-step-duration); animation-iteration-count: 1; animation-fill-mode: forwards; }
        .halo-architecture .halo-packet-reverse { animation-name: halo-travel-left; }
        .halo-architecture .halo-packet-down { left: -3px; top: 0; animation-name: halo-travel-down; }
        .halo-architecture .halo-packet-up { left: -3px; top: 0; animation-name: halo-travel-up; }
        @keyframes halo-travel-right { from { left: 0; } to { left: calc(100% - 6px); } }
        @keyframes halo-travel-left { from { left: calc(100% - 6px); } to { left: 0; } }
        @keyframes halo-travel-down { from { top: 0; } to { top: calc(100% - 6px); } }
        @keyframes halo-travel-up { from { top: calc(100% - 6px); } to { top: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .halo-architecture .halo-packet { animation: none; }
          .halo-architecture .halo-step-progress { animation: none; }
        }
      `}</style>
    </figure>
  );
}
