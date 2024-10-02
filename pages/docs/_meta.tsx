import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  demo: "Interactive Demo",
  deployment: "Self-host",
  "-- Tracing": {
    type: "separator",
    title: "Tracing",
  },
  tracing: "Introduction",
  "get-started": "Quickstart",
  "tracing-features": "Features",
  sdk: "SDKs",
  integrations: "Integrations",
  "query-traces": "Query Traces",

  "-- Develop": {
    type: "separator",
    title: "Develop",
  },
  prompts: "Prompt Management",
  playground: "Playground",
  "fine-tuning": "Fine-tuning",

  "-- Monitor": {
    type: "separator",
    title: "Monitor",
  },
  analytics: "Analytics",
  "model-usage-and-cost": "Model Usage & Cost",
  scores: "Scores & Evaluation",
  security: "LLM Security",

  "-- Test": {
    type: "separator",
    title: "Test",
  },
  experimentation: "Experimentation",
  datasets: "Datasets",

  "-- References": {
    type: "separator",
    title: "References",
  },
  "api-ref": {
    title: "API ↗",
    href: "https://api.reference.langfuse.com",
    newWindow: true,
  },
  "python-ref": {
    title: "Python SDK ↗",
    href: "https://python.reference.langfuse.com",
    newWindow: true,
  },
  "js-ref": {
    title: "JS SDK ↗",
    href: "https://js.reference.langfuse.com",
    newWindow: true,
  },
  "-- More": {
    type: "separator",
    title: "More",
  },
  rbac: "Access Control (RBAC)",
  "data-security-privacy": "Data Security & Privacy",
  "open-source": "Open Source",
  roadmap: "Roadmap",
  support: {
    title: "Support ↗",
    href: "/support",
    newWindow: true,
  },
  video: {
    title: "Video (2 min)",
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
    },
  },
};
