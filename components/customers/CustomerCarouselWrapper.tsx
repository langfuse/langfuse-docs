// Server component — fetches customer stories server-side and passes them to CustomerCarousel.
import { getCustomerStories } from "@/lib/getCustomerStories";
import { CustomerCarousel } from "./CustomerCarousel";

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
  return (
    <CustomerCarousel
      stories={getCustomerStories()}
      showDots={showDots}
      loop={loop}
      className={className}
    />
  );
}
