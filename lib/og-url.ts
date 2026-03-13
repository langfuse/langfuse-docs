const BASE_URL = "https://langfuse.com";

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
