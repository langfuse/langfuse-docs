import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Card, Cards } from "nextra-theme-docs";
import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

const PREVIEW_PAGES_PER_TAG = 5;

const wordCasing = {
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
  const pages = getPagesUnderRoute("/faq/all") as Array<
    Page & { frontMatter: any }
  >;
  const categorizedPages = pages
    .filter((page) => page.route !== "/faq/all")
    .reduce((acc, page) => {
      const tags = page.frontMatter?.tags || ["Other"];
      tags.forEach((tag: string) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(page);
      });
      return acc;
    }, {} as Record<string, Array<Page & { frontMatter: any }>>);

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
                <Card
                  href={page.route}
                  key={page.route}
                  title={
                    page.meta?.title || page.frontMatter?.title || page.name
                  }
                  icon={<MessageCircleQuestion />}
                  arrow
                >
                  {""}
                </Card>
              ))}
            </Cards>
            <p className="mt-4">
              <Link href={`/faq/tag/${encodeURIComponent(tag)}`}>
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
