import "server-only";
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
        const page = selfHostingSource.getPage(slug) as { data?: ShortTitleData } | undefined;
        const label = page?.data?.shortTitle ?? page?.data?.sidebarTitle;
        if (typeof label === "string") {
          mapped.name = label;
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
type ShortTitleData = { shortTitle?: string; sidebarTitle?: string };

/** Slug from a page URL (e.g. "/integrations/other/claude-code" -> ["other", "claude-code"]). */
function slugFromUrl(url: string, baseUrl: string): string[] {
  const prefix = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  if (url === baseUrl || url === `${baseUrl}/`) return [];
  if (!url.startsWith(prefix)) return [];
  const rest = url.slice(prefix.length);
  return rest ? rest.split("/").filter(Boolean) : [];
}

/**
 * Walk a page tree and replace each node's `name` with `shortTitle ?? sidebarTitle`
 * when either field is set in the page's frontmatter. Falls back to the existing name.
 */
function applyShortTitles(
  nodes: TreeNode[],
  getPage: (slug: string[]) => { data?: ShortTitleData } | undefined,
  baseUrl: string
): TreeNode[] {
  return nodes.map((node) => {
    const mapped = { ...node };
    if (node.type === "page" && node.url) {
      const slug = slugFromUrl(node.url, baseUrl);
      const page = getPage(slug);
      const label = page?.data?.shortTitle ?? page?.data?.sidebarTitle;
      if (typeof label === "string") {
        mapped.name = label;
      }
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      mapped.children = applyShortTitles(node.children, getPage, baseUrl);
    }
    return mapped;
  });
}

/**
 * Returns a wrapped getPageTree() for any loader source that applies
 * shortTitle / sidebarTitle overrides to sidebar node names.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPageTreeWithShortTitles(src: { getPageTree: () => any; getPage: (slug: string[]) => any }, baseUrl: string) {
  const root = src.getPageTree();
  const children = (root as { children?: unknown[] }).children;
  if (!Array.isArray(children)) return root;
  return {
    ...root,
    children: applyShortTitles(children as TreeNode[], (slug) => src.getPage(slug), baseUrl),
  };
}

function mapIntegrationsTreeNodes(nodes: TreeNode[], baseUrl: string): TreeNode[] {
  return nodes.map((node) => {
    const mapped = { ...node };
    if (node.type === "page" && node.url) {
      const slug = slugFromUrl(node.url, baseUrl);
      if (slug.length > 0) {
        const page = integrationsSource.getPage(slug) as { data?: ShortTitleData } | undefined;
        const label = page?.data?.shortTitle ?? page?.data?.sidebarTitle;
        if (typeof label === "string") {
          mapped.name = label;
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

