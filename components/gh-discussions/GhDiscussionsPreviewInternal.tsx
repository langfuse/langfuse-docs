"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import discussionsCached from "../../src/langfuse_github_discussions.json";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import IconGithub from "../icons/github";
import IconSort from "../icons/sort";
import IconSearch from "../icons/search";
import { cn } from "@/lib/utils";
import IconMessage from "../icons/message";

type SortType = "upvotes" | "recent";

const categories = ["Support", "Ideas"];

const GhDiscussionsPreviewInternal = ({
  labels,
  className,
  itemsPerPage = 7,
  defaultSort = "upvotes",
  filterCategory,
}: {
  labels?: string[];
  className?: string;
  itemsPerPage?: number;
  filterCategory?: (typeof categories)[number];
  defaultSort?: SortType;
}) => {
  const [sortType, setSortType] = useState<SortType>(defaultSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscussionCategories = useMemo(() => {
    return discussionsCached.categories.map((category) => ({
      category: category.category,
      discussions: category.discussions.filter(
        (discussion) =>
          (!labels ||
            discussion.labels.some((label) => labels.includes(label))) &&
          (searchTerm === "" ||
            discussion.title.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }));
  }, [labels, searchTerm]);

  // Add this new function to determine the default tab
  const getDefaultTab = (): (typeof categories)[number] => {
    const supportDiscussions =
      filteredDiscussionCategories.find((c) => c.category === "Support")
        ?.discussions || [];
    const ideaDiscussions =
      filteredDiscussionCategories.find((c) => c.category === "Ideas")
        ?.discussions || [];

    if (filterCategory) return filterCategory;
    if (supportDiscussions.length > 0) return "Support";
    if (ideaDiscussions.length > 0) return "Ideas";
    return categories[0]; // Fallback to the first category
  };

  const sortDiscussions = (discussions: any[], type: SortType) => {
    return [...discussions].sort((a, b) => {
      if (type === "upvotes" && a.upvotes !== b.upvotes) {
        return b.upvotes - a.upvotes;
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });
  };

  const renderDiscussions = (category: string) => {
    const categoryDiscussions =
      filteredDiscussionCategories.find((c) => c.category === category)
        ?.discussions || [];
    const sortedDiscussions = sortDiscussions(categoryDiscussions, sortType);
    const totalPages = Math.ceil(sortedDiscussions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedDiscussions = sortedDiscussions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    if (displayedDiscussions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-primary/70 text-sm">No discussions found.</p>
        </div>
      );
    }

    return (
      <>
        <ul className="space-y-3 pt-1">
          {displayedDiscussions.map((discussion) => (
            <li
              key={discussion.number}
              className="flex items-center space-x-1 pb-3 border-b last:border-none px-1"
            >
              <div className="flex flex-col items-center min-w-[60px] gap-0.5">
                <span className="text-lg font-semibold leading-none">
                  {discussion.upvotes}
                </span>
                <span className="text-xs text-primary/70 leading-none">
                  votes
                </span>
              </div>
              <div className="flex flex-col items-start">
                <Link
                  href={discussion.href}
                  className="text-primary hover:underline font-medium text-sm leading-none text-balance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {discussion.title}
                </Link>
                <div className="text-xs text-primary/70 mt-1.5 flex items-center flex-wrap gap-1">
                  <span>{discussion.author.login}</span>
                  <span>•</span>
                  <span>
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </span>

                  <span>•</span>
                  <div className="inline-flex items-center gap-1">
                    <span
                      className={`h-4 inline-flex items-center gap-1 px-1.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-primary/70 dark:text-gray-200`}
                    >
                      <IconMessage className="h-3" />
                      {discussion.comment_count}
                    </span>

                    {category === "Ideas" &&
                      discussion.labels.includes("✅ Done") && (
                        <span className="h-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 rounded-full text-xs">
                          Done
                        </span>
                      )}
                    {category === "Support" && discussion.resolved && (
                      <span
                        className={`h-4 px-1.5 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200`}
                      >
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {totalPages > 1 && renderPagination(totalPages)}
      </>
    );
  };

  const renderPagination = (totalPages: number) => {
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

    return (
      <Pagination className="border-t py-1">
        <PaginationContent className="gap-1 items-center">
          <PaginationItem>
            <PaginationPrevious
              size="xs"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                    size="xs"
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
              size="xs"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="cursor-pointer select-none"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Function to generate hidden links for all discussions
  const generateHiddenLinks = () => {
    return filteredDiscussionCategories.flatMap((category) =>
      category.discussions.map((discussion) => (
        <Link
          key={discussion.number}
          href={discussion.href}
          rel="noopener noreferrer"
          title={`Langfuse ${category.category}: ${discussion.title}`}
        >
          {discussion.title}
        </Link>
      ))
    );
  };

  const timeDiff = (() => {
    const timeDiff =
      new Date().getTime() - new Date(discussionsCached.updated_at).getTime();
    const minutes = Math.floor(timeDiff / 60000);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
  })();

  return (
    <div className={cn("w-full mt-4", className)}>
      {/* Hidden links for indexing */}
      <div className="hidden">{generateHiddenLinks()}</div>
      <Tabs
        defaultValue={getDefaultTab()}
        onValueChange={(value) => setCurrentPage(1)}
      >
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          {!filterCategory && (
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger value={category}>
                  <IconGithub className="mr-1" />
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-36 sm:w-48 h-9">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-full pl-8"
              />
              <IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <IconSort className="mr-2 h-4 w-4" />
                  {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSortType("upvotes");
                    setCurrentPage(1);
                  }}
                >
                  Upvotes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortType("recent");
                    setCurrentPage(1);
                  }}
                >
                  Recent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="secondary" asChild size="sm">
              <Link
                href="https://github.com/orgs/langfuse/discussions/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap"
              >
                <IconGithub className="mr-2" />
                New
              </Link>
            </Button>
          </div>
        </div>
        <div className="border rounded bg-card">
          <TabsContent value="Support">
            {renderDiscussions("Support")}
          </TabsContent>
          <TabsContent value="Ideas">{renderDiscussions("Ideas")}</TabsContent>
        </div>
      </Tabs>
      <div className="text-xs text-primary/70 mt-2">
        <span>
          Discussions last updated:{" "}
          {new Date(discussionsCached.updated_at).toLocaleString()} ({timeDiff})
        </span>
      </div>
    </div>
  );
};

export default GhDiscussionsPreviewInternal;
