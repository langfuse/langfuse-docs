import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import { Puzzle, Globe, Server, Wrench } from "lucide-react";
import Link from "next/link";

const categoryConfig = {
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
    try {
      const pages = getPagesUnderRoute(`/integrations/${category}`) as Array<
        Page & { frontMatter: any }
      >;
      // Filter out any category index pages and only keep actual integration pages
      const filteredPages = pages.filter(
        (page) =>
          page.route !== `/integrations/${category}` &&
          page.route !== `/integrations/${category}/index`
      );

      if (filteredPages.length > 0) {
        categorizedPages[category] = filteredPages;
      }
    } catch (error) {
      // Silently skip categories with no pages
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
                    title={
                      page.frontMatter?.sidebarTitle ||
                      page.frontMatter?.title ||
                      page.name
                    }
                    icon={
                      page.frontMatter?.logo ? (
                        <img
                          src={page.frontMatter.logo}
                          alt=""
                          className="w-6 h-6 object-contain"
                        />
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
