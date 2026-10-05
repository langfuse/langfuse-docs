import { faqSource } from "@/lib/source";
import { DetailsLink } from "@/components/Details";
import { FaqDetails } from "./FaqDetails";
import { getFaqTags, isFaqArticle } from "@/lib/faq-tags";

type FaqPage = ReturnType<typeof faqSource.getPages>[number];

export const getFaqPages = () => faqSource.getPages();

export const getFilteredFaqPages = (
  faqPages: FaqPage[],
  tags: string[],
  limit: number | undefined = undefined,
) => {
  return faqPages
    .filter(isFaqArticle)
    .filter((page) => {
      const faqTags = getFaqTags(page);
      return faqTags.some((tag) => tags.includes(tag));
    })
    .sort((a, b) => (a.data.title ?? "").localeCompare(b.data.title ?? ""))
    .slice(0, limit);
};

export const FaqPreview = ({
  tags,
}: {
  tags: string[];
  /** @deprecated All FAQ previews render as boxed rows. */
  renderAsRows?: boolean;
}) => {
  const faqPages = getFaqPages();
  const filteredFaqPages = getFilteredFaqPages(faqPages, tags);
  return <FaqList pages={filteredFaqPages} />;
};

export const FaqList = ({ pages }: { pages: FaqPage[] }) => (
  <FaqDetails>
    <FaqLinks pages={pages} />
  </FaqDetails>
);

export const FaqLinks = ({ pages }: { pages: FaqPage[] }) => (
  <>
    {pages.map((page) => (
      <DetailsLink href={page.url} key={page.url}>
        {page.data.title}
      </DetailsLink>
    ))}
  </>
);
