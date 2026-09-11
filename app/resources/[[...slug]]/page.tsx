import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resourcesSource } from "@/lib/source";
import { loadPage, buildSectionMetadata } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { PostArticleHeader } from "@/components/PostArticleHeader";
import { resourcesCrumbs } from "@/lib/post-crumbs";
import { ContentColumns } from "@/components/layout";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function ResourcesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const result = await loadPage(resourcesSource, slug);
  if (!result) notFound();
  const { page, MDX } = result;
  const title = String(page.data.title ?? "");

  return (
    <ContentColumns footerClassName="xl:max-w-[680px]">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 md:px-0">
        <MainContentWrapper showCopyButton={false}>
          <PostArticleHeader items={resourcesCrumbs(slug, title)} />
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
  const page = resourcesSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "resources", "Resources", slug);
}

export function generateStaticParams() {
  return resourcesSource.generateParams();
}
