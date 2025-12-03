import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Essential": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  observations: {},
  traces: {},
  sessions: {},

  "-- Attributes": {
    type: "separator",
    title: <MenuSubSeparator>Attributes</MenuSubSeparator>,
  },
  users: {},
  metadata: {},
  tags: {},
  environments: {},
  "log-levels": {},
  "releases-and-versioning": {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "user-feedback": {},
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
