import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Core": {
    type: "separator",
    title: <MenuSubSeparator>Core</MenuSubSeparator>,
  },
  "prompt-version-control": {},
  composability: {},
  "message-placeholders": {},
  playground: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  "link-to-traces": {},
  config: {},
  "a-b-testing": {},
  caching: {},
  "guaranteed-availability": {},
  webhooks: {},
  "mcp-server": {},
  "n8n-node": {},
  folders: {},
  "*": {
    layout: "default",
  },
};
