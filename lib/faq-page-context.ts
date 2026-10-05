const LANGFUSE_DOCS_ORIGIN = "https://langfuse.com";
const MAX_URL_LENGTH = 2000;
const MAX_TITLE_LENGTH = 300;

export type FaqPageContextInput = {
  url?: string;
  title?: string;
};

export type TrustedFaqPageContext = {
  /** Canonical langfuse.com URL, including a section hash when present. */
  url: string;
  /** langfuse.com URL without query or hash, for getLangfuseDocsPage. */
  docsUrl: string;
  title?: string;
};

function parseHttpOrigin(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password
    ) {
      return url.origin;
    }
  } catch {
    // Invalid Host values are ignored.
  }
}

function isLangfuseDocsHost(hostname: string): boolean {
  return hostname === "langfuse.com" || hostname === "www.langfuse.com";
}

/**
 * Site origins that may send a current-page URL: langfuse.com plus this
 * request’s Host (localhost and preview deployments).
 *
 * Do not include the browser Origin header. A cross-site POST can set Origin
 * to an attacker site while Host remains the docs API.
 */
export function trustedPageOrigins(request: Request): Set<string> {
  const origins = new Set<string>([
    LANGFUSE_DOCS_ORIGIN,
    "https://www.langfuse.com",
  ]);

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    request.headers.get("host")?.trim();
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    (host?.startsWith("localhost") || host?.startsWith("127.")
      ? "http"
      : "https");

  if (host && !/[\s@/?#]/.test(host)) {
    const origin = parseHttpOrigin(`${proto}://${host}`);
    if (origin) origins.add(origin);
  }

  return origins;
}

function sanitizeTitle(title: string | undefined): string | undefined {
  if (!title) return undefined;
  const cleaned = title.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, MAX_TITLE_LENGTH);
}

/**
 * Accept only langfuse.com (or same-origin preview/localhost) page URLs.
 * Rewrites trusted URLs to https://langfuse.com so MCP fetches stay first-party.
 */
export function sanitizeFaqPageContext(
  input: FaqPageContextInput | undefined,
  origins: Iterable<string>,
): TrustedFaqPageContext | undefined {
  const rawUrl = input?.url?.trim();
  if (!rawUrl || rawUrl.length > MAX_URL_LENGTH) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return undefined;
  }

  if (parsed.username || parsed.password) return undefined;
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return undefined;
  }

  const langfuseHost = isLangfuseDocsHost(parsed.hostname);
  const sameOrigin = new Set(origins).has(parsed.origin);

  if (!langfuseHost && !sameOrigin) return undefined;
  if (langfuseHost && parsed.protocol !== "https:") return undefined;

  const pathname = parsed.pathname.replace(/\/+$/, "") || "/";
  const docsUrl = `${LANGFUSE_DOCS_ORIGIN}${pathname}`;
  const hash = parsed.hash.startsWith("#") ? parsed.hash : "";
  const url = hash ? `${docsUrl}${hash}` : docsUrl;

  return {
    url,
    docsUrl,
    title: sanitizeTitle(input?.title),
  };
}

/** System-instruction suffix so the FAQ model treats the user as being on this page. */
export function faqPageContextInstructions(
  page: TrustedFaqPageContext,
): string {
  const lines = [
    "The user is currently viewing this Langfuse documentation page:",
    `- URL: ${page.url}`,
  ];
  if (page.title) {
    lines.push(`- Browser-reported title: ${page.title}`);
  }
  lines.push(
    "When they ask which page they are on, what “this page”, “here”, or “this section” refers to, or what to check before changing something described on this page, treat that URL as the current page.",
    `Prefer the getLangfuseDocsPage tool with pathOrUrl "${page.docsUrl}" when you need this page’s content. Use searchLangfuseDocs for broader questions that are not about this page.`,
  );
  return lines.join("\n");
}
