import { loader } from "fumadocs-core/source";
import {
  docs,
  selfHosting,
  blog,
  changelog,
  guides,
  faq,
  integrations,
  security,
  library,
  customers,
  handbook,
  marketing,
} from "../.source/server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const selfHostingSource = loader({
  baseUrl: "/self-hosting",
  source: selfHosting.toFumadocsSource(),
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});

export const changelogSource = loader({
  baseUrl: "/changelog",
  source: changelog.toFumadocsSource(),
});

export const guidesSource = loader({
  baseUrl: "/guides",
  source: guides.toFumadocsSource(),
});

export const faqSource = loader({
  baseUrl: "/faq",
  source: faq.toFumadocsSource(),
});

export const integrationsSource = loader({
  baseUrl: "/integrations",
  source: integrations.toFumadocsSource(),
});

export const securitySource = loader({
  baseUrl: "/security",
  source: security.toFumadocsSource(),
});

export const librarySource = loader({
  baseUrl: "/library",
  source: library.toFumadocsSource(),
});

export const customersSource = loader({
  baseUrl: "/customers",
  source: customers.toFumadocsSource(),
});

export const handbookSource = loader({
  baseUrl: "/handbook",
  source: handbook.toFumadocsSource(),
});

export const marketingSource = loader({
  baseUrl: "",
  source: marketing.toFumadocsSource(),
});

/** Slugs that are single marketing pages (content/marketing/*.mdx) */
export const MARKETING_SLUGS = [
  "about",
  "careers",
  "cn",
  "community",
  "cookie-policy",
  "customers",
  "enterprise",
  "find-us",
  "imprint",
  "jp",
  "kr",
  "oss-friends",
  "press",
  "pricing",
  "pricing-self-host",
  "privacy",
  "research",
  "startups",
  "support",
  "talk-to-us",
  "terms",
  "watch-demo",
  "wrapped",
] as const;

const routeToSource: Record<
  string,
  { getPage: (slug: string[]) => unknown; generateParams: () => { slug: string[] }[]; baseUrl: string }
> = {
  "/blog":               { ...blogSource,          baseUrl: "/blog" },
  "/changelog":          { ...changelogSource,     baseUrl: "/changelog" },
  "/guides":             { ...guidesSource,         baseUrl: "/guides" },
  "/guides/videos":      { ...guidesSource,         baseUrl: "/guides" },
  "/guides/cookbook":    { ...guidesSource,         baseUrl: "/guides" },
  "/faq":                { ...faqSource,            baseUrl: "/faq" },
  "/faq/all":            { ...faqSource,            baseUrl: "/faq" },
  "/integrations":       { ...integrationsSource,   baseUrl: "/integrations" },
  "/security":           { ...securitySource,       baseUrl: "/security" },
  "/library":            { ...librarySource,        baseUrl: "/library" },
  "/customers":          { ...customersSource,      baseUrl: "/customers" },
  "/handbook":           { ...handbookSource,       baseUrl: "/handbook" },
  "/handbook/chapters":  { ...handbookSource,       baseUrl: "/handbook" },
  "/self-hosting":       { ...selfHostingSource,    baseUrl: "/self-hosting" },
};

export function getPagesForRoute(route: string) {
  const src = routeToSource[route];
  if (!src) return [];
  try {
    const params = src.generateParams();
    return params
      .map(({ slug }) => {
        const page = src.getPage(slug) as {
          data: { title?: string; description?: string; date?: string; tag?: string; [k: string]: unknown };
        } | undefined;
        if (!page) return null;
        const path = slug.length ? `/${slug.join("/")}` : "";
        return {
          route: `${src.baseUrl}${path}`,
          name: page.data?.title,
          title: page.data?.title,
          frontMatter: { ...page.data, date: (page.data as { date?: string })?.date },
        };
      })
      .filter(Boolean) as Array<{
        route: string;
        name?: string;
        title?: string;
        frontMatter?: Record<string, unknown>;
      }>;
  } catch {
    return [];
  }
}
