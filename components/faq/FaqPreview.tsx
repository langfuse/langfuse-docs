import { faqSource } from "@/lib/source";
import { DetailsLink } from "@/components/Details";
import { FaqDetails } from "./FaqDetails";
import { Link } from "@/components/ui/link";
import { getFaqTags, isFaqArticle } from "@/lib/faq-tags";
import { FaqAsk } from "./FaqAsk";

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
  renderAsRows = false,
}: {
  tags: string[];
  renderAsRows?: boolean;
}) => {
  const faqPages = getFaqPages();
  const filteredFaqPages = getFilteredFaqPages(faqPages, tags);
  return <FaqList pages={filteredFaqPages} renderAsRows={renderAsRows} />;
};

export const FaqList = ({
  pages,
  renderAsRows = false,
}: {
  pages: FaqPage[];
  renderAsRows?: boolean;
}) => {
  if (renderAsRows) {
    return (
      <FaqDetails>
        <FaqLinks pages={pages} />
      </FaqDetails>
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
        <FaqAsk linked />
      </ul>
    </>
  );
};

export const FaqLinks = ({ pages }: { pages: FaqPage[] }) => (
  <>
    {pages.map((page) => (
      <DetailsLink href={page.url} key={page.url}>
        {page.data.title}
      </DetailsLink>
    ))}
  </>
);
