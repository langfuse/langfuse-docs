import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Card, Cards } from "nextra-theme-docs";
import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

export const getFaqPages = () => {
  return getPagesUnderRoute("/faq/all") as Array<Page & { frontMatter: any }>;
};

export const getFilteredFaqPages = (
  faqPages: Array<Page & { frontMatter: any }>,
  tags: string[],
  limit: number | undefined = undefined
) => {
  const pages = faqPages
    .filter((page) => page.route !== "/faq/all")
    .filter((page) => {
      const faqTags = page.frontMatter?.tags || [];
      return faqTags.some((tag) => tags.includes(tag));
    });
  return limit === undefined ? pages : pages.slice(0, limit);
};

export const FaqPreview = ({
  tags,
  renderAsCards = false,
}: {
  tags: string[];
  renderAsCards?: boolean;
}) => {
  const faqPages = getFaqPages();
  const filteredFaqPages = getFilteredFaqPages(faqPages, tags, 10);

  return <FaqList pages={filteredFaqPages} renderAsCards={renderAsCards} />;
};

export const FaqList = ({
  pages,
  renderAsCards = false,
}: {
  pages: Array<Page & { frontMatter: any }>;
  renderAsCards?: boolean;
}) => {
  if (renderAsCards) {
    return (
      <Cards num={1}>
        {pages.map((page) => (
          <Card
            href={page.route}
            key={page.route}
            title={page.meta?.title || page.frontMatter?.title || page.name}
            icon={<MessageCircleQuestion />}
            arrow
          >
            {""}
          </Card>
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
            id={page.route.replace("/faq/all/", "")}
            key={page.route.replace("/faq/all/", "")}
          >
            <Link
              key={page.route}
              href={page.route}
              className="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]"
            >
              <span className="">
                {page.meta?.title || page.frontMatter?.title || page.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
