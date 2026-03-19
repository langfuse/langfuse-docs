// Server component — fetches customer stories server-side and passes them to CustomerCarousel.
import { usersSource } from "@/lib/source";
import { CustomerCarousel, type CustomerStory } from "./CustomerCarousel";

interface CustomerCarouselWrapperProps {
  showDots?: boolean;
  loop?: boolean;
  className?: string;
}

export function CustomerCarouselWrapper({
  showDots,
  loop,
  className,
}: CustomerCarouselWrapperProps) {
  const stories: CustomerStory[] = usersSource.getPages().map((page) => ({
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
  }));
  return (
    <CustomerCarousel
      stories={stories}
      showDots={showDots}
      loop={loop}
      className={className}
    />
  );
}
