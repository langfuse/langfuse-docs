import { usersSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import { CustomerHoverList } from "./CustomerHoverList";
import type { CustomerStory } from "./CustomerCarousel";

export function CustomerHoverListWrapper({
  maxItems,
}: {
  maxItems?: number;
}) {
  const stories: CustomerStory[] = sortCustomerStoriesByMetaOrder(
    usersSource.getPages().map((page) => ({
      route: page.url,
      frontMatter: {
        title: page.data.title,
        description: page.data.description,
        customerLogo: page.data.customerLogo ?? undefined,
        customerLogoDark: page.data.customerLogoDark ?? undefined,
        customerQuote: page.data.customerQuote ?? undefined,
        quoteAuthor: page.data.quoteAuthor ?? undefined,
        quoteRole: page.data.quoteRole ?? undefined,
        quoteCompany: page.data.quoteCompany ?? undefined,
        quoteAuthorImage: page.data.quoteAuthorImage ?? undefined,
        showInCustomerIndex: page.data.showInCustomerIndex ?? undefined,
      },
    })),
  );

  return <CustomerHoverList stories={stories} maxItems={maxItems} />;
}

