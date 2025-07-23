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
    href: "/docs/api-and-data-platform/overview",
  },

  "metrics-api": {
    title: "Metrics API ↗",
    href: "/docs/metrics/features/metrics-api",
  },

  "custom-dashboards": {
    title: "Custom Dashboards ↗",
    href: "/docs/metrics/features/custom-dashboards",
  },
};
