import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqSource } from "@/lib/source";
import { DocsChromePage } from "@/components/DocsChromePage";
import { buildSectionMetadata } from "@/lib/mdx-page";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { FaqPreview } from "@/components/faq/FaqPreview";
import { formatTag } from "@/components/faq/FaqIndex";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

/** Parses `/faq/tag/<tag>` — a virtual route with no MDX file behind it. */
function parseTagSlug(slug: string[]): string | null {
  if (slug.length === 2 && slug[0] === "tag") {
    return decodeURIComponent(slug[1]);
  }
  return null;
}

export default async function FaqPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = faqSource.getPage(slug);

  if (page) return <DocsChromePage page={page} />;

  const tag = parseTagSlug(slug);
  if (tag) {
    return (
      <DocsPage
        toc={[]}
        breadcrumb={{ includePage: true, includeRoot: true }}
        tableOfContent={{ footer: undefined }}
      >
        <DocBodyChrome withProse>
          <h1>FAQ: {formatTag(tag)}</h1>
          <FaqPreview tags={[tag]} />
        </DocBodyChrome>
      </DocsPage>
    );
  }

  notFound();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = faqSource.getPage(slug);
  if (page) return buildSectionMetadata(page, "faq", "FAQ", slug);

  const tag = parseTagSlug(slug);
  if (tag) {
    const title = `FAQ: ${formatTag(tag)}`;
    const description = `Frequently asked questions about ${formatTag(tag)}.`;
    const canonicalUrl = buildPageUrl(`/faq/tag/${slug[1]}`);
    const ogImage = buildOgImageUrl({ title, description, section: "FAQ" });
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: { images: [{ url: ogImage }], url: canonicalUrl },
      twitter: { images: [{ url: ogImage }] },
    };
  }

  return { title: "Not Found" };
}

export function generateStaticParams() {
  const params = [...faqSource.generateParams()];
  const allTags = new Set<string>();
  for (const p of faqSource.getPages()) {
    const tags =
      ((p.data as unknown as Record<string, unknown>).tags as
        | string[]
        | undefined) ?? [];
    for (const tag of tags) allTags.add(tag);
  }
  for (const tag of Array.from(allTags)) {
    if (!faqSource.getPage(["tag", tag])) {
      params.push({ slug: ["tag", tag] } as (typeof params)[number]);
    }
  }
  return params;
}
