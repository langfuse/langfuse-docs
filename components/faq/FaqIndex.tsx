import { faqSource } from "@/lib/source";
import { Cards } from "@/components/docs";
import { MessageCircleQuestion } from "lucide-react";
import { Link } from "@/components/ui/link";

type FaqPage = ReturnType<typeof faqSource.getPages>[number];

const PREVIEW_PAGES_PER_TAG = 5;

const wordCasing: Record<string, string> = {
  api: "API",
  openai: "OpenAI",
  langchain: "LangChain",
};

export const formatTag = (tag: string) =>
  tag
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .map((word) => wordCasing[word.toLowerCase()] || word)
    .join(" ");

export const FaqIndex = () => {
  const pages = faqSource.getPages();
  const categorizedPages = pages
    .filter((page) => page.url !== "/faq/all")
    .reduce((acc, page) => {
      const tags = (page.data.tags as string[] | undefined) ?? ["Other"];
      tags.forEach((tag) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(page);
      });
      return acc;
    }, {} as Record<string, FaqPage[]>);

  return (
    <>
      {Object.entries(categorizedPages)
        .sort(([tagA], [tagB]) => {
          if (tagA === "Other") return 1;
          if (tagB === "Other") return -1;
          return tagA.localeCompare(tagB);
        })
        .map(([tag, pages]) => (
          <div key={tag} className="my-10">
            <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 text-2xl">
              {formatTag(tag)}
            </h3>
            <Cards num={1}>
              {pages.slice(0, PREVIEW_PAGES_PER_TAG).map((page) => (
                <Cards.Card
                  href={page.url}
                  key={page.url}
                  title={page.data.title}
                  icon={<MessageCircleQuestion />}
                  arrow
                >
                  {""}
                </Cards.Card>
              ))}
            </Cards>
            <p className="mt-4">
              <Link href={`/faq/tag/${encodeURIComponent(tag)}`} variant="underline">
                {pages.length > PREVIEW_PAGES_PER_TAG
                  ? `View all (${pages.length - PREVIEW_PAGES_PER_TAG} more) ->`
                  : `View all ->`}
              </Link>
            </p>
          </div>
        ))}
    </>
  );
};
