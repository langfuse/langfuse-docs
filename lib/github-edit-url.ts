import { existsSync } from "fs";
import path from "path";

const SECTION_TO_DIR: Record<string, string> = {
  docs: "content/docs",
  guides: "content/guides",
  handbook: "content/handbook",
  integrations: "content/integrations",
  "self-hosting": "content/self-hosting",
  library: "content/library",
  academy: "content/academy",
  resources: "content/resources",
};

/**
 * GitHub "edit this file" URL for a docs-chrome pathname.
 * Tries `<slug>.mdx` first, then `<slug>/index.mdx` (and the `.md`
 * variants), so folder landing pages such as /docs/observability resolve
 * to content/docs/observability/index.mdx instead of a missing
 * observability.mdx.
 */
export function getGithubEditUrl(urlPath: string): string | null {
  const cleanPath = urlPath.split("#")[0].split("?")[0];
  const [, section, ...slugParts] = cleanPath.split("/");

  const contentDir = SECTION_TO_DIR[section];
  if (!contentDir) return null;

  const slugPath = slugParts.join("/");
  const candidates =
    slugPath === ""
      ? [`${contentDir}/index.mdx`, `${contentDir}/index.md`]
      : [
          `${contentDir}/${slugPath}.mdx`,
          `${contentDir}/${slugPath}/index.mdx`,
          `${contentDir}/${slugPath}.md`,
          `${contentDir}/${slugPath}/index.md`,
        ];

  const filePath =
    candidates.find((candidate) =>
      existsSync(path.join(process.cwd(), candidate)),
    ) ?? candidates[0];

  return `https://github.com/langfuse/langfuse-docs/edit/main/${filePath}`;
}
