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

/**
 * Transformer that re-types meta.json link shortcuts (e.g. `[Text](url)`) from
 * `type: "page"` to `type: "link"`.
 *
 * Without this, fumadocs' `searchPath` walks the tree depth-first and stops at
 * the first node whose URL matches the current pathname. A shortcut link placed
 * near the top of the tree can be found before the real page node nested inside
 * a folder, so `searchPath` returns a path that contains no folder ancestors —
 * meaning those folders never expand in the sidebar.
 *
 * Changing the type to "link" makes `searchPath` skip these nodes (its matcher
 * is `node.type === "page"`), so the real page node inside the folder is found
 * and its ancestor folders open correctly. The shortcut still renders as a
 * clickable sidebar link and still shows as visually active via the direct
 * `isActive(url, pathname)` comparison in the sidebar item renderer.
 *
 * Link shortcut nodes have no backing MDX file, so `filePath` is `undefined` in
 * the transformer — that is how they are distinguished from real content pages.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortcutLinkTransformer: any = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file(node: any, filePath?: string): any {
    // Only link shortcuts have no backing file
    if (filePath) return node;
    return { ...node, type: "link" };
  },
};

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  pageTree: {
    idPrefix: "docs",
    transformers: [shortcutLinkTransformer, shortTitleTransformer],
  },
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
