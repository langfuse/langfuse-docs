import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  demo: "Interactive Demo",
  "ask-ai": "Ask AI",

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
