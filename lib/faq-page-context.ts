const LANGFUSE_DOCS_ORIGIN = "https://langfuse.com";
const MAX_URL_LENGTH = 2000;

export type TrustedFaqPageUrl = {
  /** Canonical langfuse.com URL, including a section hash when present. */
  url: string;
  /** langfuse.com URL without query or hash, for getLangfuseDocsPage. */
  docsUrl: string;
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

/**
 * Accept only langfuse.com (or same-origin preview/localhost) page URLs.
 * Rewrites trusted URLs to https://langfuse.com so MCP fetches stay first-party.
 */
export function sanitizeFaqPageUrl(
  rawUrl: string | undefined,
  origins: Iterable<string>,
): TrustedFaqPageUrl | undefined {
  const trimmed = rawUrl?.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
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

  return { url, docsUrl };
}

/** System-instruction suffix so the FAQ model sees the current page URL. */
export function faqPageContextInstructions(page: TrustedFaqPageUrl): string {
  return [
    "The user is currently viewing this Langfuse documentation page:",
    `- URL: ${page.url}`,
  ].join("\n");
}
