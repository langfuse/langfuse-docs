import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "*": {
    theme: {
      breadcrumb: false,
    },
  },
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  "core-features": "Core Features",
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
  "tracing-integrations": {
    title: "Integrations ↗",
    href: "/integrations",
  },
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
  "java-ref": {
    title: "Java SDK ↗",
    href: "https://github.com/langfuse/langfuse-java",
    newWindow: true,
  },
  "-- More": {
    type: "separator",
    title: "More",
  },
  rbac: "Access Control (RBAC)",
  "audit-logs": "Audit Logs",
  "data-retention": "Data Retention",
  "data-deletion": "Data Deletion",
  roadmap: "Roadmap",
  "ask-ai": "Ask AI",
  "docs-mcp": "Docs MCP Server",
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
