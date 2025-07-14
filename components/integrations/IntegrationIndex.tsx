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

// Pages that are not in the integrations directory, but are still integrations
const nativeIntegrations = [
  {
    route: "/docs/sdk/python/sdk-v3",
    title: "Python SDK",
    logo: undefined,
  },
  {
    route: "/docs/sdk/typescript/guide",
    title: "JS/TS SDK",
    logo: undefined,
  },
  {
    route: "/docs/opentelemetry",
    title: "OpenTelemetry",
    logo: "/images/integrations/opentelemetry_icon.svg",
  },
].map((page) => ({
  ...page,
  frontMatter: { title: page.title, logo: page.logo },
}));

const dataIntegrations = [
  {
    route: "/docs/api",
    title: "Public API",
    logo: undefined,
  },
  {
    route: "/docs/query-traces#blob-storage",
    title: "Exports to S3",
    logo: undefined,
  },
  {
    route: "/docs/analytics/metrics-api",
    title: "Metrics API",
    logo: undefined,
  },
  {
    route: "/docs/prompts/get-started#webhooks",
    title: "Prompt Webhooks",
    logo: undefined,
  },
].map((page) => ({
  ...page,
  frontMatter: { title: page.title, logo: page.logo },
}));

const categoryConfig = {
  native: {
    title: "Native",
    icon: <Code />,
    description: "Native integrations with Langfuse",
    pages: nativeIntegrations,
  },
  frameworks: {
    title: "Frameworks",
    icon: <Puzzle />,
    description: "Integrate with popular AI frameworks",
  },
  "model-providers": {
    title: "Model Providers",
    icon: <Server />,
    description: "Direct integrations with AI model providers",
  },
  gateways: {
    title: "Gateways",
    icon: <Globe />,
    description: "Connect through API gateways and proxies",
  },
  "no-code": {
    title: "No-Code",
    icon: <Wrench />,
    description: "No-code agent builders and tools",
  },
  analytics: {
    title: "Analytics",
    icon: <ChartBar />,
    description:
      "Analytics tools that can visualize Langfuse traces and metrics",
  },
  data: {
    title: "Data Platform",
    icon: <Database />,
    description:
      "Use Langfuse data and metrics in your own application and data platform",
    pages: dataIntegrations,
  },
  other: {
    title: "Other",
    icon: <RectangleEllipsis />,
    description: "Other integrations",
  },
};

export const IntegrationIndex = () => {
  // Infer category order from the keys of categoryConfig, preserving their order of appearance
  const categoryOrder = Object.keys(categoryConfig);

  // Get pages from each category directory individually
  const categorizedPages = {} as Record<
    string,
    Array<Page & { frontMatter: any }>
  >;

  categoryOrder.forEach((category) => {
    const config = categoryConfig[category];

    // Use predefined pages if they exist, otherwise load from filesystem
    if (config.pages && config.pages.length > 0) {
      categorizedPages[category] = config.pages as Array<
        Page & { frontMatter: any }
      >;
    } else {
      try {
        const pages = getPagesUnderRoute(`/integrations/${category}`) as Array<
          Page & { frontMatter: any }
        >;
        // Filter out any category index pages and only keep actual integration pages
        const filteredPages = pages.filter(
          (page) =>
            page.route !== `/integrations/${category}` &&
            page.route !== `/integrations/${category}/index`,
        );

        if (filteredPages.length > 0) {
          categorizedPages[category] = filteredPages;
        }
      } catch (error) {
        // Silently skip categories with no pages
      }
    }
  });

  return (
    <>
      {categoryOrder
        .filter(
          (category) =>
            categorizedPages[category] && categorizedPages[category].length > 0,
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
                {pages
                  .map((page) => ({
                    ...page,
                    title:
                      page.frontMatter?.sidebarTitle ||
                      page.frontMatter?.title ||
                      page.name,
                  }))
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((page) => (
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
