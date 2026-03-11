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
  pageTree: { idPrefix: "docs" },
});

export const selfHostingSource = loader({
  baseUrl: "/self-hosting",
  source: selfHosting.toFumadocsSource(),
  pageTree: { idPrefix: "self-hosting" },
});

const SELF_HOSTING_BASE = "/self-hosting";

/** Display names for self-hosting sidebar links to main docs (avoid duplicate "Overview"). */
const SELF_HOSTING_DOC_LINK_NAMES: Record<string, string> = {
  "/docs/administration/rbac": "RBAC (main docs)",
  "/docs/administration/data-retention": "Data Retention (main docs)",
};

function mapSelfHostingTreeNodes(nodes: TreeNode[], baseUrl: string): TreeNode[] {
  return nodes.map((node) => {
    const mapped = { ...node };
    if (node.type === "page" && node.url) {
      const docLinkName = SELF_HOSTING_DOC_LINK_NAMES[node.url];
      if (typeof docLinkName === "string") {
        mapped.name = docLinkName;
      } else {
        const slug = slugFromUrl(node.url, baseUrl);
        const page = selfHostingSource.getPage(slug) as { data?: { sidebarTitle?: string } } | undefined;
        const sidebarTitle = page?.data?.sidebarTitle;
        if (typeof sidebarTitle === "string") {
          mapped.name = sidebarTitle;
        }
      }
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      mapped.children = mapSelfHostingTreeNodes(node.children, baseUrl);
    }
    return mapped;
  });
}

export function getSelfHostingPageTree(): ReturnType<typeof selfHostingSource.getPageTree> {
  const root = selfHostingSource.getPageTree();
  const children = (root as { children?: unknown[] }).children;
  if (!Array.isArray(children)) return root;
  return {
    ...root,
    children: mapSelfHostingTreeNodes(children as TreeNode[], SELF_HOSTING_BASE),
  } as ReturnType<typeof selfHostingSource.getPageTree>;
}

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
  pageTree: { idPrefix: "guides" },
});

export const faqSource = loader({
  baseUrl: "/faq",
  source: faq.toFumadocsSource(),
});

export const integrationsSource = loader({
  baseUrl: "/integrations",
  source: integrations.toFumadocsSource(),
  pageTree: { idPrefix: "integrations" },
});

const INTEGRATIONS_BASE = "/integrations";

type TreeNode = { type?: string; name?: string; url?: string; children?: TreeNode[]; [key: string]: unknown };

/** Slug from a page URL (e.g. "/integrations/other/claude-code" -> ["other", "claude-code"]). */
function slugFromUrl(url: string, baseUrl: string): string[] {
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  if (url === baseUrl || url === `${baseUrl}/`) return [];
  if (!url.startsWith(prefix)) return [];
  const rest = url.slice(prefix.length);
  return rest ? rest.split("/").filter(Boolean) : [];
}

function mapIntegrationsTreeNodes(nodes: TreeNode[], baseUrl: string): TreeNode[] {
  return nodes.map((node) => {
    const mapped = { ...node };
    if (node.type === "page" && node.url) {
      const slug = slugFromUrl(node.url, baseUrl);
      if (slug.length > 0) {
        const page = integrationsSource.getPage(slug) as { data?: { sidebarTitle?: string } } | undefined;
        const sidebarTitle = page?.data?.sidebarTitle;
        if (typeof sidebarTitle === "string") {
          mapped.name = sidebarTitle;
        }
      }
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      mapped.children = mapIntegrationsTreeNodes(node.children, baseUrl);
    }
    return mapped;
  });
}

/**
 * Integrations page tree with sidebar names replaced by frontmatter `sidebarTitle` when set,
 * so the sidebar shows short names (e.g. "Claude Code") instead of long titles.
 * Returns the same shape as integrationsSource.getPageTree() (Root with name + children).
 */
export function getIntegrationsPageTree(): ReturnType<typeof integrationsSource.getPageTree> {
  const root = integrationsSource.getPageTree();
  const children = (root as { children?: unknown[] }).children;
  if (!Array.isArray(children)) return root;
  return {
    ...root,
    children: mapIntegrationsTreeNodes(children as TreeNode[], INTEGRATIONS_BASE),
  } as ReturnType<typeof integrationsSource.getPageTree>;
}

export const securitySource = loader({
  baseUrl: "/security",
  source: security.toFumadocsSource(),
});

export const librarySource = loader({
  baseUrl: "/library",
  source: library.toFumadocsSource(),
  pageTree: { idPrefix: "library" },
});

export const usersSource = loader({
  baseUrl: "/users",
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
  "/users":              { ...usersSource,           baseUrl: "/users" },
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
