"use client";

import Link from "next/link";
import { Video } from "../Video";
import { useSearchParams } from "next/navigation";
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
import Image from "next/image";

export type ChangelogPageItem = {
  route: string;
  name?: string;
  title?: string;
  frontMatter?: {
    date?: string;
    title?: string;
    description?: string;
    badge?: React.ReactNode;
    ogVideo?: string;
    ogImage?: string;
    gif?: string;
    [key: string]: unknown;
  };
};

export const ChangelogIndex = ({
  pages: initialPages,
  itemsPerPage = 50,
}: {
  pages: ChangelogPageItem[];
  itemsPerPage?: number;
}) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  const allPages = initialPages;
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
      <div className="mx-auto mt-12 max-w-6xl border-b divide-y divide-primary/10 border-primary/10">
        {paginatedPages.map((page, i) => (
          <div
            className="py-16 transition-all md:grid md:grid-cols-4 md:gap-5"
            id={page.route.replace("/changelog/", "")}
            key={page.route.replace("/changelog/", "")}
          >
            <div className="hidden sticky top-24 flex-col gap-2 items-start self-start text-lg opacity-80 md:flex group-hover:opacity-100">
              {page.frontMatter?.date
                ? new Date(page.frontMatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })
                : null}
              {page.frontMatter?.badge && (
                <div className="hidden px-2 py-1 mb-5 text-xs font-bold rounded-sm md:inline-block bg-primary/10 text-primary">
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
                    className="overflow-hidden relative mb-14 rounded border-0 ring-0 shadow-md group-hover:shadow-lg"
                  />
                ) : page.frontMatter?.ogImage ? (
                  <div className="overflow-hidden relative mb-14 rounded border shadow-md aspect-video group-hover:shadow-lg">
                    <Image
                      src={(page.frontMatter.gif ?? page.frontMatter.ogImage) as string}
                      className="object-cover"
                      alt={(page.frontMatter?.title ?? "Blog post image") as string}
                      fill={true}
                      sizes="(min-width: 1024px) 1000px, 100vw"
                      priority={i < 3}
                      unoptimized={
                        page.frontMatter.gif !== undefined ||
                        (typeof page.frontMatter.ogImage === "string" &&
                          page.frontMatter.ogImage.endsWith(".gif"))
                      }
                    />
                  </div>
                ) : null}
                <div className="mb-4 text-sm opacity-80 md:hidden group-hover:opacity-100">
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
                    <div className="inline-block px-2 py-1 ml-3 text-xs font-bold rounded-sm bg-primary/10 text-primary">
                      {page.frontMatter.badge}
                    </div>
                  )}
                </div>
                <h2 className="block font-mono text-2xl opacity-90 md:text-3xl group-hover:opacity-100">
                  {page.frontMatter?.title || page.name}
                </h2>
                <div className="mt-4 text-lg opacity-80 group-hover:opacity-100">
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
