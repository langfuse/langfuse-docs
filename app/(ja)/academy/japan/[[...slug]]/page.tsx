import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { academyJaSource, academySource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildLocalizedAlternates } from "@/lib/localization";
import { TranslationNotice } from "@/components/academy/japan/TranslationNotice";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function JaAcademyPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = academyJaSource.getPage(slug);
  if (!page) notFound();
  // Only the Academy intro page (empty slug) shows the translation credit.
  const isIntroPage = slug.length === 0;
  // The Japanese pages are synced in batches, so they trail the English source.
  // Every page states the snapshot it was translated from and links the original.
  const englishHref = academySource.getPage(slug)
    ? `/academy${slug.length ? `/${slug.join("/")}` : ""}`
    : undefined;
  return (
    <DocsChromePage
      page={page}
      bodyChromeProps={{ lang: "ja" }}
      topPrefix={
        <TranslationNotice
          translatedAt={page.data.translatedAt}
          englishHref={englishHref}
        />
      }
      bottomSuffix={
        isIntroPage ? (
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
        ) : undefined
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
  const hasEnglishPage = Boolean(academySource.getPage(slug));

  return buildSectionMetadata(page, "academy/japan", "Academy", slug, {
    languages: buildLocalizedAlternates({
      slug,
      defaultLocale: "en",
      routes: {
        ...(hasEnglishPage ? { en: "/academy" } : {}),
        "ja-JP": "/academy/japan",
      },
    }),
  });
}

export function generateStaticParams() {
  return academyJaSource
    .generateParams()
    .map((p) => (p.slug.length > 0 ? { slug: p.slug } : {}));
}
