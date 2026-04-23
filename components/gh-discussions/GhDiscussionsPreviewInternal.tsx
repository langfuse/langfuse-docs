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
import { DropdownButton } from "../ui/dropdown-button";

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
        <div className="py-8 text-center">
          <p className="text-sm text-text-tertiary">No discussions found.</p>
        </div>
      );
    }

    return (
      <>
        <ul
          className="list-none not-prose"
          data-gh-discussions-list
        >
          {displayedDiscussions.map((discussion) => (
            <li
              key={discussion.number}
              className="flex items-center p-4 border-b border-line-structure last:border-none"
            >
              <div className="flex flex-col items-center min-w-[60px] gap-0.5">
                <span className="text-lg font-semibold leading-none text-text-primary">
                  {discussion.upvotes}
                </span>
                <span className="text-xs leading-none text-text-tertiary">
                  votes
                </span>
              </div>
              <div className="flex flex-col items-start">
                <Link
                  href={discussion.href}
                  className="text-sm font-medium leading-none no-underline text-text-primary text-balance hover:no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {discussion.title}
                </Link>
                <div className="text-xs text-text-tertiary mt-1.5 flex items-center flex-wrap gap-1">
                  <span>{discussion.author.login}</span>
                  <span>•</span>
                  <span>
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </span>

                  <span>•</span>
                  <div className="inline-flex gap-1 items-center">
                    <span
                      className={`h-4 inline-flex items-center gap-1 px-1.5 rounded-full text-xs bg-surface-1 text-text-tertiary`}
                    >
                      <IconMessage className="h-3" />
                      {discussion.comment_count}
                    </span>

                    {category === "Ideas" &&
                      discussion.labels.includes("✅ Done") && (
                        <span className="h-4 bg-muted-blue/10 text-muted-blue px-1.5 rounded-full text-xs">
                          Done
                        </span>
                      )}
                    {category === "Support" && discussion.resolved && (
                      <span
                        className={`h-4 px-1.5 rounded-full text-xs bg-muted-green/10 text-muted-green`}
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
      <Pagination className="py-8 border-t border-line-structure">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="cursor-pointer select-none mt-0.5"
            />
          </PaginationItem>
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
                  className="cursor-pointer select-none"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
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
    <div className={cn("mt-4 w-full", className)}>
      {/* Hidden links for indexing */}
      <div className="hidden">{generateHiddenLinks()}</div>
      <Tabs
        defaultValue={getDefaultTab()}
        onValueChange={(value) => setCurrentPage(1)}
      >
        <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
          {!filterCategory && (
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  <IconGithub className="mr-1" />
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-36 h-[26px] sm:w-48">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 w-full h-full"
              />
              <IconSearch className="absolute left-2 top-1/2 w-4 h-4 transform -translate-y-1/2 text-text-tertiary" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownButton size="small" icon={<IconSort className="w-4 h-4" />}>
                  <span className="min-w-12 text-center">{sortType.charAt(0).toUpperCase() + sortType.slice(1)}</span>
                </DropdownButton>
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
            <Button
              variant="secondary"
              size="small"
              href="https://github.com/orgs/langfuse/discussions/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              icon={<IconGithub className="w-5 h-5" />}
              iconPosition="end"
            >
              <span className="min-w-12 text-center">New</span>
            </Button>
          </div>
        </div>
        <div className="rounded-sm border border-line-structure">
          <TabsContent value="Support">
            {renderDiscussions("Support")}
          </TabsContent>
          <TabsContent value="Ideas">{renderDiscussions("Ideas")}</TabsContent>
        </div>
      </Tabs>
      <div className="mt-2 text-xs text-text-tertiary">
        <span>
          Discussions last updated:{" "}
          {new Date(discussionsCached.updated_at).toLocaleString()} ({timeDiff})
        </span>
      </div>
    </div>
  );
};

export default GhDiscussionsPreviewInternal;
