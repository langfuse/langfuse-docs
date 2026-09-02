import { visit } from "unist-util-visit";

export type GitHubReadmeSource = {
  owner: string;
  repo: string;
  ref: string;
  filePath: string;
  blobFileUrl: string;
  rawFileUrl: string;
};

/**
 * Parse a raw.githubusercontent.com README URL into GitHub blob/raw bases
 * used to resolve relative README links and images.
 */
export function parseGitHubRawReadmeUrl(
  rawUrl: string,
): GitHubReadmeSource | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "raw.githubusercontent.com") return null;

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length < 3) return null;

    const [owner, repo, ...rest] = segments;
    let ref: string;
    let filePath: string;

    if (
      rest[0] === "refs" &&
      (rest[1] === "heads" || rest[1] === "tags") &&
      rest.length >= 4
    ) {
      ref = rest[2];
      filePath = rest.slice(3).join("/");
    } else {
      ref = rest[0];
      filePath = rest.slice(1).join("/");
    }

    if (!owner || !repo || !ref || !filePath) return null;

    return {
      owner,
      repo,
      ref,
      filePath,
      blobFileUrl: `https://github.com/${owner}/${repo}/blob/${ref}/${filePath}`,
      rawFileUrl: `${url.origin}${url.pathname}`,
    };
  } catch {
    return null;
  }
}

export function shouldRewriteReadmeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("#") || trimmed.startsWith("//")) return false;
  // Already has a scheme (https:, mailto:, tel:, …)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return false;
  return true;
}

export function resolveReadmeUrl(url: string, baseUrl: string): string {
  if (!shouldRewriteReadmeUrl(url)) return url;
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function getHtmlAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(
    new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/**
 * Convert HTML <img> tags to markdown images so react-markdown can render
 * them. Leaves fenced/inline code alone.
 */
export function htmlImagesToMarkdown(content: string): string {
  return content
    .split(/(```[\s\S]*?```|`[^`\n]+`)/)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part.replace(/<img\b([^>]*?)\/?\s*>/gi, (full, attrs: string) => {
        const src = getHtmlAttr(attrs, "src");
        if (!src) return full;
        const alt = (getHtmlAttr(attrs, "alt") ?? "").replace(/[[\]]/g, "");
        return `![${alt}](${src})`;
      });
    })
    .join("");
}

/**
 * Remark plugin that rewrites relative README links to GitHub blob URLs
 * and relative images to raw.githubusercontent.com URLs.
 */
export function remarkRewriteGitHubReadmeUrls(sourceUrl?: string) {
  const source = sourceUrl ? parseGitHubRawReadmeUrl(sourceUrl) : null;

  return function remarkRewriteGitHubReadmeUrlsPlugin() {
    return function transformer(tree: unknown) {
      if (!source) return;

      visit(
        tree as Parameters<typeof visit>[0],
        (node: { type: string; url?: string }) => {
          if (
            node.type !== "link" &&
            node.type !== "image" &&
            node.type !== "definition"
          ) {
            return;
          }
          if (typeof node.url !== "string") return;

          const base =
            node.type === "image" ? source.rawFileUrl : source.blobFileUrl;
          node.url = resolveReadmeUrl(node.url, base);
        },
      );
    };
  };
}
