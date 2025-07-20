import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Core</MenuSubSeparator>,
  },
  datasets: {},
  "evaluation-methods": "Evaluation Methods",
  "experiment-comparison": {},
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
