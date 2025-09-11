import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";

export const ChapterIndex = () => {
  const pages = getPagesUnderRoute("/handbook/chapters") as Array<
    Page & { frontMatter: any }
  >;

  // Filter out the _meta.tsx file and sort pages
  const chapterPages = pages
    .filter(
      (page) =>
        page.route !== "/handbook/chapters" && !page.route.includes("_meta")
    )
    .sort((a, b) => {
      // You can customize the sorting logic here if needed
      // For now, let's sort alphabetically by route
      return a.route.localeCompare(b.route);
    });

  return (
    <div className="my-6">
      <Cards num={1}>
        {chapterPages.map((page, index) => (
          <Cards.Card
            href={page.route}
            key={page.route}
            title={page.meta?.title || page.frontMatter?.title || page.name}
            icon={
              <span className="text-base font-medium font-mono">
                {index + 1}
              </span>
            }
            arrow
          />
        ))}
      </Cards>
    </div>
  );
};
