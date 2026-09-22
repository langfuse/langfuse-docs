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
  href?: string;
};

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function CustomerScreenshotCarousel({
  slides,
  className,
  href,
  aspectClassName,
  imageFit = "cover",
  zoomOnMobile = false,
}: {
  slides: CustomerScreenshotSlide[];
  className?: string;
  href?: string;
  aspectClassName?: string;
  imageFit?: "cover" | "contain";
  zoomOnMobile?: boolean;
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
        zoomOnMobile={zoomOnMobile}
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide) => {
            const slideHref = slide.href ?? href;
            const external = slideHref ? isExternalHref(slideHref) : false;
            const image = (
              <Image
                src={slide.src}
                alt={slide.alt}
                aria-label={
                  slideHref
                    ? undefined
                    : `Open ${slide.label} image in full size`
                }
                width={5360}
                height={3784}
                sizes="(max-width: 768px) calc(100vw - 4rem), 960px"
                className={cn(
                  "block w-full",
                  aspectClassName
                    ? imageFit === "contain"
                      ? "h-full object-contain"
                      : "h-full object-cover"
                    : "h-auto",
                  !slideHref && "cursor-zoom-in",
                )}
                loading="eager"
                unoptimized
                role={slideHref ? undefined : "button"}
                tabIndex={slideHref ? undefined : 0}
                onKeyDown={
                  slideHref
                    ? undefined
                    : (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.currentTarget.click();
                        }
                      }
                }
              />
            );

            return (
              <CarouselItem key={slide.src} className="pl-4">
                <div
                  className={cn(
                    "overflow-hidden rounded border border-line-structure bg-surface-bg shadow-sm",
                    aspectClassName,
                  )}
                >
                  {slideHref ? (
                    <a
                      href={slideHref}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "block no-underline transition-opacity hover:opacity-90",
                        aspectClassName && "h-full w-full",
                      )}
                      aria-label={`Open ${slide.label}`}
                    >
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </div>
              </CarouselItem>
            );
          })}
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
