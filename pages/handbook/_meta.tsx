import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export const TEAMS_CONFIG = {
  "product-engineering": {
    title: "Product Engineering",
    firstPage: "documentation",
  },
  gtm: {
    title: "GTM",
    firstPage: "overview",
  },
  operations: {
    title: "Operations",
    firstPage: "entity-structure",
  },
};

// Derived object for backwards compatibility with Nextra meta
export const TEAMS_PATHS = Object.fromEntries(
  Object.entries(TEAMS_CONFIG).map(([path, config]) => [path, config.title])
);

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
