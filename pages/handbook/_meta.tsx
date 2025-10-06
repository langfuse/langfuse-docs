import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export const TEAMS = {
  "product-engineering": {
    name: "Product Engineering",
    firstPage: "documentation",
  },
  gtm: {
    name: "GTM",
    firstPage: "overview",
  },
  operations: {
    name: "Operations",
    firstPage: "entity-structure",
  },
};

export default {
  "-- Main Handbook": {
    type: "separator",
    title: <MenuSubSeparator>Main Handbook</MenuSubSeparator>,
  },
  index: "Overview",
  chapters: "Chapters",
  "-- Resources": {
    type: "separator",
    title: <MenuSubSeparator>Resources</MenuSubSeparator>,
  },
  "working-at-langfuse": "Working at Langfuse",
  ...Object.fromEntries(
    Object.entries(TEAMS).map(([key, value]) => [key, value.name])
  ),
};
