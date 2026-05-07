import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { changelogSource } from "@/lib/source";
import { loadPage, buildSectionMetadata, primitiveOnly } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { ContentColumns } from "@/components/layout";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { ChangelogFrontMatterProvider } from "@/components/changelog/ChangelogFrontMatterContext";
import type { ChangelogFrontMatter } from "@/components/changelog/ChangelogFrontMatterContext";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { PageFooterNav } from "@/components/PageFooterNav";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function ChangelogPostPage(props: PageProps) {
  const { slug } = await props.params;
  const result = await loadPage(changelogSource, slug);
  if (!result) notFound();
  const { page, MDX } = result;

  const frontMatter = primitiveOnly(
    page.data as unknown as Record<string, unknown>
  ) as ChangelogFrontMatter;

  const changelogPages = changelogSource
    .getPages()
    .filter((changelogPage) => changelogPage.url !== "/changelog")
    .sort(
      (a, b) =>
        new Date((a.data.date as string) ?? 0).getTime() -
        new Date((b.data.date as string) ?? 0).getTime(),
    )
    .map((changelogPage) => ({
      name: changelogPage.data.title,
      url: changelogPage.url,
    }));

  const currentIndex = changelogPages.findIndex(
    (changelogPage) => changelogPage.url === page.url,
  );

  const footerItems =
    currentIndex === -1
      ? undefined
      : {
        previous: changelogPages[currentIndex - 1],
        next: changelogPages[currentIndex + 1],
      };

  return (
    <ContentColumns footerClassName="xl:max-w-[680px]">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 md:px-0">
        <ChangelogFrontMatterProvider frontMatter={frontMatter}>
          <MainContentWrapper>
            <DocBodyChrome withProse>
              <MDX components={getMDXComponents()} />
            </DocBodyChrome>
          </MainContentWrapper>
          <PageFooterNav items={footerItems} className="mt-10" />
        </ChangelogFrontMatterProvider>
      </div>
    </ContentColumns>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = changelogSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "changelog", "Changelog", slug);
}

export function generateStaticParams() {
  return changelogSource.generateParams();
}
