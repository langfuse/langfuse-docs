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
    frontMatter: page.data as unknown as CustomerStory["frontMatter"],
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
