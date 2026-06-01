import type { Metadata } from "next";
import { buildPageUrl } from "@/lib/og-url";

type Languages = NonNullable<Metadata["alternates"]>["languages"];

export function buildLocalizedAlternates({
  slug = [],
  defaultLocale,
  routes,
}: {
  slug?: string[];
  defaultLocale: string;
  routes: Record<string, string>;
}): Languages {
  const slugPath = slug.length > 0 ? `/${slug.join("/")}` : "";
  const languages: Record<string, string> = {};

  for (const [locale, basePath] of Object.entries(routes)) {
    languages[locale] = buildPageUrl(`${basePath}${slugPath}`);
  }

  languages["x-default"] = languages[defaultLocale];

  return languages;
}
