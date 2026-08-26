import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AdoptersExplorer, type Adopter } from "./AdoptersExplorer";
import { AdoptersTicker } from "./AdoptersTicker";

const ADOPTERS_TABLE_PATH = join(
  process.cwd(),
  "components-mdx",
  "adopters-table.mdx",
);

const COMPANY_DESCRIPTIONS: Record<string, string> = {
  Accor: "Hospitality group",
  Adobe: "Creative software and digital experience platform",
  Apple: "Consumer electronics and software company",
  Base44: "AI app-building platform",
  Bayer: "Pharmaceutical and life sciences company",
  Canva: "Visual communication and design platform",
  Circleback: "AI meeting assistant with transcription and notes",
  Cisco: "Networking and cybersecurity company",
  "City of Munich": "Municipal government",
  Cornelsen: "Educational publisher and learning provider",
  CyberAgent: "Digital advertising, media, and internet services company",
  Cybozu: "Workplace collaboration software company",
  Draftbit: "Visual mobile app development platform",
  Ecosia: "Search engine and technology company",
  Equinix: "Digital infrastructure and data center company",
  "Expedia Group": "Travel technology company",
  Fletch: "Security and threat intelligence platform",
  freee: "Cloud accounting and HR software company",
  GoodData: "Analytics and business intelligence platform",
  Groupon: "Local commerce marketplace",
  HP: "Personal computing and printing technology company",
  "Hugging Face": "Open-source AI platform and model hub",
  iFood: "Food delivery technology platform",
  Intel: "Semiconductor and computing technology company",
  Intuit: "Financial software company",
  "Johns Hopkins University": "Research university",
  Juicebox: "AI-powered people search and recruiting platform",
  KDDI: "Telecommunications company",
  Kensho: "AI and analytics company",
  "Khan Academy": "Nonprofit online learning platform",
  "KINTO Technologies": "Mobility technology company",
  Knowunity: "Educational technology platform",
  Kombo: "Unified HR and payroll API platform",
  "La Suite numérique":
    "Digital collaboration suite for the French public sector",
  Lemonade: "Insurance technology company",
  "Magic Patterns": "AI-powered UI design tool",
  "McKinsey & Company": "Management consulting firm",
  "Merck Group": "Pharmaceutical and life sciences company",
  "Mitsubishi Heavy Industries":
    "Industrial engineering and manufacturing company",
  Moderna: "Biotechnology company",
  Monzo: "Digital bank",
  NASA: "Civil space agency",
  Pigment: "Enterprise business planning platform",
  Pipedream: "Developer integration platform",
  Posit: "Data science software company",
  Ramp: "Corporate finance platform",
  "Rocket Money": "Personal finance app",
  Salesloft: "Sales engagement platform",
  Samsara: "Connected operations platform",
  Sanofi: "Healthcare and pharmaceutical company",
  "Seven Eleven Japan": "Convenience retailer",
  Slite: "Knowledge management platform",
  SumUp: "Payments and point-of-sale company",
  TELUS: "Telecommunications company",
  "The Weather Company": "Weather intelligence company",
  Twilio: "Customer communications platform",
};

const COMPANIES_WITH_DOCUMENTED_USE_CASES = new Set([
  "Accor",
  "Base44",
  "Bayer",
  "Canva",
  "City of Munich",
  "CyberAgent",
  "Cybozu",
  "Ecosia",
  "Equinix",
  "freee",
  "GoodData",
  "Groupon",
  "HP",
  "Hugging Face",
  "iFood",
  "Intel",
  "Johns Hopkins University",
  "Juicebox",
  "KDDI",
  "Kensho",
  "KINTO Technologies",
  "La Suite numérique",
  "McKinsey & Company",
  "Mitsubishi Heavy Industries",
  "Moderna",
  "Monzo",
  "NASA",
  "Pipedream",
  "Posit",
  "Salesloft",
  "Samsara",
  "Sanofi",
  "Slite",
  "Twilio",
]);

const USE_CASE_OVERRIDES: Record<string, string> = {
  Accor: "AccorGPT, AI Butler, and TravelConcierge",
  Base44: "LLM logging",
};

function firstMarkdownLink(value: string) {
  const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
  return match ? { label: match[1], href: match[2] } : null;
}

function parseAdoptersTable(source: string): Adopter[] {
  const adopters: Adopter[] = [];

  for (const line of source.split(/\r?\n/)) {
    const cells = line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/);
    if (!cells) continue;

    const company = firstMarkdownLink(cells[1]);
    if (!company || company.label === "Company") continue;

    const reference = firstMarkdownLink(cells[3]);
    const referenceLabel = reference?.label ?? cells[3].trim();
    const tableSummary = cells[2].trim();
    const idBase = company.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    adopters.push({
      id: `${idBase}-${adopters.length}`,
      name: company.label,
      website: company.href,
      companyDescription: COMPANY_DESCRIPTIONS[company.label] ?? tableSummary,
      useCase: COMPANIES_WITH_DOCUMENTED_USE_CASES.has(company.label)
        ? (USE_CASE_OVERRIDES[company.label] ?? tableSummary)
        : undefined,
      tableSummary,
      referenceLabel,
      referenceHref: reference?.href,
    });
  }

  return adopters;
}

export function AdoptersExplorerWrapper({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const source = readFileSync(ADOPTERS_TABLE_PATH, "utf8");
  return (
    <AdoptersExplorer
      adopters={parseAdoptersTable(source)}
      embedded={embedded}
    />
  );
}

export function AdoptersTickerWrapper() {
  const source = readFileSync(ADOPTERS_TABLE_PATH, "utf8");
  return (
    <AdoptersTicker
      names={parseAdoptersTable(source).map(({ name }) => name)}
    />
  );
}
