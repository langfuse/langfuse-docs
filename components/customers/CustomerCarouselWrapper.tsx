// Server component — no "use client". Fetches customer stories server-side
// and passes them as props to the client-side CustomerCarousel.
// Use this in MDX files instead of CustomerCarousel when you need path-based fetching.
import { getPagesForRoute } from "@/lib/source";
import { CustomerCarousel, type CustomerStory } from "./CustomerCarousel";

interface CustomerCarouselWrapperProps {
  path?: string;
  showDots?: boolean;
  loop?: boolean;
  className?: string;
}

export function CustomerCarouselWrapper({
  path = "/users",
  showDots,
  loop,
  className,
}: CustomerCarouselWrapperProps) {
  const stories = getPagesForRoute(path) as CustomerStory[];
  return (
    <CustomerCarousel
      stories={stories}
      showDots={showDots}
      loop={loop}
      className={className}
    />
  );
}
