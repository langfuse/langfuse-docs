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
    title: "Start Tracing",
    href: "/docs/observability/get-started",
  },
  "prompt-management-quickstart": {
    title: "Use Prompt Management",
    href: "/docs/prompt-management/get-started",
  },
  "evals-quickstart": {
    title: "Set up Evals",
    href: "/docs/evaluation/overview",
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
