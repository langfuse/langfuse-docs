import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  "prompt-version-control": {},
  "link-to-traces": {},
  playground: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  composability: {},
  "message-placeholders": {},
  "evaluate-prompts": {
    title: "Evaluate Prompts ↗",
    href: "/docs/evaluation/dataset-runs/run-via-ui",
  },
  "a-b-testing": {},
  "*": {
    layout: "default",
  },
};
