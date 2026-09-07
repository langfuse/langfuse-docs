import "server-only";

import { PRODUCT_OVERVIEW_PATHS } from "@/lib/product-overview-paths";

const BASE_URL = "https://langfuse.com";

/**
 * Intermediate crumbs must be real pages. Folder-only segments such as
 * /docs/observability/features have no index and 404, which can make
 * Google drop BreadcrumbList rich results. Always emit Home, known
 * section/product landings, and the current page.
 */
const VALID_INTERMEDIATE_PATHS = new Set<string>([
  ...PRODUCT_OVERVIEW_PATHS,
  "/self-hosting",
  "/guides",
  "/faq",
  "/academy",
  "/integrations",
  "/handbook",
  "/library",
  "/workshop",
  "/resources",
  "/security",
  "/blog",
  "/changelog",
  "/docs/observability/sdk/upgrade-path",
]);

const SLUG_LABELS: Record<string, string> = {
  docs: "Docs",
  observability: "Observability",
  "prompt-management": "Prompt Management",
  evaluation: "Evaluation",
  metrics: "Metrics",
  "api-and-data-platform": "API and Data Platform",
  "get-started": "Get Started",
  "self-hosting": "Self-Hosting",
  academy: "Academy",
  integrations: "Integrations",
  guides: "Guides",
  faq: "FAQ",
  handbook: "Handbook",
  security: "Security",
  library: "Library",
  workshop: "Workshop",
  resources: "Resources",
};

function humanizeSegment(segment: string): string {
  return (
    SLUG_LABELS[segment] ??
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export type JsonLdObject = Record<string, unknown>;

export function breadcrumbListJsonLd(pageUrl: string): JsonLdObject | null {
  const parts = pageUrl.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const items: JsonLdObject[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
  ];

  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += `/${parts[i]}`;
    const isCurrent = i === parts.length - 1;
    if (!isCurrent && !VALID_INTERMEDIATE_PATHS.has(acc)) continue;
    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: humanizeSegment(parts[i]),
      item: `${BASE_URL}${acc}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function softwareApplicationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Langfuse",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: `${BASE_URL}/docs`,
    description:
      "Open-source AI engineering platform for agent observability, prompt management, evals, and analytics.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
