import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Entry</MenuSubSeparator>,
  },
  sessions: {},
  users: {},
  environments: {},
  tags: {},
  metadata: {},
  "trace-ids-and-distributed-tracing": {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
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
