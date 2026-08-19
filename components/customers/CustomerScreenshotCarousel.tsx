"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type CustomerScreenshotSlide = {
  src: string;
  alt: string;
  label: string;
};

export function CustomerScreenshotCarousel({
  slides,
  className,
}: {
  slides: CustomerScreenshotSlide[];
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    updateCurrent();
    api.on("select", updateCurrent);
    api.on("reInit", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
      api.off("reInit", updateCurrent);
    };
  }, [api]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <figure className={cn("my-8 w-full", className)}>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="mx-auto w-full max-w-5xl px-9 md:px-12"
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide) => (
            <CarouselItem key={slide.src} className="pl-4">
              <div className="overflow-hidden rounded border border-line-structure bg-surface-bg shadow-sm">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={5360}
                  height={3784}
                  sizes="(max-width: 768px) calc(100vw - 4rem), 960px"
                  className="block h-auto w-full"
                  loading="eager"
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              current === index
                ? "w-6 bg-primary"
                : "w-2 bg-line-structure hover:bg-text-tertiary",
            )}
            aria-label={`Show ${slide.label}`}
            aria-current={current === index ? "true" : undefined}
          />
        ))}
      </div>
    </figure>
  );
}
