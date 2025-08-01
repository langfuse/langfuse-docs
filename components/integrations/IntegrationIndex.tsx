import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import {
  Puzzle,
  Globe,
  Server,
  Wrench,
  RectangleEllipsis,
  ChartBar,
  Code,
  Database,
} from "lucide-react";
import nativeIntegrationsMeta from "../../pages/integrations/native/_meta";
import dataPlatformIntegrationsMeta from "../../pages/integrations/data-platform/_meta";

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

export const IntegrationIndex = () => {
  // Infer category order from the keys of categoryConfig, preserving their order of appearance
  const categoryOrder = Object.keys(categoryConfig);

  // Get pages from each category by merging filesystem and additional links
  const categorizedPages = {} as Record<string, ProcessedIntegrationPage[]>;

  categoryOrder.forEach((category) => {
    const config = categoryConfig[category];

    // Always load from filesystem
    const filesystemPages = loadFilesystemPages(category);

    // Merge with additional links if they exist
    const mergedPages = [
      ...(config.additionalLinks ?? []),
      ...(filesystemPages ?? []),
    ];

    // Only include categories that have pages
    if (mergedPages.length > 0) {
      categorizedPages[category] = processPages(mergedPages);
    }
  });

  return (
    <>
      {categoryOrder
        .filter(
          (category) =>
            categorizedPages[category] && categorizedPages[category].length > 0
        )
        .map((category) => {
          const config = categoryConfig[category];
          const pages = categorizedPages[category];

          return (
            <div key={category} className="my-10">
              <div className="flex items-center gap-3 mb-4">
                {config.icon}
                <div>
                  <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 text-2xl">
                    {config.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {config.description}
                  </p>
                </div>
              </div>
              <Cards num={3}>
                {pages.map((page) => (
                  <Cards.Card
                    href={page.route}
                    key={page.route}
                    title={page.title}
                    icon={
                      page.frontMatter?.logo ? (
                        <div className="w-6 h-6  dark:bg-white rounded-sm p-1 flex items-center justify-center">
                          <img
                            src={page.frontMatter.logo}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        config.icon
                      )
                    }
                    arrow
                  >
                    {""}
                  </Cards.Card>
                ))}
              </Cards>
            </div>
          );
        })}
    </>
  );
};
