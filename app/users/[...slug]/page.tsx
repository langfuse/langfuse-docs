import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { usersSource } from "@/lib/source";
import { loadPage, buildSectionMetadata } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";
import { DocBodyChrome } from "@/components/DocBodyChrome";
import { MainContentWrapper } from "@/components/MainContentWrapper";
import { ContentColumns } from "@/components/layout";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function UserStoryPage(props: PageProps) {
  const { slug } = await props.params;
  const result = await loadPage(usersSource, slug);
  if (!result) notFound();
  const { MDX } = result;
  const isAdoptersPage = slug.length === 1 && slug[0] === "adopters";

  return (
    <ContentColumns
      footerClassName={
        isAdoptersPage
          ? "md:max-w-none xl:max-w-none px-6 sm:px-6 md:px-6"
          : "xl:max-w-[680px]"
      }
    >
      <div
        className={cn(
          "mx-auto w-full",
          isAdoptersPage ? "" : "max-w-[680px] px-4 py-6 md:px-0",
        )}
      >
        <MainContentWrapper>
          <DocBodyChrome withProse={!isAdoptersPage}>
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
  return buildSectionMetadata(page, "users", "Customers", slug);
}

export function generateStaticParams() {
  return usersSource.generateParams().filter((p) => p.slug.length > 0);
}
