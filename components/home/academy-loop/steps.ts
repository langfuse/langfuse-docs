// Step names, phases, and one-liners mirror /academy/ai-engineering-loop.
// Keep them in sync with `components/academy/LoopDiagram.tsx`.

export type LoopStepId =
  | "trace"
  | "monitor"
  | "dataset"
  | "experiment"
  | "eval";
export type LoopPhaseId = "production" | "development";

export type LoopStep = {
  id: LoopStepId;
  phase: LoopPhaseId;
  title: string;
  summary: string;
  meta: string[];
  href: string;
};

export const LOOP_PHASES: Record<
  LoopPhaseId,
  { label: string; loop: string; title: string; href: string }
> = {
  production: {
    label: "Production",
    loop: "Outer loop",
    title: "Understand what's happening in production",
    href: "/academy/ai-engineering-loop#trace",
  },
  development: {
    label: "Development",
    loop: "Inner loop",
    title: "Improve systematically during development",
    href: "/academy/ai-engineering-loop#build-datasets",
  },
};

export const LOOP_STEPS: Record<LoopStepId, LoopStep> = {
  trace: {
    id: "trace",
    phase: "production",
    title: "Trace",
    summary: "Capture the full path of every request.",
    meta: ["traces", "sessions", "agents", "prompts"],
    href: "/academy/tracing",
  },
  monitor: {
    id: "monitor",
    phase: "production",
    title: "Monitor",
    summary: "Surface the traces that deserve attention.",
    meta: ["dashboards", "LLM-as-judge", "feedback"],
    href: "/academy/monitoring",
  },
  dataset: {
    id: "dataset",
    phase: "development",
    title: "Build datasets",
    summary: "Turn real and expected scenarios into test cases.",
    meta: ["datasets", "features-as-tests"],
    href: "/academy/datasets",
  },
  experiment: {
    id: "experiment",
    phase: "development",
    title: "Experiment",
    summary: "Change one variable and compare against a baseline.",
    meta: ["prompts", "models", "code variants"],
    href: "/academy/experiments",
  },
  eval: {
    id: "eval",
    phase: "development",
    title: "Evaluate",
    summary: "Decide whether results are good enough to ship.",
    meta: ["judges", "custom evals", "annotation"],
    href: "/academy/evaluate",
  },
};

export const LOOP_ORDER: LoopStepId[] = [
  "trace",
  "monitor",
  "dataset",
  "experiment",
  "eval",
];

/** Index into LOOP_ORDER that advances on an interval, for the "active" pulse. */
export const LOOP_TICK_MS = 1800;
