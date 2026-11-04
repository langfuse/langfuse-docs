// Step names and phases mirror /academy/ai-engineering-loop.
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
  meta: string[];
  href: string;
};

export const LOOP_PHASES: Record<LoopPhaseId, { label: string }> = {
  production: {
    label: "Production",
  },
  development: {
    label: "Development",
  },
};

export const LOOP_STEPS: Record<LoopStepId, LoopStep> = {
  trace: {
    id: "trace",
    phase: "production",
    title: "Trace",
    meta: ["traces", "sessions", "agents", "prompts"],
    href: "/academy/tracing",
  },
  monitor: {
    id: "monitor",
    phase: "production",
    title: "Monitor",
    meta: ["dashboards", "LLM-as-judge", "feedback"],
    href: "/academy/monitoring",
  },
  dataset: {
    id: "dataset",
    phase: "development",
    title: "Build datasets",
    meta: ["datasets", "features-as-tests"],
    href: "/academy/datasets",
  },
  experiment: {
    id: "experiment",
    phase: "development",
    title: "Experiment",
    meta: ["prompts", "models", "code variants"],
    href: "/academy/experiments",
  },
  eval: {
    id: "eval",
    phase: "development",
    title: "Evaluate",
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
