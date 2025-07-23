import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Core</MenuSubSeparator>,
  },
  "llm-as-a-judge": "LLM as a Judge",
  "custom-scores": "Custom Evaluators",
  "annotation": "Manual Annotation",

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "security-and-guardrails": {},
  "*": {
    layout: "default",
  },
};
