import { guidesSource } from "@/lib/source";
import { FileCode, ArrowRight } from "lucide-react";
import { Cards, Card } from "@/components/docs";

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
          <h3 className="font-semibold tracking-tight mt-10 text-xl mb-4">
            {category}
          </h3>
          <Cards num={2}>
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
                <Card
                  href={page.url}
                  key={page.url}
                  className="no-underline group"
                  icon={<FileCode className="h-3 w-3" />}
                >
                  <div className="flex flex-1 items-center gap-3 w-full justify-between">
                    <span className="flex-1 text-text-secondary group-hover:text-text-primary transition-colors duration-220">
                      {title}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Card>
              );
            })}
          </Cards>
        </div>
      ))}
  </>
);
