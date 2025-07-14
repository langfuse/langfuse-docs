import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  "core-features": "Core Features",
  demo: "Interactive Demo",
  "-- Core": {
    type: "separator",
    title: "Core Features",
  },
  tracing: "Tracing",
  "prompt-management": "Prompt Management",
  evaluation: "Evaluation",

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
