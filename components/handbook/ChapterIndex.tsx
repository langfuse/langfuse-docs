import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { CHAPTER_ORDER } from "@/lib/handbook-meta";

export const ChapterIndex = () => {
  const pages = getPagesUnderRoute("/handbook/chapters") as Array<
    Page & { frontMatter: any; meta?: { title?: string } }
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
    <div className="my-6 flex flex-col gap-2 not-prose">
      {chapterPages.map((page, index) => (
        <a
          key={page.route}
          href={page.route}
          className="flex items-center gap-3 rounded-lg border p-4 hover:border-primary"
        >
          <span className="text-base font-medium font-mono shrink-0 text-muted-foreground">
            {index + 1}
          </span>
          <span className="font-semibold">
            {page.meta?.title || page.frontMatter?.title || page.name}
          </span>
        </a>
      ))}
    </div>
  );
};
