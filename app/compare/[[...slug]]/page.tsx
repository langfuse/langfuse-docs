import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compareSource } from "@/lib/source";
import { loadPage, buildSectionMetadata } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { PostArticleHeader } from "@/components/PostArticleHeader";
import { compareCrumbs } from "@/lib/post-crumbs";
import { ContentColumns } from "@/components/layout";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ComparePage({ params }: PageProps) {
  const { slug = [] } = await params;
  const result = await loadPage(compareSource, slug);
  if (!result) notFound();
  const { page, MDX } = result;
  const currentLabel = String(
    page.data.shortTitle ?? page.data.sidebarTitle ?? page.data.title ?? "",
  );

  return (
    <ContentColumns footerClassName="xl:max-w-[680px]">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 md:px-0">
        <MainContentWrapper showCopyButton={false}>
          <PostArticleHeader items={compareCrumbs(slug, currentLabel)} />
          <DocBodyChrome showCopyButton={false}>
            <MDX components={getMDXComponents()} />
          </DocBodyChrome>
        </MainContentWrapper>
      </div>
    </ContentColumns>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = compareSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "compare", "Compare", slug);
}

export function generateStaticParams() {
  return compareSource.generateParams();
}
