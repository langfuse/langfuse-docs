import "server-only";

import { PRODUCT_OVERVIEW_PATHS } from "@/lib/product-overview-paths";

const SECTION_TO_DIR: Record<string, string> = {
  docs: "content/docs",
  guides: "content/guides",
  handbook: "content/handbook",
  integrations: "content/integrations",
  "self-hosting": "content/self-hosting",
  library: "content/library",
  academy: "content/academy",
  resources: "content/resources",
  faq: "content/faq",
  security: "content/security",
};

/**
 * Folder landings whose source is `{slug}/index.mdx`, not `{slug}.mdx`.
 * Keep this in sync when adding a new folder `index.mdx`. Do not use `fs`
 * here: this module is imported from every docs-chrome page and a Node
 * builtin import has failed Vercel preview tracing on this branch.
 */
const FOLDER_INDEX_PATHS = new Set<string>([
  ...PRODUCT_OVERVIEW_PATHS,
  "/docs/observability/sdk/upgrade-path",
  "/faq",
  "/faq/all",
  "/guides",
  "/guides/cookbook",
  "/guides/videos",
  "/academy",
  "/academy/monitoring",
  "/academy/evaluate",
  "/academy/examples",
  "/academy/datasets",
  "/academy/japan",
  "/academy/japan/monitoring",
  "/academy/japan/evaluate",
  "/academy/japan/examples",
  "/academy/japan/datasets",
  "/handbook",
  "/integrations",
  "/integrations/native/opentelemetry",
  "/library",
  "/security",
  "/self-hosting",
  "/self-hosting/configuration",
  "/self-hosting/administration",
  "/self-hosting/v2",
  "/self-hosting/upgrade",
  "/resources/engineering",
]);

/**
 * GitHub "edit this file" URL for a docs-chrome pathname.
 * Folder landings such as /docs/observability resolve to
 * content/docs/observability/index.mdx instead of a missing observability.mdx.
 */
export function getGithubEditUrl(urlPath: string): string | null {
  const cleanPath = urlPath.split("#")[0].split("?")[0];
  const [, section] = cleanPath.split("/");

  const contentDir = SECTION_TO_DIR[section];
  if (!contentDir) return null;

  const slugPath = cleanPath.slice(section.length + 2);
  const filePath = FOLDER_INDEX_PATHS.has(cleanPath)
    ? slugPath === ""
      ? `${contentDir}/index.mdx`
      : `${contentDir}/${slugPath}/index.mdx`
    : `${contentDir}/${slugPath}.mdx`;

  return `https://github.com/langfuse/langfuse-docs/edit/main/${filePath}`;
}
