import { faqSource } from "@/lib/source";
import { Cards } from "@/components/docs";
import { MessageCircleQuestion } from "lucide-react";
import { Link } from "@/components/ui/link";

type FaqPage = ReturnType<typeof faqSource.getPages>[number];

export const getFaqPages = () => faqSource.getPages();

export const getFilteredFaqPages = (
  faqPages: FaqPage[],
  tags: string[],
  limit: number | undefined = undefined
) => {
  return faqPages
    .filter((page) => page.url !== "/faq/all")
    .filter((page) => {
      const faqTags = (page.data.tags as string[] | undefined) ?? [];
      return faqTags.some((tag) => tags.includes(tag));
    })
    .sort((a, b) =>
      (a.data.title ?? "").localeCompare(b.data.title ?? "")
    )
    .slice(0, limit);
};

export const FaqPreview = ({
  tags,
  renderAsCards = false,
}: {
  tags: string[];
  renderAsCards?: boolean;
}) => {
  const faqPages = getFaqPages();
  const filteredFaqPages = getFilteredFaqPages(faqPages, tags);
  return <FaqList pages={filteredFaqPages} renderAsCards={renderAsCards} />;
};

export const FaqList = ({
  pages,
  renderAsCards = false,
}: {
  pages: FaqPage[];
  renderAsCards?: boolean;
}) => {
  if (renderAsCards) {
    return (
      <Cards num={1}>
        {pages.map((page) => (
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
    );
  }
  return (
    <>
      <ul className="list-disc list pl-6 mt-5">
        {pages.map((page) => (
          <li
            className="my-2"
            id={page.url.replace("/faq/all/", "")}
            key={page.url.replace("/faq/all/", "")}
          >
            <Link href={page.url} variant="underline">
              <span>{page.data.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
