import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  datasets: {},
  "evaluation-methods": "Evaluation Methods",
  "prompt-experiments": {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "security-and-guardrails": {},
  "*": {
    layout: "default",
  },
};
