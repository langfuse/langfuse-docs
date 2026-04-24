import { integrationsSource } from "@/lib/source";
import { Cards } from "@/components/docs";
import {
  nativeIntegrationsMeta,
  dataPlatformIntegrationsMeta,
} from "@/lib/integrations-meta";

function additionalLinksFromMeta(metaConfig: Record<string, any>) {
  return Object.entries(metaConfig)
    .filter(([_, config]) => config.href)
    .map(([_, config]) => ({
      route: config.href,
      frontMatter: { title: config.title, logo: config.logo },
    }));
}

const categoryConfig: Record<
  string,
  {
    title: string;
    description: string;
    additionalLinks?: { route: string; frontMatter: any }[];
    featuredLinks?: ProcessedIntegrationPage[];
  }
> = {
  native: {
    title: "Native",
    description: "Native integrations with Langfuse",
    additionalLinks: additionalLinksFromMeta(nativeIntegrationsMeta),
  },
  frameworks: {
    title: "Frameworks",
    description: "Integrate with popular AI frameworks",
    featuredLinks: [
      {
        route: "/integrations/frameworks/langchain",
        frontMatter: {
          title: "LangChain & LangGraph",
          logo: "/images/integrations/langchain_icon.png",
        },
        title: "LangChain & LangGraph",
      },
      {
        route: "/integrations/model-providers/openai-py",
        frontMatter: {
          title: "OpenAI (Python)",
          logo: "/images/integrations/openai_icon.svg",
        },
        title: "OpenAI (Python)",
      },
      {
        route: "/integrations/frameworks/vercel-ai-sdk",
        frontMatter: {
          title: "Vercel AI SDK",
          logo: "/images/integrations/vercel_ai_sdk_icon.png",
        },
        title: "Vercel AI SDK",
      },
      {
        route: "/integrations/frameworks/google-adk",
        frontMatter: {
          title: "Google ADK",
          logo: "/images/integrations/google_adk_icon.png",
        },
        title: "Google ADK",
      },
      {
        route: "/integrations/frameworks/pydantic-ai",
        frontMatter: {
          title: "Pydantic AI",
          logo: "/images/integrations/pydantic_ai_icon.svg",
        },
        title: "Pydantic AI",
      },
      {
        route: "/integrations/frameworks/openai-agents",
        frontMatter: {
          title: "OpenAI Agents",
          logo: "/images/integrations/openai_icon.svg",
        },
        title: "OpenAI Agents",
      },
    ],
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

export const categoryOrder = Object.keys(categoryConfig);

type IntegrationPage = { route: string; name?: string; frontMatter: any };
type ProcessedIntegrationPage = IntegrationPage & { title: string };

function loadFilesystemPages(category: string): IntegrationPage[] {
  try {
    const allParams = integrationsSource.generateParams();
    return allParams
      .filter(({ slug }) => slug.length >= 2 && slug[0] === category)
      .map(({ slug }) => {
        const page = integrationsSource.getPage(slug);
        if (!page) return null;
        return {
          route: `/integrations/${slug.join("/")}`,
          name: String(slug[slug.length - 1] || ""),
          frontMatter: page.data as unknown as Record<string, unknown>,
        } as IntegrationPage;
      })
      .filter(Boolean) as IntegrationPage[];
  } catch {
    return [];
  }
}

function processPages(pages: IntegrationPage[]): ProcessedIntegrationPage[] {
  return pages
    .map((page) => ({
      ...page,
      title:
        page.frontMatter?.sidebarTitle || page.frontMatter?.title || page.name,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function getCategory(category: string) {
  const config = categoryConfig[category];
  if (!config) return null;

  const filesystemPages = loadFilesystemPages(category);
  const mergedPages = [
    ...(config.additionalLinks ?? []),
    ...(filesystemPages ?? []),
  ];

  if (mergedPages.length === 0) return null;

  return {
    config,
    pages: processPages(mergedPages),
    featured: config.featuredLinks,
  };
}

function IntegrationCards({
  pages,
  featured,
}: {
  pages: ProcessedIntegrationPage[];
  featured?: ProcessedIntegrationPage[];
}) {
  return (
    <>
      {featured && featured.length > 0 && (
        <Cards num={3}>
          {featured.slice(0, 6).map((page) => (
            <Cards.Card
              href={page.route}
              key={page.route}
              title={page.title}
              className=""
              icon={
                page.frontMatter?.logo ? (
                  <img
                    src={page.frontMatter.logo}
                    alt=""
                    className="w-5 h-5 object-contain"
                  />
                ) : undefined
              }
              arrow
            >
              {""}
            </Cards.Card>
          ))}
        </Cards>
      )}
      <div className={featured && featured.length > 0 ? "mt-8" : ""}>
        <Cards num={3}>
          {pages
            .filter(
              (p) => !(featured || []).some((f) => f.route === p.route)
            )
            .map((page) => (
              <Cards.Card
                href={page.route}
                key={page.route}
                title={page.title}
                className=""
                icon={
                  page.frontMatter?.logo ? (
                    <img
                      src={page.frontMatter.logo}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                  ) : undefined
                }
                arrow
              >
                {""}
              </Cards.Card>
            ))}
        </Cards>
      </div>
    </>
  );
}

/**
 * Renders a single integration category's description and cards.
 * Headings are expected to be provided in the MDX so they appear in the TOC.
 */
export function IntegrationCategory({ category }: { category: string }) {
  const data = getCategory(category);
  if (!data) return null;

  return (
    <div className="mb-6">
      <p className="text-sm text-text-tertiary -mt-4 mb-4">
        {data.config.description}
      </p>
      <IntegrationCards pages={data.pages} featured={data.featured} />
    </div>
  );
}

/**
 * Legacy wrapper that renders all categories with headings inline.
 * Prefer using IntegrationCategory per-section in MDX for TOC support.
 */
export const IntegrationIndex = () => {
  return (
    <>
      {categoryOrder
        .filter((category) => getCategory(category) !== null)
        .map((category) => {
          const data = getCategory(category)!;
          return (
            <div key={category} className="my-10">
              <h3 className="font-semibold tracking-tight text-text-primary text-2xl mb-1">
                {data.config.title}
              </h3>
              <p className="text-sm text-text-tertiary mb-4">
                {data.config.description}
              </p>
              <IntegrationCards pages={data.pages} featured={data.featured} />
            </div>
          );
        })}
    </>
  );
};
