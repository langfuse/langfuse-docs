import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTION_CONFIG, WIDE_SECTIONS } from "@/lib/source";
import type { WideSectionSlug } from "@/lib/source";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import { getMDXComponents } from "@/mdx-components";
import type { ComponentType } from "react";

export async function generateWideSectionMetadata(section: WideSectionSlug): Promise<Metadata> {
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage([section]);
  if (!page) return { title: "Not Found" };
  const pageData = page.data as typeof page.data & {
    seoTitle?: string | null;
    ogImage?: string | null;
  };
  const canonicalUrl = buildPageUrl(`/${section}`);
  const seoTitle = pageData.seoTitle || page.data.title;
  const sectionTitle = config.title ?? seoTitle;
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
    section: sectionTitle,
    staticOgImage: pageData.ogImage,
  });
  return {
    title: seoTitle,
    description: page.data.description ?? undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: { images: [{ url: ogImage }], url: canonicalUrl },
    twitter: { images: [{ url: ogImage }] },
  };
}

type Props = { section: WideSectionSlug };

export default async function WideSectionPage({ section }: Props) {
  if (!WIDE_SECTIONS.has(section)) notFound();
  const config = SECTION_CONFIG[section as keyof typeof SECTION_CONFIG];
  const page = config.source.getPage([section]);
  if (!page) notFound();

  const data = page.data as {
    load?: () => Promise<{ body: unknown }>;
    body?: unknown;
  };
  const body =
    typeof data.load === "function" ? (await data.load()).body : data.body;
  const MDX = body as ComponentType<{ components?: Record<string, ComponentType> }>;

  return (
    <div className="flex-1">
      <MDX components={getMDXComponents()} />
    </div>
  );
}
