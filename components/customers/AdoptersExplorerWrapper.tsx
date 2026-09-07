import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AdoptersExplorer, type Adopter } from "./AdoptersExplorer";
import { AdoptersTicker } from "./AdoptersTicker";
import adobeLogo from "../home/img/adobe.svg";
import canvaLogo from "../home/img/canva.svg";
import circlebackLogo from "../home/img/circleback.svg";
import ciscoLogo from "../home/img/cisco.svg";
import expediaLogo from "../home/img/expedia.svg";
import freeeLogo from "../home/img/freee.svg";
import huggingFaceLogo from "../home/img/huggingface.svg";
import intuitLogo from "../home/img/intuit.svg";
import khanAcademyLogo from "../home/img/khan.svg";
import magicPatternsLogo from "../home/img/magic.svg";
import merckLogo from "../home/img/merck.svg";
import pigmentLogo from "../home/img/pigment.svg";
import rampLogo from "../home/img/ramp.svg";
import rocketMoneyLogo from "../home/img/rocket-money.svg";
import samsaraLogo from "../home/img/samsara.svg";
import sumUpLogo from "../home/img/sumup.svg";
import telusLogo from "../home/img/telus.svg";
import twilioLogo from "../home/img/twilio.svg";

const ADOPTERS_TABLE_PATH = join(
  process.cwd(),
  "components-mdx",
  "adopters-table.mdx",
);

const COMPANY_LOGOS: Record<string, NonNullable<Adopter["logo"]>> = {
  Adobe: { src: adobeLogo, crop: { x: 44, y: 13, width: 53, height: 14 } },
  Canva: { src: canvaLogo, crop: { x: 51, y: 14, width: 37, height: 12 } },
  Circleback: {
    src: circlebackLogo,
    crop: { x: 37, y: 15, width: 66, height: 9 },
  },
  Cisco: { src: ciscoLogo, crop: { x: 51, y: 10, width: 38, height: 20 } },
  "Expedia Group": {
    src: expediaLogo,
    crop: { x: 40, y: 14, width: 60, height: 12 },
  },
  freee: { src: freeeLogo, crop: { x: 46, y: 11, width: 48, height: 18 } },
  "Hugging Face": {
    src: huggingFaceLogo,
    crop: { x: 34.5, y: 12, width: 70.5, height: 16 },
  },
  Intuit: { src: intuitLogo, crop: { x: 51, y: 15.5, width: 39, height: 8 } },
  "Khan Academy": {
    src: khanAcademyLogo,
    crop: { x: 34, y: 14.25, width: 72, height: 11.5 },
  },
  "Magic Patterns": {
    src: magicPatternsLogo,
    crop: { x: 23, y: 13, width: 93, height: 14 },
  },
  "Merck Group": {
    src: merckLogo,
    crop: { x: 44.25, y: 15.5, width: 50.5, height: 8.5 },
  },
  Pigment: {
    src: pigmentLogo,
    crop: { x: 34, y: 13, width: 71, height: 13 },
  },
  Ramp: { src: rampLogo, crop: { x: 45.5, y: 13.25, width: 49, height: 13.5 } },
  "Rocket Money": {
    src: rocketMoneyLogo,
    crop: { x: 44.5, y: 10.5, width: 51, height: 18 },
  },
  Samsara: {
    src: samsaraLogo,
    crop: { x: 41.5, y: 12.25, width: 57, height: 14.5 },
  },
  Slite: { src: "/images/customers/slite/slite-light.png" },
  SumUp: {
    src: sumUpLogo,
    crop: { x: 45.25, y: 12.25, width: 49.5, height: 14.5 },
  },
  TELUS: { src: telusLogo, crop: { x: 39, y: 15, width: 62, height: 12 } },
  Twilio: {
    src: twilioLogo,
    crop: { x: 46.25, y: 12.5, width: 47, height: 14 },
  },
};

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
      logo: COMPANY_LOGOS[company.label],
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
