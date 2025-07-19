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
  frameworks: "Frameworks",
  "model-providers": "Model Providers",
  gateways: "Gateways",
  "no-code": "No-Code Agent Builders",
  analytics: "Analytics",
  other: "Other",
};
