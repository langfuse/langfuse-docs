// Step names and phases mirror /academy/ai-engineering-loop. This loop renders
// on the landing page and in the Academy (`components/academy/LoopDiagram.tsx`).
// Keep `renderLoopDiagram` in `lib/markdown-component-renderers.js` in sync.

export type LoopStepId =
  | "trace"
  | "monitor"
  | "dataset"
  | "experiment"
  | "eval";
export type LoopPhaseId = "production" | "development";

export type LoopCopy = {
  /** Set when the copy is not English, so the figure gets the right `lang`. */
  lang?: string;
  phases: Record<LoopPhaseId, string>;
  steps: Record<LoopStepId, { title: string; meta: string[]; href: string }>;
  iterate: string;
  deploy: string;
  ariaLabel: string;
  caption: string;
};

export const LOOP_STEP_PHASE: Record<LoopStepId, LoopPhaseId> = {
  trace: "production",
  monitor: "production",
  dataset: "development",
  experiment: "development",
  eval: "development",
};

export const LOOP_COPY: LoopCopy = {
  phases: {
    production: "Production",
    development: "Development",
  },
  steps: {
    trace: {
      title: "Trace",
      meta: ["traces", "sessions", "agents", "prompts"],
      href: "/academy/tracing",
    },
    monitor: {
      title: "Monitor",
      meta: ["dashboards", "LLM-as-judge", "feedback"],
      href: "/academy/monitoring",
    },
    dataset: {
      title: "Build datasets",
      meta: ["datasets", "features-as-tests"],
      href: "/academy/datasets",
    },
    experiment: {
      title: "Experiment",
      meta: ["prompts", "models", "code variants"],
      href: "/academy/experiments",
    },
    eval: {
      title: "Evaluate",
      meta: ["judges", "custom evals", "annotation"],
      href: "/academy/evaluate",
    },
  },
  iterate: "iterate",
  deploy: "deploy",
  ariaLabel: "The AI engineering loop from the Langfuse Academy",
  caption:
    "In production, trace and monitor your application, and iterate directly on what monitoring surfaces. During development, build datasets, then experiment and evaluate, iterating until a change is good enough. Deploy it, and the loop starts again with new traces.",
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
