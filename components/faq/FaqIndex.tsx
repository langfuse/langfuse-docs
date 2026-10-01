import { faqSource } from "@/lib/source";
import { FaqLinks } from "./FaqPreview";
import { FaqDetails } from "./FaqDetails";
import { Link } from "@/components/ui/link";
import { getFaqTags, isFaqArticle } from "@/lib/faq-tags";

type FaqPage = ReturnType<typeof faqSource.getPages>[number];

const PREVIEW_PAGES_PER_TAG = 5;

const wordCasing: Record<string, string> = {
  api: "API",
  openai: "OpenAI",
  langchain: "LangChain",
  opentelemetry: "OpenTelemetry",
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
  const categorizedPages = pages.filter(isFaqArticle).reduce(
    (acc, page) => {
      const tags = getFaqTags(page);
      tags.forEach((tag) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(page);
      });
      return acc;
    },
    {} as Record<string, FaqPage[]>,
  );

  return (
    <FaqDetails>
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
            <FaqLinks pages={pages.slice(0, PREVIEW_PAGES_PER_TAG)} />
            <p className="mt-4">
              <Link
                href={`/faq/tag/${encodeURIComponent(tag)}`}
                variant="underline"
              >
                {pages.length > PREVIEW_PAGES_PER_TAG
                  ? `View all (${pages.length - PREVIEW_PAGES_PER_TAG} more) ->`
                  : `View all ->`}
              </Link>
            </p>
          </div>
        ))}
    </FaqDetails>
  );
};
