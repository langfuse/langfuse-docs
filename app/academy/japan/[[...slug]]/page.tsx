import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { academyJaSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";

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
      bottomSuffix={
        <div className="mt-10 text-right text-xs italic text-fd-muted-foreground">
          Translation by{" "}
          <a
            href="https://gao-ai.com"
            target="_blank"
            rel="noopener"
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
  return buildSectionMetadata(page, "academy/japan", "Academy", slug);
}

export function generateStaticParams() {
  return academyJaSource
    .generateParams()
    .map((p) => (p.slug.length > 0 ? { slug: p.slug } : {}));
}
