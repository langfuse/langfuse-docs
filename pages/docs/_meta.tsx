import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  demo: "Interactive Demo",
  "-- Tracing": {
    type: "separator",
    title: "Tracing",
  },
  tracing: "Introduction",
  "tracing-data-model": "Data Model",
  "get-started": "Quickstart",
  "tracing-features": "Tracing Features",
  sdk: "SDKs",
  integrations: "Integrations",
  opentelemetry: "OpenTelemetry",
  "model-usage-and-cost": "LLM Usage & Cost Tracking",
  analytics: "Production Analytics",
  "query-traces": "Query Traces",

  "-- Develop": {
    type: "separator",
    title: "Develop",
  },
  prompts: "Prompt Management",
  playground: "Playground",
  security: "LLM Security",
  "fine-tuning": "Fine-tuning",

  "-- Evaluation": {
    type: "separator",
    title: "Evaluation",
  },
  scores: "Evaluation",
  datasets: "Datasets & Experiments",

  "-- References": {
    type: "separator",
    title: "References",
  },
  api: "API",
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
  "data-retention": "Data Retention",
  "open-source": "Open Source",
  roadmap: "Roadmap",
  "ask-ai": "Ask AI",
  support: {
    title: "Support ↗",
    href: "/support",
    newWindow: true,
  },
};
