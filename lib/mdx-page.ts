import "server-only";
import type { Metadata } from "next";
import type { TOCItemType } from "fumadocs-core/toc";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import type { ComponentType } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnySource = {
  getPage: (slug: string[]) => any;
  getPages: () => any[];
  generateParams: () => { slug: string[] }[];
};

type LoadedPage = {
  page: any;
  toc: TOCItemType[];
  MDX: ComponentType<{ components?: Record<string, ComponentType> }>;
};

/**
 * Loads a page from a Fumadocs source by slug.
 * Returns the page, TOC items, and MDX component — or null if not found.
 */
export async function loadPage(
  source: AnySource,
  slug: string[],
): Promise<LoadedPage | null> {
  const page = source.getPage(slug);
  if (!page) return null;

  const data = page.data as any;
  const loaded =
    typeof data.load === "function"
      ? await data.load()
      : { body: data.body, toc: data.toc ?? [] };
  const toc: TOCItemType[] = loaded.toc ?? [];
  const MDX = loaded.body as ComponentType<{ components?: Record<string, ComponentType> }>;

  return { page, toc, MDX };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Builds Next.js Metadata for a section page.
 *
 * `opts.canonicalFallback` is consulted *after* `pageData.canonical` but *before*
 * the default `buildPageUrl(pagePath)` — i.e. a last-resort override. Use it for
 * computed canonicals (e.g. guides → cookbook mapping) without trampling an
 * explicit `canonical` field in frontmatter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildSectionMetadata(
  page: { data: any; url?: string },
  section: string,
  sectionTitle: string,
  slug: string[],
  opts?: { canonicalFallback?: string | null },
): Metadata {
  const pageData = page.data;
  const pagePath = `/${section}${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const canonicalUrl =
    pageData.canonical ?? opts?.canonicalFallback ?? buildPageUrl(pagePath);
  const seoTitle = pageData.seoTitle || page.data.title;
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
staticOgImage: pageData.ogImage,
  });
  const ogVideoUrl = pageData.ogVideo
    ? pageData.ogVideo.startsWith("http")
      ? pageData.ogVideo
      : buildPageUrl(pageData.ogVideo)
    : null;

  return {
    title: seoTitle,
    description: page.data.description ?? undefined,
    alternates: { canonical: canonicalUrl },
    ...(pageData.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      images: [{ url: ogImage }],
      url: canonicalUrl,
      ...(ogVideoUrl ? { videos: [{ url: ogVideoUrl }] } : {}),
    },
    twitter: { images: [{ url: ogImage }] },
  };
}

/**
 * Strip non-serializable values from page data for client context providers.
 */
export function primitiveOnly(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) =>
      v === null ||
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean" ||
      (Array.isArray(v) && v.every((item) => typeof item !== "function"))
    )
  );
}
