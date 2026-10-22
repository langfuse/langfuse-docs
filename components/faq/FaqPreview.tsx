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
    <FaqLinks pages={pages} newTab anchors />
  </FaqDetails>
);

const faqAnchorId = (url: string) => url.replace("/faq/all/", "");

export const FaqLinks = ({
  pages,
  newTab = false,
  anchors = false,
}: {
  pages: FaqPage[];
  /** Embedded doc previews open answers in a new tab; FAQ index listings stay in-tab. */
  newTab?: boolean;
  /** Restore `/faq/tag/<tag>#<slug>` anchors. Off on the index, where a page can appear under several tags. */
  anchors?: boolean;
}) => (
  <>
    {pages.map((page) => (
      <DetailsLink
        href={page.url}
        id={anchors ? faqAnchorId(page.url) : undefined}
        newTab={newTab}
        key={page.url}
      >
        {page.data.title}
      </DetailsLink>
    ))}
  </>
);
