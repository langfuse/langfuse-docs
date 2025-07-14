import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  "core-features": "Core Features",
  demo: "Interactive Demo",
  "-- Features": {
    type: "separator",
    title: "Features",
  },
  tracing: "Tracing",
  "prompt-management": "Prompt Management",
  evaluation: "Evaluation",
  platform: "Platform",

  api: "API",

  "-- More": {
    type: "separator",
    title: "More",
  },
  roadmap: "Roadmap",
  "ask-ai": "Ask AI",
  "docs-mcp": "Docs MCP Server",
  administration: "Administration",
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
