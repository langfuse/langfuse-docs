import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  "core-features": "Core Features",
  demo: "Interactive Demo",
  "ask-ai": "Ask AI",

  "-- Features": {
    type: "separator",
    title: "Features",
  },
  observability: "Observability",
  "prompt-management": "Prompt Management",
  evaluation: "Evaluation",
  platform: "Data Platform",
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
