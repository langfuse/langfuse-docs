import { SITE_DEFAULT_OG_DESCRIPTION } from "@/lib/og-url";

const SITE_URL = "https://langfuse.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

// Homepage JSON-LD. Search engines and AI answer engines read it to identify
// Langfuse as a product and a company. Everything stated here is also visible
// on the site (imprint, pricing, GitHub); keep it limited to stable facts.
// Plan prices are deliberately left out so this file never goes stale when
// pricing changes; the offer only states that a free plan exists.
export const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Langfuse",
      legalName: "Langfuse GmbH",
      url: SITE_URL,
      logo: `${SITE_URL}/langfuse_logo.png`,
      description: SITE_DEFAULT_OG_DESCRIPTION,
      email: "contact@langfuse.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Oranienburgerstraße 91",
        postalCode: "10178",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@langfuse.com",
          url: `${SITE_URL}/support`,
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          url: `${SITE_URL}/talk-to-us`,
        },
      ],
      parentOrganization: {
        "@type": "Organization",
        name: "ClickHouse",
        url: "https://clickhouse.com",
      },
      sameAs: [
        "https://github.com/langfuse",
        "https://www.linkedin.com/company/langfuse",
        "https://x.com/langfuse",
        "https://www.youtube.com/@langfuse",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Langfuse",
      url: SITE_URL,
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Langfuse",
      description:
        "Open-source AI engineering platform for LLM and agent observability, evaluation, prompt management, and datasets. Available as Langfuse Cloud or self-hosted.",
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web; self-hosted on Docker or Kubernetes",
      license: "https://github.com/langfuse/langfuse/blob/main/LICENSE",
      softwareHelp: { "@type": "WebPage", url: `${SITE_URL}/docs` },
      publisher: { "@id": ORGANIZATION_ID },
      sameAs: ["https://github.com/langfuse/langfuse"],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "0",
        url: `${SITE_URL}/pricing`,
        description:
          "Free Hobby plan on Langfuse Cloud and free self-hosting under the MIT license; paid Cloud plans and Enterprise add-ons.",
      },
    },
  ],
};
