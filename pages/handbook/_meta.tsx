import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export const TEAMS_PATHS = {
  "product-engineering": "Product Engineering",
  gtm: "GTM",
  operations: "Operations",
};

export const TEAMS_FIRST_PAGES = {
  "product-engineering": "documentation",
  gtm: "overview",
  operations: "entity-structure",
};

export default {
  "-- Main Handbook": {
    type: "separator",
    title: <MenuSubSeparator>Main Handbook</MenuSubSeparator>,
  },
  index: "Overview",
  chapters: "Chapters",
  "working-at-langfuse": "Working at Langfuse",
  "-- Teams": {
    type: "separator",
    title: <MenuSubSeparator>Teams</MenuSubSeparator>,
  },
  ...TEAMS_PATHS,
};
