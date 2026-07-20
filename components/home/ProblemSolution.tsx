import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
import { cn } from "@/lib/utils";

import { HomeSection } from "./HomeSection";

const metrics = [
  { label: "Status", value: "200 OK" },
  { label: "Latency", value: "p95 1.4s" },
  { label: "Exceptions", value: "0" },
  { label: "Model confidence", value: "0.94" },
];

const loopSteps = [
  {
    label: "Observe",
    title: "Tracing & observability",
    description:
      "Capture every request as a structured trace with inputs, outputs, cost, latency, and tokens.",
  },
  {
    label: "Evaluate",
    title: "Evaluations & experiments",
    description:
      "Score quality live in production and offline. Run experiments against curated datasets.",
  },
  {
    label: "Improve",
    title: "Ship with confidence",
    description:
      "Act on the evidence, feed the change back into production, and start the loop again.",
  },
];

function TraceFailureCard() {
  return (
    <CornerBox className="min-h-[300px] overflow-hidden">
      <div className="border-b border-line-structure px-5 py-3 font-mono text-[11px] uppercase tracking-[0.02em] text-muted-magenta sm:px-6">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-muted-magenta align-middle" />
        Trace - Support agent
      </div>
      <div className="flex flex-col gap-4 p-5 font-mono text-[13px] leading-[1.6] sm:p-6 sm:text-[15px]">
        <div className="grid grid-cols-[96px_1fr] gap-3 text-text-secondary sm:grid-cols-[128px_1fr]">
          <span className="text-text-tertiary">user</span>
          <span className="text-text-primary">"Can I get a refund?"</span>
        </div>
        <div className="grid grid-cols-[96px_1fr] gap-3 text-muted-magenta sm:grid-cols-[128px_1fr]">
          <span>retrieval</span>
          <span className="underline decoration-muted-magenta underline-offset-4">
            policy_v1.pdf (stale)
          </span>
        </div>
        <div className="grid grid-cols-[96px_1fr] gap-3 text-muted-magenta sm:grid-cols-[128px_1fr]">
          <span>llm.answer</span>
          <span>"No refunds after 14 days."</span>
        </div>
        <div className="grid grid-cols-[96px_1fr] gap-3 text-text-tertiary sm:grid-cols-[128px_1fr]">
          <span>feedback</span>
          <span>wrong policy</span>
        </div>
        <div className="mt-2 border border-muted-magenta/25 bg-muted-magenta/10 px-4 py-3 text-[11px] uppercase tracking-[0.02em] text-muted-magenta">
          Eval flagged - enters loop
        </div>
      </div>
    </CornerBox>
  );
}

function HealthyMetricsCard() {
  return (
    <CornerBox className="flex min-h-[300px] flex-col overflow-hidden border-text-primary bg-text-primary text-surface-bg">
      <div className="flex items-center justify-between border-b border-surface-bg/15 px-5 py-4 sm:px-6">
        <h3 className="font-sans text-[20px] font-semibold leading-none">
          Support Agent
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.04em] text-surface-bg/70">
          Live
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center px-5 py-4 sm:px-6">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center gap-4 border-b border-surface-bg/10 py-3 last:border-b-0"
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-green"
              aria-hidden
            />
            <span className="min-w-0 flex-1 text-[15px] font-medium text-surface-bg">
              {metric.label}
            </span>
            <span className="font-mono text-[12px] text-muted-green">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-surface-bg/15 bg-muted-magenta/25 px-5 py-4 text-[20px] font-semibold sm:px-6">
        <span className="mr-3 font-mono text-[12px] text-surface-bg/70">
          -&gt;
        </span>
        Still <TextHighlight className="text-text-primary">wrong</TextHighlight>
      </div>
    </CornerBox>
  );
}

function LoopStepCard({
  step,
  index,
}: {
  step: (typeof loopSteps)[number];
  index: number;
}) {
  return (
    <div className="relative">
      <CornerBox
        className={cn(
          "flex min-h-[220px] flex-col gap-4 p-5 sm:p-6",
          index === loopSteps.length - 1 &&
            "border-text-primary bg-primary/5 shadow-[inset_0_0_0_1px_var(--text-primary)]",
        )}
      >
        <Text
          size="xs"
          className="text-left uppercase no-underline decoration-transparent"
        >
          {step.label}
        </Text>
        <div className="flex flex-col gap-3">
          <h3 className="font-analog text-[28px] font-medium leading-[1.05] text-text-primary sm:text-[32px]">
            {step.title}
          </h3>
          <Text className="text-left text-text-secondary">
            {step.description}
          </Text>
        </div>
      </CornerBox>
      {index < loopSteps.length - 1 && (
        <div
          className="absolute left-full top-1/2 z-10 hidden -translate-y-1/2 px-3 font-mono text-[22px] text-text-tertiary xl:block"
          aria-hidden
        >
          -&gt;
        </div>
      )}
    </div>
  );
}

export function ProblemSolution() {
  return (
    <HomeSection
      id="problem-solution"
      className="pt-[72px] md:!max-w-[960px] xl:!max-w-[1180px]"
    >
      <div className="flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-4">
          <Text
            size="xs"
            className="text-left uppercase no-underline decoration-transparent"
          >
            Problem
          </Text>
          <Heading size="large" className="max-w-[900px] text-left">
            Agents can fail while system metrics look green.
          </Heading>
          <Text className="max-w-[720px] text-left text-text-secondary">
            Every infra signal says healthy{" "}
            <span className="italic">
              (200 OK, normal latency, no exceptions),
            </span>{" "}
            yet the answer is wrong.
          </Text>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
          <TraceFailureCard />
          <HealthyMetricsCard />
        </div>

        <div className="flex flex-col gap-4 pt-4 sm:pt-8">
          <Text
            size="xs"
            className="text-left uppercase no-underline decoration-transparent"
          >
            Solution
          </Text>
          <Heading size="large" className="max-w-[980px] text-left">
            Continuously observe, evaluate, and improve your AI system.
          </Heading>
          <Text className="max-w-[760px] text-left text-text-secondary">
            Langfuse connects production traces, evaluations, experiments, and
            human feedback in one loop so teams can see where agents fail and
            ship fixes with evidence.
          </Text>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {loopSteps.map((step, index) => (
            <LoopStepCard key={step.label} step={step} index={index} />
          ))}
        </div>

        <Text
          size="xs"
          className="text-left italic no-underline decoration-transparent"
        >
          continuously - production traces -&gt; datasets -&gt; experiments
        </Text>
      </div>
    </HomeSection>
  );
}
