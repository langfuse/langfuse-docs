import {
  ArrowRight,
  Bot,
  CircleGauge,
  ListFilter,
  ScanSearch,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";

const performanceStats = [
  {
    value: "10×+",
    label: "faster dashboards",
    detail: "for large projects and longer time ranges",
  },
  {
    value: "ms",
    label: "initial table loads",
    detail: "instead of seconds on large datasets",
  },
  {
    value: "seconds",
    label: "observation-level evals",
    detail: "without a trace lookup for every evaluation",
  },
];

const operations = [
  {
    type: "SPAN",
    name: "agent.run",
    detail: "3.1s",
    icon: Bot,
    active: false,
  },
  {
    type: "TOOL",
    name: "search-docs",
    detail: "0.4s",
    icon: Wrench,
    active: false,
  },
  {
    type: "GENERATION",
    name: "answer",
    detail: "2.6s",
    icon: Sparkles,
    active: true,
  },
];

const workflows = [
  {
    icon: ScanSearch,
    eyebrow: "Debug",
    title: "Find the failing step",
    description:
      "Filter for one tool call, sub-agent, or model invocation across every trace.",
  },
  {
    icon: CircleGauge,
    eyebrow: "Optimize",
    title: "Compare cost and latency",
    description:
      "Query generations directly by model, name, latency, cost, user, or session.",
  },
  {
    icon: ListFilter,
    eyebrow: "Evaluate",
    title: "Score the right output",
    description:
      "Run evaluators on the observation that contains the relevant input and output.",
  },
];

export function V4LandingHero() {
  return (
    <section className="not-prose mb-20">
      <CornerBox className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-structure bg-stripe-pattern px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary">
            <span className="size-2 rounded-full bg-muted-green" />
            Langfuse v4
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            Live on Langfuse Cloud
          </span>
        </div>

        <div className="grid items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1.08fr_0.92fr] md:py-20">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
              Observability for agentic systems
            </p>
            <h1 className="mb-5 max-w-[12ch] text-[clamp(2.75rem,7vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-text-primary">
              Faster by design. Built for agents.
            </h1>
            <p className="mb-7 max-w-[58ch] text-base leading-7 text-text-secondary">
              Query every LLM call, tool execution, and agent step directly.
              Explore, evaluate, and aggregate at scale without stitching
              together entire traces.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                href="/docs/observability/get-started"
                size="default"
                icon={<ArrowRight />}
                iconPosition="end"
              >
                Start with v4
              </Button>
              <Button
                href="/faq/all/upgrade-to-langfuse-v4"
                variant="secondary"
                size="default"
              >
                Upgrade guide
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[430px]">
            <div
              aria-hidden
              className="absolute -inset-4 border border-dashed border-line-structure"
            />
            <CornerBox
              className="relative overflow-hidden bg-surface-bg shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
              aria-label="Filter observations to find a slow generation"
            >
              <div className="flex items-center justify-between border-b border-line-structure px-4 py-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-secondary">
                  Observations
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  trace_id = abc123
                </span>
              </div>

              <div className="border-b border-line-structure bg-surface-1 p-3">
                <div className="flex items-center gap-2 border border-line-structure bg-surface-bg px-3 py-2 font-mono text-[10px] text-text-secondary">
                  <ScanSearch className="size-3.5 shrink-0" />
                  <span className="truncate">
                    type = generation · latency &gt; 2s
                  </span>
                  <span className="ml-auto shrink-0 text-text-tertiary">
                    1 match
                  </span>
                </div>
              </div>

              <div className="p-2">
                {operations.map((operation) => {
                  const Icon = operation.icon;
                  return (
                    <div
                      key={operation.name}
                      className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line-structure px-3 py-3 last:border-b-0 ${
                        operation.active ? "bg-muted-green/30" : ""
                      }`}
                    >
                      <div className="flex size-7 items-center justify-center border border-line-structure bg-surface-bg">
                        <Icon className="size-3.5 text-text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-text-primary">
                          {operation.name}
                        </div>
                        <div className="font-mono text-[9px] tracking-[0.06em] text-text-tertiary">
                          {operation.type}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-text-secondary">
                        {operation.detail}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CornerBox>
          </div>
        </div>
      </CornerBox>

      <div className="-mt-px grid sm:grid-cols-3">
        {performanceStats.map((stat, index) => (
          <CornerBox
            key={stat.value}
            corners={{
              tl: index === 0,
              tr: index === performanceStats.length - 1,
            }}
            className={`px-5 py-5 ${
              index > 0 ? "-mt-px sm:mt-0 sm:-ml-px" : ""
            }`}
          >
            <div className="mb-1 font-mono text-2xl tracking-[-0.04em] text-text-primary">
              {stat.value}
            </div>
            <div className="text-[13px] font-medium text-text-secondary">
              {stat.label}
            </div>
            <div className="mt-1 text-[12px] leading-5 text-text-tertiary">
              {stat.detail}
            </div>
          </CornerBox>
        ))}
      </div>
    </section>
  );
}

export function V4WorkflowGrid() {
  return (
    <div className="not-prose my-8 grid gap-3 md:grid-cols-3">
      {workflows.map((workflow) => {
        const Icon = workflow.icon;
        return (
          <CornerBox
            key={workflow.title}
            className="flex h-full flex-col p-5"
            hoverStripes
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex size-8 items-center justify-center border border-line-structure bg-surface-1">
                <Icon className="size-4 text-text-secondary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                {workflow.eyebrow}
              </span>
            </div>
            <h3 className="mb-2 text-base font-medium text-text-primary">
              {workflow.title}
            </h3>
            <p className="m-0 text-[13px] leading-6 text-text-secondary">
              {workflow.description}
            </p>
          </CornerBox>
        );
      })}
    </div>
  );
}
