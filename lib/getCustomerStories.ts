import { usersSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import type { CustomerStory } from "@/components/customers/CustomerCarousel";

type CustomerPageData = {
  title?: string;
  description?: string;
  customerLogo?: string | null;
  customerLogoDark?: string | null;
  customerQuote?: string | null;
  customerQuoteHighlight?: string | null;
  customerQuoteTag?: string | null;
  quoteAuthor?: string | null;
  quoteRole?: string | null;
  quoteCompany?: string | null;
  quoteAuthorImage?: string | null;
  showInCustomerIndex?: boolean | null;
};

/** Load and sort customer stories for the /users index and related UI. */
export function getCustomerStories(): CustomerStory[] {
  return sortCustomerStoriesByMetaOrder(
    usersSource.getPages().map((page) => {
      const data = page.data as CustomerPageData;
      return {
        route: page.url,
        frontMatter: {
          title: data.title,
          description: data.description,
          customerLogo: data.customerLogo ?? undefined,
          customerLogoDark: data.customerLogoDark ?? undefined,
          customerQuote: data.customerQuote ?? undefined,
          customerQuoteHighlight: data.customerQuoteHighlight ?? undefined,
          customerQuoteTag: data.customerQuoteTag ?? undefined,
          quoteAuthor: data.quoteAuthor ?? undefined,
          quoteRole: data.quoteRole ?? undefined,
          quoteCompany: data.quoteCompany ?? undefined,
          quoteAuthorImage: data.quoteAuthorImage ?? undefined,
          showInCustomerIndex: data.showInCustomerIndex ?? undefined,
        },
      };
    }),
  );
}

export function getIndexCustomerStories(): CustomerStory[] {
  return getCustomerStories().filter(
    (page) => page.frontMatter?.showInCustomerIndex !== false,
  );
}
