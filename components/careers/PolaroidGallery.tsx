import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  careersPolaroids,
  orderPolaroidsForGallery,
  type CareersPolaroid,
} from "./careers-polaroids";
import { PolaroidFrame } from "./PolaroidFrame";

function PolaroidSlide({ polaroid }: { polaroid: CareersPolaroid }) {
  return (
    <CarouselItem className="basis-auto pl-8">
      <PolaroidFrame {...polaroid} />
    </CarouselItem>
  );
}

/** Vertical dashed rule between the pinned anchor and newest slides. */
function PolaroidGalleryDivider() {
  return (
    <CarouselItem
      className="flex basis-auto items-center self-stretch pl-8"
      aria-hidden
    >
      <div className="h-48 w-px border-l border-dashed border-line-divider-dash md:h-72" />
    </CarouselItem>
  );
}

/**
 * Team Impressions carousel — "Langfuse is born" is always first, paired with
 * the newest photo and a divider; remaining slides follow by date (newest first).
 */
export function PolaroidGallery() {
  const { anchor, newest, rest } = orderPolaroidsForGallery(careersPolaroids);

  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent viewportClassName="py-6" className="-ml-8 items-center">
        <PolaroidSlide polaroid={anchor} />
        {newest ? (
          <>
            <PolaroidGalleryDivider />
            <PolaroidSlide polaroid={newest} />
          </>
        ) : null}
        {rest.map((polaroid) => (
          <PolaroidSlide key={polaroid.src} polaroid={polaroid} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
