import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export const TEAMS_PATHS = {
  "product-engineering": "Product Engineering",
  support: "Support",
};

export default {
  index: "Start",
  chapters: "Chapters",
  "working-at-langfuse": "Working at Langfuse",
  "-- Teams": {
    type: "separator",
    title: <MenuSubSeparator>Teams</MenuSubSeparator>,
  },
  ...TEAMS_PATHS,
};
