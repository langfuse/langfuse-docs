import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Core</MenuSubSeparator>,
  },
  sessions: {},
  users: {},
  environments: {},
  tags: {},
  metadata: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "trace-ids": {},
  "log-levels": {},
  "*": {
    layout: "default",
  },
  "query-traces": {
    title: "Query Data ↗",
    href: "/docs/platform/features/query-traces",
  },

  "metrics-api": {
    title: "Metrics API ↗",
    href: "/docs/platform/features/metrics-api",
  },

  "custom-dashboards": {
    title: "Custom Dashboards ↗",
    href: "/docs/platform/features/custom-dashboards",
  },
};
