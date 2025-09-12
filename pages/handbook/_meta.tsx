import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export const TEAMS_PATHS = {
  "product-engineering": "Product Engineering",
  support: "Support",
};

export default {
  "-- Company": {
    type: "separator",
    title: <MenuSubSeparator>Company</MenuSubSeparator>,
  },

  "-- Main Handbook": {
    type: "separator",
    title: <MenuSubSeparator>Main Handbook</MenuSubSeparator>,
  },
  index: "Start",
  chapters: "Chapters",
  "working-at-langfuse": "Working at Langfuse",
  "-- Teams": {
    type: "separator",
    title: <MenuSubSeparator>Teams</MenuSubSeparator>,
  },
  ...TEAMS_PATHS,
};
