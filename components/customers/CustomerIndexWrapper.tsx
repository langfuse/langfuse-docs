// Server component — fetches customer stories server-side and passes them to CustomerIndex.
import { usersSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import { CustomerIndex } from "./CustomerIndex";
import { type CustomerStory } from "./CustomerCarousel";

interface CustomerIndexWrapperProps {
  maxItems?: number;
}

export function CustomerIndexWrapper({ maxItems }: CustomerIndexWrapperProps) {
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
  return <CustomerIndex stories={stories} maxItems={maxItems} />;
}
