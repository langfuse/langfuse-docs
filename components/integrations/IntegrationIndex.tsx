import { Callout } from "nextra/components";

/**
 * Transforms meta config entries into integration page objects
 */
function additionalLinksFromMeta(metaConfig: Record<string, any>) {
  return Object.entries(metaConfig)
    .filter(([_, config]) => config.href)
    .map(([_, config]) => ({
      route: config.href,
      frontMatter: { title: config.title, logo: config.logo },
    }));
}

const categoryConfig = {
  native: {
    title: "Native",
    description: "Native integrations with Langfuse",
    additionalLinks: additionalLinksFromMeta(nativeIntegrationsMeta),
  },
  frameworks: {
    title: "Frameworks",
    description: "Integrate with popular AI frameworks",
  },
  "model-providers": {
    title: "Model Providers",
    description: "Direct integrations with AI model providers",
  },
  gateways: {
    title: "Gateways",
    description: "Connect through API gateways and proxies",
  },
  "no-code": {
    title: "No-Code",
    description: "No-code agent builders and tools",
  },
  analytics: {
    title: "Analytics",
    description:
      "Analytics tools that can visualize Langfuse traces and metrics",
  },
  data: {
    title: "Data Platform",
    description:
      "Use Langfuse data and metrics in your own application and data platform",
    additionalLinks: additionalLinksFromMeta(dataPlatformIntegrationsMeta),
  },
  other: {
    title: "Other",
    description: "Other integrations",
  },
};

type IntegrationPage = Page & { frontMatter: any };
type ProcessedIntegrationPage = IntegrationPage & { title: string };

/**
 * Loads pages from the filesystem for a given category
 */
function loadFilesystemPages(category: string): IntegrationPage[] {
  try {
    const pages = getPagesUnderRoute(
      `/integrations/${category}`
    ) as IntegrationPage[];
    // Filter out category index pages and only keep actual integration pages
    return pages.filter(
      (page) =>
        page.route !== `/integrations/${category}` &&
        page.route !== `/integrations/${category}/index`
    );
  } catch (error) {
    // Category directory doesn't exist or has no pages
    return [];
  }
}

/**
 * Processes pages by adding title and sorting alphabetically
 */
function processPages(pages: IntegrationPage[]): ProcessedIntegrationPage[] {
  return pages
    .map((page) => ({
      ...page,
      title:
        page.frontMatter?.sidebarTitle || page.frontMatter?.title || page.name,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const IntegrationIndex = () => (
  <Callout type="warning">
    Integration index temporarily disabled during Nextra v4 migration. See Backlog.md.
  </Callout>
);
