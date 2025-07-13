import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import { FileCode } from "lucide-react";

export const CookbookIndex = ({ categories }: { categories?: string[] }) => (
  <>
    {Object.entries(
      (
        getPagesUnderRoute("/guides/cookbook") as Array<
          Page & { frontMatter: any }
        >
      )
        .filter((page) => page.route !== "/cookbook")
        .filter((page) => page.route !== "/guides/cookbook")
        .reduce(
          (acc, page) => {
            const category = page.frontMatter?.category || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(page);
            return acc;
          },
          {} as Record<string, Array<Page & { frontMatter: any }>>
        )
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
          <h3 className="_font-semibold _tracking-tight _text-slate-900 dark:_text-slate-100 _mt-8 _text-2xl">
            {category}
          </h3>
          <Cards num={2}>
            {pages.map((page) => (
              <Cards.Card
                href={page.route}
                key={page.route}
                title={
                  page.frontMatter?.title ||
                  page.name
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                }
                icon={<FileCode />}
                arrow
              >
                {""}
              </Cards.Card>
            ))}
          </Cards>
        </div>
      ))}
  </>
);
