"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Video } from "@/components/Video";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type VideoCarouselItem = {
  title: string;
  src?: string;
  poster?: string;
};

const VIDEO_FRAME = {
  aspectRatio: 43 / 27, // Matches the 2580×1620 and 3440×2160 recordings.
};

export function VideoCarousel({
  videos,
  fallbackSrc,
}: {
  videos: VideoCarouselItem[];
  fallbackSrc?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const slides = carouselRef.current?.querySelectorAll<HTMLElement>(
      '[aria-roledescription="slide"]',
    );

    slides?.forEach((slide, index) => {
      const media = slide.querySelector("video");
      if (!media) {
        return;
      }

      if (index === current) {
        media.muted = true;
        media.playsInline = true;
        media.setAttribute("playsinline", "");
        media.setAttribute("webkit-playsinline", "");
        void media.play().catch(() => undefined);
      } else {
        media.pause();
      }
    });
  }, [current]);

  useEffect(() => {
    if (!api || videos.length < 2) {
      return;
    }

    const activeSlide = carouselRef.current?.querySelectorAll<HTMLElement>(
      '[aria-roledescription="slide"]',
    )[current];
    const activeMedia = activeSlide?.querySelector("video");

    if (!activeMedia) {
      return;
    }

    const advance = () => api.scrollNext();
    activeMedia.addEventListener("ended", advance);

    return () => activeMedia.removeEventListener("ended", advance);
  }, [api, current, videos.length]);

  if (videos.length === 0) {
    return null;
  }

  const showNavigation = videos.length > 1;

  return (
    <section
      ref={carouselRef}
      className="not-prose my-8 w-full"
      aria-label="Videos"
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: showNavigation ? "center" : "start",
          loop: showNavigation,
        }}
        className="mx-auto w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video, index) => {
            const src = video.src ?? fallbackSrc;

            return (
              <CarouselItem
                key={`${video.title}-${index}`}
                className={cn(
                  "pl-4",
                  showNavigation ? "basis-[88%]" : "basis-full",
                )}
                aria-label={`${index + 1} of ${videos.length}: ${video.title}`}
              >
                <figure className="m-0 overflow-hidden rounded-lg border border-line-structure bg-surface-bg shadow-sm">
                  {src ? (
                    <Video
                      src={src}
                      poster={video.poster}
                      aspectRatio={VIDEO_FRAME.aspectRatio}
                      className="w-full rounded-none shadow-none"
                      autoPlay={index === current}
                      muted
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center bg-surface-1 px-6 text-center"
                      style={{ aspectRatio: VIDEO_FRAME.aspectRatio }}
                    >
                      <div>
                        <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-line-structure bg-surface-bg text-text-secondary shadow-sm">
                          <Play className="size-5 translate-x-px" aria-hidden />
                        </span>
                        <span className="text-sm font-medium text-text-secondary">
                          Video coming soon
                        </span>
                      </div>
                    </div>
                  )}

                  <figcaption className="px-4 py-2">
                    <p className="m-0 text-sm font-medium text-text-primary">
                      {video.title}
                    </p>
                  </figcaption>
                </figure>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {showNavigation && (
          <>
            <CarouselPrevious className="left-2 z-10" />
            <CarouselNext className="right-2 z-10" />
          </>
        )}
      </Carousel>

      {showNavigation && (
        <div className="mt-4 flex justify-center gap-2">
          {videos.map((video, index) => (
            <button
              key={`${video.title}-${index}`}
              type="button"
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                current === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-line-structure hover:bg-text-tertiary",
              )}
              aria-label={`Show ${video.title}`}
              aria-current={current === index ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
