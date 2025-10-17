export const TEAMS = {
  "product-engineering": {
    name: "Product Engineering",
    firstPage: "documentation",
  },
  "sales-and-cs": {
    name: "Sales & CS",
    firstPage: "overview",
  },
  support: {
    name: "Support",
    firstPage: "support",
  },
  operations: {
    name: "Operations",
    firstPage: "entity-structure",
  },
};

export default {
  "-- Handbook": {
    type: "separator",
    title: "Handbook",
  },
  index: "Overview",
  chapters: "Chapters",
  "-- Working at Langfuse": {
    type: "separator",
    title: "Working at Langfuse",
  },
  "how-we-work": "How we work",
  "how-we-hire": "How we hire",
  "perks-and-pay": "Perks and Pay",
  "tools-and-processes": "Tool & Processes",
  "-- Resources": {
    type: "separator",
    title: "Resources",
  },
  ...Object.fromEntries(
    Object.entries(TEAMS).map(([key, value]) => [key, value.name])
  ),
};
