export type PostCrumb = {
  label: string;
  href?: string;
};

function titleCaseSlug(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Breadcrumbs for `/compare` and `/compare/[competitor]`. */
export function compareCrumbs(
  slug: string[],
  currentLabel?: string,
): PostCrumb[] {
  if (slug.length === 0) return [{ label: "Compare" }];
  return [
    { label: "Compare", href: "/compare" },
    { label: currentLabel || titleCaseSlug(slug[0]) },
  ];
}

/** Breadcrumbs for `/resources/engineering` and nested articles. */
export function resourcesCrumbs(slug: string[], title: string): PostCrumb[] {
  const folder = slug[0];
  const folderLabel = folder ? titleCaseSlug(folder) : "Resources";
  const folderHref = folder ? `/resources/${folder}` : "/resources/engineering";

  if (slug.length <= 1) {
    return [{ label: "Resources", href: folderHref }, { label: folderLabel }];
  }

  return [
    { label: "Resources", href: folderHref },
    { label: folderLabel, href: folderHref },
    { label: title },
  ];
}
