/**
 * Handbook navigation. Content lives under content/handbook/.
 * CHAPTER_ORDER: order of chapter slugs for display.
 * TEAMS: handbook section paths with display name and first page.
 */
export const CHAPTER_ORDER = [
  "mission",
  "customers",
  "story",
  "why",
  "open-source",
  "monetization",
  "team",
];

export const TEAMS: Record<string, { name: string; firstPage: string }> = {
  "product-engineering": { name: "Product & Engineering", firstPage: "architecture" },
  "sales-and-cs": { name: "Sales & Customer Success", firstPage: "overview" },
  support: { name: "Support", firstPage: "support" },
  devrel: { name: "Developer Relations", firstPage: "community-hour" },
  operations: { name: "Operations", firstPage: "finance" },
  "how-we-work": { name: "How we work", firstPage: "principles" },
  "how-we-hire": { name: "How we hire", firstPage: "philosophy" },
  "perks-and-pay": { name: "Perks & Pay", firstPage: "perks-and-pay" },
  "tools-and-processes": { name: "Tools & Processes", firstPage: "using-linear" },
  chapters: { name: "Chapters", firstPage: "mission" },
};
