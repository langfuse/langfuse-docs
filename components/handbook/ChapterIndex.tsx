import { handbookSource } from "@/lib/source";
import { CHAPTER_ORDER } from "@/lib/handbook-meta";

type HandbookPage = ReturnType<typeof handbookSource.getPages>[number];

export const ChapterIndex = () => {
  const chapterPages = handbookSource
    .getPages()
    .filter((page) => page.url.startsWith("/handbook/chapters/"))
    .sort((a, b) => {
      const getChapterName = (url: string) => url.split("/").pop() ?? "";
      const chapterA = getChapterName(a.url);
      const chapterB = getChapterName(b.url);
      const indexA = CHAPTER_ORDER.indexOf(chapterA);
      const indexB = CHAPTER_ORDER.indexOf(chapterB);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.url.localeCompare(b.url);
    });

  return (
    <div className="my-6 flex flex-col gap-2 not-prose">
      {chapterPages.map((page, index) => (
        <a
          key={page.url}
          href={page.url}
          className="flex items-center gap-3 rounded-lg border p-4 hover:border-primary"
        >
          <span className="text-base font-medium font-mono shrink-0 text-muted-foreground">
            {index + 1}
          </span>
          <span className="font-semibold">{page.data.title}</span>
        </a>
      ))}
    </div>
  );
};
