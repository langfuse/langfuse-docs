import { guidesSource } from "@/lib/source";
import { Link } from "@/components/ui/link";
import { FileCode, ArrowRight } from "lucide-react";

type CookbookPage = ReturnType<typeof guidesSource.getPages>[number];

export const CookbookIndex = ({ categories }: { categories?: string[] }) => (
  <>
    {Object.entries(
      guidesSource
        .getPages()
        .filter((page) => page.url.startsWith("/guides/cookbook/"))
        .reduce((acc, page) => {
          const category = (page.data.category as string | undefined) ?? "Other";
          if (!acc[category]) acc[category] = [];
          acc[category].push(page);
          return acc;
        }, {} as Record<string, CookbookPage[]>)
    )
      .sort(([categoryA], [categoryB]) => {
        if (categories) {
          const indexA = categories.indexOf(categoryA);
          const indexB = categories.indexOf(categoryB);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        }
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
                page.data.title ??
                page.slugs[page.slugs.length - 1]
                  .split("_")
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ");
              return (
                <Link
                  href={page.url}
                  key={page.url}
                  className="no-underline group"
                >
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-bg px-4 py-3 transition-all duration-200 hover:bg-muted/40 hover:border-border">
                    <FileCode className="h-4 w-4 shrink-0 text-text-tertiary" />
                    <span className="flex-1 text-sm font-medium text-text-primary no-underline">
                      {title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
  </>
);
