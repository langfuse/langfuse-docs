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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Display names for self-hosting sidebar links that cross-reference main docs pages. */
const SELF_HOSTING_DOC_LINK_NAMES: Record<string, string> = {
  "/docs/administration/rbac": "RBAC (main docs)",
  "/docs/administration/data-retention": "Data Retention (main docs)",
};

/** Shared page-tree transformer that replaces a node's sidebar name with
shortTitle ?? sidebarTitle from frontmatter when either field is set.
Registered via pageTree.transformers in each loader so layouts call
.getPageTree() directly with no post-processing required. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortTitleTransformer: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file(node: any, filePath?: string): any {
    if (!filePath) return node;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = (this as any).storage.read(filePath) as
      | { data?: { shortTitle?: string; sidebarTitle?: string } }
      | undefined;
    if (!page) return node;
    const label = page.data?.shortTitle ?? page.data?.sidebarTitle;
    return typeof label === "string" ? { ...node, name: label } : node;
  },
};

type TreeNode = {
  type?: string;
  name?: string;
  url?: string;
  children?: TreeNode[];
  [key: string]: unknown;
};

function mapSelfHostingTreeNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => {
    const mapped = { ...node };
    if (node.type === "page" && node.url) {
      const docLinkName = SELF_HOSTING_DOC_LINK_NAMES[node.url];
      if (typeof docLinkName === "string") {
        mapped.name = docLinkName;
      }
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      mapped.children = mapSelfHostingTreeNodes(node.children);
    }
    return mapped;
  });
}

/**
 * Self-hosting page tree with cross-doc link names overridden.
 * shortTitle / sidebarTitle overrides are handled by the loader transformer.
 */
export function getSelfHostingPageTree(): ReturnType<
  typeof selfHostingSource.getPageTree
> {
  const root = selfHostingSource.getPageTree();
  const children = (root as { children?: unknown[] }).children;
  if (!Array.isArray(children)) return root;
  return {
    ...root,
    children: mapSelfHostingTreeNodes(children as TreeNode[]),
  } as ReturnType<typeof selfHostingSource.getPageTree>;
}

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  pageTree: { idPrefix: "docs", transformers: [shortTitleTransformer] },
});

export const selfHostingSource = loader({
  baseUrl: "/self-hosting",
  source: selfHosting.toFumadocsSource(),
  pageTree: { idPrefix: "self-hosting", transformers: [shortTitleTransformer] },
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
  pageTree: { idPrefix: "guides", transformers: [shortTitleTransformer] },
});

export const faqSource = loader({
  baseUrl: "/faq",
  source: faq.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const integrationsSource = loader({
  baseUrl: "/integrations",
  source: integrations.toFumadocsSource(),
  pageTree: { idPrefix: "integrations", transformers: [shortTitleTransformer] },
});

export const securitySource = loader({
  baseUrl: "/security",
  source: security.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const librarySource = loader({
  baseUrl: "/library",
  source: library.toFumadocsSource(),
  pageTree: { idPrefix: "library", transformers: [shortTitleTransformer] },
});

export const usersSource = loader({
  baseUrl: "/users",
  source: customers.toFumadocsSource(),
});

export const handbookSource = loader({
  baseUrl: "/handbook",
  source: handbook.toFumadocsSource(),
  pageTree: { transformers: [shortTitleTransformer] },
});

export const marketingSource = loader({
  baseUrl: "",
  source: marketing.toFumadocsSource(),
});
