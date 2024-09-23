import { useState, useMemo } from "react";
import Link from "next/link";
import discussionCategories from "../../src/langfuse_github_discussions.json";
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
import { cn } from "@/lib/utils";

type SortType = "upvotes" | "recent";

const categories = ["Support", "Ideas"];

const GhDiscussionsPreviewInternal = ({
  labels,
  className,
  itemsPerPage = 7,
  filterCategory,
}: {
  labels?: string[];
  className?: string;
  itemsPerPage?: number;
  filterCategory?: (typeof categories)[number];
}) => {
  const [sortType, setSortType] = useState<SortType>("upvotes");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscussionCategories = useMemo(() => {
    return discussionCategories.map((category) => ({
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
              className="flex items-center space-x-1 pb-3 border-b last:border-none"
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
                  className="text-primary hover:underline font-medium text-sm leading-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {discussion.title}
                </Link>
                <div className="text-xs text-primary/70 mt-0.5">
                  <span>by {discussion.author.login}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </span>
                  {category === "Ideas" &&
                    discussion.labels.includes("✅ Done") && (
                      <span className="ml-2 bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full text-xs">
                        Done
                      </span>
                    )}
                  {category === "Support" && discussion.resolved && (
                    <span
                      className={`ml-2 px-1 py-0.5 rounded-full text-xs bg-green-100 text-green-800`}
                    >
                      Resolved
                    </span>
                  )}
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
            />
          </PaginationItem>
          <div className="hidden sm:flex gap-1 items-center">
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === null ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis size="xs" />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                    size="xs"
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
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className={cn("w-full mt-4", className)}>
      <Tabs
        defaultValue={filterCategory || categories[0]}
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
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 sm:w-48 h-9"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Sort: {sortType === "upvotes" ? "Upvotes" : "Recent"}
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
            <Button asChild size="sm">
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
        <div className="border rounded">
          <TabsContent value="Support">
            {renderDiscussions("Support")}
          </TabsContent>
          <TabsContent value="Ideas">{renderDiscussions("Ideas")}</TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default GhDiscussionsPreviewInternal;
