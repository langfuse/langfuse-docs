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

const ITEMS_PER_PAGE = 5;

const GhDiscussionsPreviewInternal = ({
  labels,
  className,
}: {
  labels?: string[];
  className?: string;
}) => {
  const [sortType, setSortType] = useState<SortType>("upvotes");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(searchTerm);

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
      if (type === "upvotes") {
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
    const totalPages = Math.ceil(sortedDiscussions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedDiscussions = sortedDiscussions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    if (displayedDiscussions.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No discussions found.</p>
        </div>
      );
    }

    return (
      <>
        <ul className="space-y-4">
          {displayedDiscussions.map((discussion) => (
            <li
              key={discussion.number}
              className="flex items-start space-x-4 pb-4 border-b"
            >
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xl font-semibold">
                  {discussion.upvotes}
                </span>
                <span className="text-xs text-gray-500">votes</span>
              </div>
              <div className="flex-grow">
                <Link
                  href={discussion.href}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {discussion.title}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  <span>by {discussion.author.login}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </span>
                  {category === "Ideas" &&
                    discussion.labels.includes("✅ Done") && (
                      <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Done
                      </span>
                    )}
                  {category === "Support" && (
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        discussion.resolved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {discussion.resolved ? "Resolved" : "Unresolved"}
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
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            />
          </PaginationItem>
          <div className="hidden sm:flex">
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
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
          </div>
          <PaginationItem>
            <PaginationNext
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
    <div className={cn("w-full p-2 rounded-md border", className)}>
      <Tabs defaultValue="Support" onValueChange={(value) => setCurrentPage(1)}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <TabsList>
            <TabsTrigger value="Support">
              <IconGithub className="mr-1" />
              Support
            </TabsTrigger>
            <TabsTrigger value="Ideas">
              <IconGithub className="mr-1" />
              Ideas
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-14 sm:w-36 h-9"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Sort: {sortType === "upvotes" ? "Upvotes" : "Recent"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortType("upvotes")}>
                  Upvotes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType("recent")}>
                  Recent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild size="sm">
              <Link href="https://github.com/orgs/langfuse/discussions/new/choose">
                <IconGithub className="mr-1" />
                New discussion
              </Link>
            </Button>
          </div>
        </div>
        <div className="border p-2 rounded">
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
