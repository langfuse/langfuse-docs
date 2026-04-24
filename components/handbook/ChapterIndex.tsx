import { handbookSource } from "@/lib/source";
import { CHAPTER_ORDER } from "@/lib/handbook-meta";
import { Cards, Card } from "@/components/docs";
import { Text } from "@/components/ui/text";

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
    <Cards num={1} className="not-prose">
      {chapterPages.map((page, index) => (
        <Card key={page.url} href={page.url}>
          <div className="flex flex-row items-center gap-2.5 text-text-primary">
            <Text size="s" className="font-medium font-mono shrink-0">
              {index + 1}
            </Text>
            <Text as="h3" size="s" className="not-prose mb-0 text-left text-text-secondary">
              {page.data.title}
            </Text>
          </div>
        </Card>
      ))}
    </Cards>
  );
};
