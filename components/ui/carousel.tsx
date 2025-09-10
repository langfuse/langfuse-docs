"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

// Image Zoom Modal Component for carousel images
const ImageZoomModal = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        onNavigate(newIndex);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        onNavigate(newIndex);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onNavigate, currentIndex, images.length]);

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] bg-white rounded-lg shadow-2xl">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          aria-label="Close zoom"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Navigation indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const carouselContainerRef = React.useRef<HTMLDivElement>(null);
    const [zoomedImage, setZoomedImage] = useState<{
      images: { src: string; alt: string }[];
      currentIndex: number;
    } | null>(null);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    // Extract images from the carousel
    const extractImages = useCallback(() => {
      const images: { src: string; alt: string }[] = [];
      
      if (carouselContainerRef.current) {
        const imgElements = carouselContainerRef.current.querySelectorAll('img');
        imgElements.forEach((img) => {
          images.push({
            src: img.src,
            alt: img.alt || 'Image',
          });
        });
      }
      
      return images;
    }, []);

    // Handle image clicks for zoom
    const handleImageClick = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked on an image inside this carousel
      if (target.tagName === 'IMG' && carouselContainerRef.current?.contains(target)) {
        // Only handle clicks on desktop (screens wider than 500px)
        if (window.innerWidth <= 500) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        
        const images = extractImages();
        const imgSrc = (target as HTMLImageElement).src;
        const currentIndex = images.findIndex(img => img.src === imgSrc);
        
        if (currentIndex !== -1) {
          setZoomedImage({ images, currentIndex });
        }
      }
    }, [extractImages]);

    // Navigate zoomed images
    const handleZoomNavigate = useCallback((index: number) => {
      if (api) {
        api.scrollTo(index);
      }
      setZoomedImage(prev => prev ? { ...prev, currentIndex: index } : null);
    }, [api]);

    // Close zoom
    const handleZoomClose = useCallback(() => {
      setZoomedImage(null);
    }, []);

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    // Set up image click listener
    React.useEffect(() => {
      document.addEventListener('click', handleImageClick, true);
      
      return () => {
        document.removeEventListener('click', handleImageClick, true);
      };
    }, [handleImageClick]);

    return (
      <>
        <CarouselContext.Provider
          value={{
            carouselRef,
            api: api,
            opts,
            orientation:
              orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
          }}
        >
          <div
            ref={(el) => {
              carouselContainerRef.current = el;
              if (ref) {
                if (typeof ref === 'function') {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            onKeyDownCapture={handleKeyDown}
            className={cn("relative", className)}
            role="region"
            aria-roledescription="carousel"
            {...props}
          >
            {children}
          </div>
        </CarouselContext.Provider>
        
        {zoomedImage && (
          <ImageZoomModal
            images={zoomedImage.images}
            currentIndex={zoomedImage.currentIndex}
            onClose={handleZoomClose}
            onNavigate={handleZoomNavigate}
          />
        )}
      </>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useEmblaCarousel as useCarousel,
};
