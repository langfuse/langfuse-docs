import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SECTION_CONFIG, WIDE_SECTIONS } from "@/lib/sections";
import type { WideSectionSlug } from "@/lib/sections";
import { SectionDocBodyClient } from "@/app/[section]/SectionDocBodyClient";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";

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
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
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

  return (
    <SectionDocBodyClient
      collection={config.collection}
      slugPromise={Promise.resolve({ slug: [section] })}
    />
  );
}
