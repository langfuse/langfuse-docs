import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { academyJaSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function JaAcademyPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = academyJaSource.getPage(slug);
  if (!page) notFound();
  return (
    <DocsChromePage
      page={page}
      bodyChromeProps={{ lang: "ja" }}
      bottomSuffix={
        <div className="mt-10 text-right text-xs italic text-fd-muted-foreground">
          Translation by{" "}
          <a
            href="https://gao-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-1 hover:no-underline"
          >
            GAO, Inc.
          </a>
        </div>
      }
    />
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = academyJaSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "academy/japan", "Academy", slug, {
    languages: buildLocalizedAlternates({
      slug,
      defaultLocale: "en",
      routes: { en: "/academy", "ja-JP": "/academy/japan" },
    }),
  });
}

export function generateStaticParams() {
  return academyJaSource
    .generateParams()
    .map((p) => (p.slug.length > 0 ? { slug: p.slug } : {}));
}
