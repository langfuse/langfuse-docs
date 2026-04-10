const BASE_URL = "https://langfuse.com";

/** Default site description; keep in sync with `app/layout.tsx` metadata.description. */
export const SITE_DEFAULT_OG_DESCRIPTION =
  "Traces, evals, prompt management and metrics to debug and improve your LLM application.";

/** Root layout default Open Graph / Twitter image (dynamic wordmark card). */
export function buildDefaultSiteOgImageUrl(): string {
  return `${BASE_URL}/api/og?${new URLSearchParams({
    title: "Langfuse – Open Source LLM Engineering Platform",
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
  section?: string;
  staticOgImage?: string | null;
}): string {
  if (staticOgImage) {
    return BASE_URL + staticOgImage;
  }
  const params = new URLSearchParams({ title });
  if (description) params.set("description", description);
  if (section) params.set("section", section);
  return `${BASE_URL}/api/og?${params.toString()}`;
}
