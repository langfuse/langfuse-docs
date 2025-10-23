import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  "prompt-version-control": {},
  composability: {},
  "message-placeholders": {},
  playground: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "evaluate-prompts": {
    title: "Evaluate Prompts ↗",
    href: "/docs/evaluation/dataset-runs/run-via-ui",
  },
  "a-b-testing": {},
  "*": {
    layout: "default",
  },
};
