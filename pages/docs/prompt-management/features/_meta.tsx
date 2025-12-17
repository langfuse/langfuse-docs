import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  "link-to-traces": {},
  "prompt-version-control": {},
  playground: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  variables: {},
  composability: {},
  "message-placeholders": {},
  config: {},
  "evaluate-prompts": {
    title: "Prompt Experiments ↗",
    href: "/docs/evaluation/dataset-runs/run-via-ui",
  },
  caching: {},
  "mcp-server": {},
  "webhooks-slack-integrations": {},
  "github-integration": {},
  "n8n-node": {},
  "guaranteed-availability": {},
  "a-b-testing": {},
  folders: {},
  "*": {
    layout: "default",
  },
};
