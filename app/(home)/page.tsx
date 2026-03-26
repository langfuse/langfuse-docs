import { Home } from "@/components/home";
import { usersSource, changelogSource } from "@/lib/source";
import { sortCustomerStoriesByMetaOrder } from "@/lib/sortCustomerStoriesByMeta";
import type { CustomerStory } from "@/components/customers/CustomerCarousel";
import type { ChangelogItem } from "@/components/home/Changelog";

export default function HomePage() {
  const customerStories: CustomerStory[] = sortCustomerStoriesByMetaOrder(
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

  const changelogItems: ChangelogItem[] = changelogSource
    .getPages()
    .filter((page) => page.data.title && page.data.date)
    .sort(
      (a, b) =>
        new Date(a.data.date as string).getTime() -
        new Date(b.data.date as string).getTime()
    )
    .reverse()
    .slice(0, 20)
    .map((page) => ({
      route: page.url,
      title: page.data.title ?? null,
      author: (page.data.author as string | undefined) ?? null,
      date: new Date(page.data.date as string).toISOString(),
    }));

  return (
    <Home customerStories={customerStories} changelogItems={changelogItems} />
  );
}
