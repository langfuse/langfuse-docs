import { Text } from "@/components/ui/text";
import { formatDate } from "@/components/blog/utils";
import { HoverPostRow } from "@/components/lists/HoverPostRow";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ChangelogPageItem } from "@/lib/changelog-index";

export type { ChangelogPageItem };

export function ChangelogIndex({
  pages,
  currentPage,
  totalPages,
}: {
  pages: ChangelogPageItem[];
  currentPage: number;
  totalPages: number;
}) {
  const pageHref = (page: number) => {
    if (page === 0 || page > totalPages) return undefined;
    if (page === 1) return "/changelog";
    return `/changelog?page=${page}`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers: (number | null)[] = [];
    if (totalPages <= 5) {
      pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push(null);
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages)
        pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push(null);
      pageNumbers.push(totalPages);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent className="gap-1 items-center">
          <PaginationItem>
            <PaginationPrevious
              href={pageHref(currentPage - 1)}
              className="cursor-pointer select-none mt-0.25"
            />
          </PaginationItem>
          <div className="hidden gap-1 items-center sm:flex">
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === null ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={pageHref(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer select-none"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </div>
          <PaginationItem>
            <PaginationNext
              href={pageHref(currentPage + 1)}
              className="cursor-pointer select-none"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <section className="rounded-[2px] border border-line-structure bg-surface-bg overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line-structure">
          <h2 className="text-left font-analog font-medium text-[16px] text-text-primary shrink-0">
            All posts
          </h2>
        </div>
        <div className="divide-y divide-line-structure">
          {pages.map((page) => (
            <HoverPostRow
              key={page.route}
              href={page.route}
              tags={page.frontMatter?.badge ? [page.frontMatter.badge] : []}
              title={page.frontMatter?.title || page.name || ""}
              description={page.frontMatter?.description}
              metaRight={
                <Text
                  size="s"
                  className="text-left md:text-right text-[12px] text-text-tertiary whitespace-nowrap"
                >
                  {formatDate(page.frontMatter?.date)}
                </Text>
              }
              previewOnHover
              previewImage={
                page.frontMatter?.ogImage ?? page.frontMatter?.gif ?? null
              }
            />
          ))}
        </div>
      </section>
      {renderPagination()}
    </>
  );
}
