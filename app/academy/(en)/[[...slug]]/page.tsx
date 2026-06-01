import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { academySource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function AcademyPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = academySource.getPage(slug);
  if (!page) notFound();
  return <DocsChromePage page={page} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = academySource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "academy", "Academy", slug, {
    languages: buildLocalizedAlternates({
      slug,
      defaultLocale: "en",
      routes: { en: "/academy", "ja-JP": "/academy/japan" },
    }),
  });
}

export function generateStaticParams() {
  return academySource.generateParams();
}
