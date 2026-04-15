import type { Metadata } from "next";
import { faqSource } from "@/lib/source";
import { buildOgImageUrl, buildPageUrl } from "@/lib/og-url";
import { DocsPage } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { DocsTocFooter } from "@/components/DocsTocFooter";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { getMDXComponents } from "@/mdx-components";
import type { ComponentType } from "react";
import { DocsAndPageFooter } from "@/components/DocsAndPageFooter";
import { FaqPreview } from "@/components/faq/FaqPreview";
import { formatTag } from "@/components/faq/FaqIndex";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FaqPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = faqSource.getPage(slug);

  if (!page && slug.length === 2 && slug[0] === "tag") {
    const tag = decodeURIComponent(slug[1]);
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

  if (!page) notFound();

  const { toc } = page.data;
  const MDX = page.data.body as ComponentType<{ components?: Record<string, ComponentType> }>;

  return (
    <DocsPage
      toc={toc}
      breadcrumb={{ includePage: true, includeRoot: true }}
      tableOfContent={{ footer: <DocsTocFooter pageTitle={page.data.title} /> }}
      footer={{ component: <DocsAndPageFooter /> }}
    >
      <DocBodyChrome withProse>
        <MDX components={getMDXComponents()} />
      </DocBodyChrome>
    </DocsPage>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug ?? [];
  const page = faqSource.getPage(slug);

  if (!page && slug.length === 2 && slug[0] === "tag") {
    const tag = decodeURIComponent(slug[1]);
    const title = `FAQ: ${formatTag(tag)}`;
    const canonicalUrl = buildPageUrl(`/faq/tag/${slug[1]}`);
    const ogImage = buildOgImageUrl({
      title,
      description: `Frequently asked questions about ${formatTag(tag)}.`,
      section: "FAQ",
    });
    return {
      title,
      description: `Frequently asked questions about ${formatTag(tag)}.`,
      alternates: { canonical: canonicalUrl },
      openGraph: { images: [{ url: ogImage }], url: canonicalUrl },
      twitter: { images: [{ url: ogImage }] },
    };
  }

  if (!page)
    return {
      title: "Not Found",
    };

  const pageData = page.data as typeof page.data & {
    canonical?: string | null;
    noindex?: boolean | null;
    seoTitle?: string | null;
    ogImage?: string | null;
    ogVideo?: string | null;
  };
  const pagePath = `/faq${slug.length > 0 ? `/${slug.join("/")}` : ""}`;
  const canonicalUrl = pageData.canonical ?? buildPageUrl(pagePath);
  const seoTitle = pageData.seoTitle || page.data.title;
  const ogImage = buildOgImageUrl({
    title: seoTitle,
    description: page.data.description,
    section: "FAQ",
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

export function generateStaticParams() {
  const params = [...faqSource.generateParams()];
  const allTags = new Set<string>();

  for (const p of faqSource.getPages()) {
    const tags = ((p.data as unknown as Record<string, unknown>).tags as string[] | undefined) ?? [];
    for (const tag of tags) {
      allTags.add(tag);
    }
  }

  for (const tag of Array.from(allTags)) {
    if (!faqSource.getPage(["tag", tag])) {
      params.push({ slug: ["tag", tag] } as (typeof params)[number]);
    }
  }

  return params;
}
