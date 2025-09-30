import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  demo: "Interactive Demo",
  "ask-ai": "Ask AI",

  "-- Get Started": {
    type: "separator",
    title: "Get Started",
  },
  "observability-quickstart": {
    title: "Trace an Application",
    href: "/docs/observability/get-started",
  },
  "prompt-management-quickstart": {
    title: "Fetch a Prompt",
    href: "/docs/prompt-management/get-started",
  },
  "evals-quickstart": {
    title: "Start Evaluating Traces",
    href: "/docs/evaluation/evaluation-methods/llm-as-a-judge",
  },
  "experiments-quickstart": {
    title: "Run an Experiment",
    href: "/docs/evaluation/experiments/experiments-via-ui",
  },

  "-- Products": {
    type: "separator",
    title: "Products",
  },
  observability: "Observability",
  "prompt-management": "Prompt Management",
  evaluation: "Evaluation",

  "-- Platform": {
    type: "separator",
    title: "Platform",
  },
  metrics: "Metrics",
  "api-and-data-platform": "API & Data Platform",
  administration: "Administration",
  "security-and-guardrails": "Security & Guardrails",

  "-- More": {
    type: "separator",
    title: "More",
  },
  roadmap: "Roadmap",
  "docs-mcp": "Docs MCP Server",
  references: "References",

  "security-compliance": {
    title: "Security & Compliance ↗",
    href: "/security",
    newWindow: true,
  },
  support: {
    title: "Support ↗",
    href: "/support",
    newWindow: true,
  },
};
