import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";
import { Video } from "../Video";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const ChangelogIndex = ({
  itemsPerPage = 50,
}: {
  itemsPerPage?: number;
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  const allPages = (
    getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>
  ).sort(
    (a, b) =>
      new Date(b.frontMatter.date).getTime() -
      new Date(a.frontMatter.date).getTime()
  );

  const totalPages = Math.ceil(allPages.length / itemsPerPage);
  const paginatedPages = allPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      pageNumbers.push(...Array.from({ length: totalPages }, (_, i) => i + 1));
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push(null); // Ellipsis
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages)
        pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push(null); // Ellipsis
      pageNumbers.push(totalPages);
    }

    const pageHref = (page: number) => {
      if (page === 0 || page > totalPages) return;
      if (page === 1) {
        return "/changelog";
      }
      return `/changelog?page=${page}`;
    };

    return (
      <Pagination className="mt-8">
        <Head>
          {currentPage > 1 && (
            <link rel="prev" href={pageHref(currentPage - 1)} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={pageHref(currentPage + 1)} />
          )}
        </Head>
        <PaginationContent className="gap-1 items-center">
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              href={pageHref(currentPage - 1)}
              className="cursor-pointer select-none"
            />
          </PaginationItem>
          <div className="hidden sm:flex gap-1 items-center">
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
                    size="sm"
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
              size="sm"
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
      <div className="mt-12 max-w-6xl mx-auto divide-y divide-primary/10 border-b border-primary/10">
        {paginatedPages.map((page, i) => (
          <div
            className="md:grid md:grid-cols-4 md:gap-5 py-16 transition-all"
            id={page.route.replace("/changelog/", "")}
            key={page.route.replace("/changelog/", "")}
          >
            <div className="hidden md:flex opacity-80 text-lg group-hover:opacity-100 sticky top-24 self-start flex-col items-start gap-2">
              {page.frontMatter?.date
                ? new Date(page.frontMatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })
                : null}
              {page.frontMatter?.badge && (
                <div className="hidden md:inline-block px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded-sm mb-5">
                  {page.frontMatter.badge}
                </div>
              )}
            </div>
            <div className="md:col-span-3">
              <Link key={page.route} href={page.route} className="block group">
                {page.frontMatter?.ogVideo ? (
                  <Video
                    src={page.frontMatter.ogVideo}
                    aspectRatio={16 / 9}
                    gifStyle
                    className="mb-14 rounded relative overflow-hidden shadow-md group-hover:shadow-lg ring-0 border-0"
                  />
                ) : page.frontMatter?.ogImage ? (
                  <div className="mb-14 rounded relative aspect-video overflow-hidden shadow-md group-hover:shadow-lg border">
                    <Image
                      src={page.frontMatter.gif ?? page.frontMatter.ogImage}
                      className="object-cover"
                      alt={page.frontMatter?.title ?? "Blog post image"}
                      fill={true}
                      sizes="(min-width: 1024px) 1000px, 100vw"
                      priority={i < 3}
                      unoptimized={
                        page.frontMatter.gif !== undefined ||
                        page.frontMatter.ogImage?.endsWith(".gif")
                      }
                    />
                  </div>
                ) : null}
                <div className="md:hidden opacity-80 text-sm mb-4 group-hover:opacity-100">
                  {page.frontMatter?.date
                    ? new Date(page.frontMatter.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        }
                      )
                    : null}
                  {page.frontMatter?.badge && (
                    <div className="inline-block px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded-sm ml-3">
                      {page.frontMatter.badge}
                    </div>
                  )}
                </div>
                <h2 className="block font-mono text-2xl md:text-3xl opacity-90 group-hover:opacity-100">
                  {page.meta?.title || page.frontMatter?.title || page.name}
                </h2>
                <div className="opacity-80 mt-4 text-lg group-hover:opacity-100">
                  {page.frontMatter?.description}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </>
  );
};
