import { getPagesUnderRoute } from "@/lib/nextra-shim/context";
import Link from "next/link";
import { FileCode, ArrowRight } from "lucide-react";

type CookbookPage = { route?: string; name?: string; frontMatter?: Record<string, any> };

export const CookbookIndex = ({ categories }: { categories?: string[] }) => (
  <>
    {Object.entries(
      (
        getPagesUnderRoute("/guides/cookbook") as Array<CookbookPage>
      )
        .filter((page) => page.route !== "/cookbook")
        .filter((page) => page.route !== "/guides/cookbook")
        .reduce((acc, page) => {
          const category = page.frontMatter?.category || "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(page);
          return acc;
        }, {} as Record<string, Array<CookbookPage>>)
    )
      .sort(([categoryA], [categoryB]) => {
        // if categories are provided, use the order of the provided categories
        if (categories) {
          const indexA = categories.indexOf(categoryA);
          const indexB = categories.indexOf(categoryB);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        }

        // if categories are not provided, use the default order, Other last
        if (categoryA === "Other") return 1;
        if (categoryB === "Other") return -1;
        return categoryA.localeCompare(categoryB);
      })
      .filter(([category]) => !categories || categories.includes(category))
      .map(([category, pages]) => (
        <div key={category}>
          <h3 className="font-semibold tracking-tight mt-8 text-2xl">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {pages.map((page) => {
              const title =
                page.frontMatter?.title ||
                page.name
                  .split("_")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ");
              return (
                <Link
                  href={page.route}
                  key={page.route}
                  className="no-underline group"
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-transparent hover:bg-muted/40 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
                    <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium flex-1 no-underline">
                      {title}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
  </>
);
