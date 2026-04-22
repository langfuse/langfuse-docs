import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { usersSource } from "@/lib/source";
import { loadPage, buildSectionMetadata } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { ContentColumns } from "@/components/layout";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function UserStoryPage(props: PageProps) {
  const { slug } = await props.params;
  const result = await loadPage(usersSource, slug);
  if (!result) notFound();
  const { MDX } = result;

  return (
    <ContentColumns footerClassName="xl:max-w-[680px]">
      <div className="mx-auto w-full max-w-[680px] px-4 py-6 md:px-0">
        <MainContentWrapper>
          <DocBodyChrome withProse>
            <MDX components={getMDXComponents()} />
          </DocBodyChrome>
        </MainContentWrapper>
      </div>
    </ContentColumns>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const page = usersSource.getPage(slug);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "users", "User stories", slug);
}

export function generateStaticParams() {
  return usersSource.generateParams().filter((p) => p.slug.length > 0);
}
