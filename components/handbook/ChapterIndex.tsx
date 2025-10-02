import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import { CHAPTER_ORDER } from "@/pages/handbook/chapters/_meta";

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
      // Extract the chapter name from the route (e.g., "/handbook/chapters/mission" -> "mission")
      const getChapterName = (route: string) => route.split("/").pop() || "";
      const chapterA = getChapterName(a.route);
      const chapterB = getChapterName(b.route);

      // Get the order index for each chapter
      const indexA = CHAPTER_ORDER.indexOf(chapterA);
      const indexB = CHAPTER_ORDER.indexOf(chapterB);

      // If both chapters are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the order array, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither is in the order array, fall back to alphabetical
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
