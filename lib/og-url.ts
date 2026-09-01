const BASE_URL = "https://langfuse.com";

function getStaticOgImageBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview") return BASE_URL;

  const previewUrl =
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL;

  return previewUrl ? `https://${previewUrl}` : BASE_URL;
}

/** Default site description; keep in sync with `lib/site-metadata.ts` description. */
export const SITE_DEFAULT_OG_DESCRIPTION =
  "Trace, evaluate, and improve AI agents with one open platform. Use production data to understand behavior, collaborate on fixes, and ship better quality at lower cost and latency.";

/** Root layout default Open Graph / Twitter image (dynamic wordmark card). */
export function buildDefaultSiteOgImageUrl(): string {
  return `${BASE_URL}/api/og?${new URLSearchParams({
    title: "Langfuse – Open Source Agent Evals & Observability",
    description: SITE_DEFAULT_OG_DESCRIPTION,
  }).toString()}`;
}

/** Returns the absolute canonical URL for a given site-relative path (e.g. "/docs/foo"). */
export function buildPageUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

export function buildOgImageUrl({
  title,
  description,
  section,
  staticOgImage,
}: {
  title: string;
  description?: string | null;
  section?: string | null;
  staticOgImage?: string | null;
}): string {
  if (staticOgImage) {
    return getStaticOgImageBaseUrl() + staticOgImage;
  }
  const params = new URLSearchParams({ title });
  if (description) params.set("description", description);
  if (section?.trim()) params.set("section", section.trim());
  return `${BASE_URL}/api/og?${params.toString()}`;
}
