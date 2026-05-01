import type { Metadata } from "next";
import { ChangelogIndex } from "@/components/changelog/ChangelogIndex";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";
import {
  CHANGELOG_ITEMS_PER_PAGE,
  changelogPageHref,
  getChangelogIndexItems,
  parseChangelogPageParam,
} from "@/lib/changelog-index";
import { ContentColumns } from "@/components/layout";
import { TextHighlight } from "@/components/ui/text-highlight";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const all = getChangelogIndexItems();
  const totalPages = Math.max(
    1,
    Math.ceil(all.length / CHANGELOG_ITEMS_PER_PAGE)
  );
  const currentPage = parseChangelogPageParam(sp.page, totalPages);
  const canonical = changelogPageHref(currentPage, totalPages) ?? "/changelog";

  return {
    alternates: {
      canonical,
    },
    pagination: {
      ...(currentPage > 1 && {
        previous: changelogPageHref(currentPage - 1, totalPages),
      }),
      ...(currentPage < totalPages && {
        next: changelogPageHref(currentPage + 1, totalPages),
      }),
    },
  };
}

export default async function ChangelogIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const allPages = getChangelogIndexItems();
  const totalPages = Math.max(
    1,
    Math.ceil(allPages.length / CHANGELOG_ITEMS_PER_PAGE)
  );
  const currentPage = parseChangelogPageParam(sp.page, totalPages);
  const sliceStart = (currentPage - 1) * CHANGELOG_ITEMS_PER_PAGE;
  const pages = allPages.slice(
    sliceStart,
    sliceStart + CHANGELOG_ITEMS_PER_PAGE
  );

  return (
    <ContentColumns footerClassName="md:max-w-none xl:max-w-none px-6 sm:px-6 md:px-6">
      <div className="mx-auto w-full px-6 py-8">
        <div className="flex flex-col gap-4 mb-4">
          <Heading as="h1" size="large">
            <TextHighlight>Changelog</TextHighlight>
          </Heading>
          <Text className="text-left">
            Latest release updates from the Langfuse team. Check out our{" "}
            <Link href="/docs/roadmap" variant="text">
              Roadmap
            </Link>{" "}
            to see what&apos;s next.
          </Text>
        </div>
        <div className="mb-8">
          <ProductUpdateSignup source="changelog" />
        </div>
        <ChangelogIndex
          pages={pages}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </ContentColumns>
  );
}
