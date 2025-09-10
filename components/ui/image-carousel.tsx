"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState, useCallback } from "react";

// Image Zoom Modal Component with carousel navigation
const ImageCarouselZoomModal = ({
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

interface ImageCarouselProps extends React.ComponentProps<typeof Carousel> {
  children: React.ReactNode;
}

export const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  ({ children, className, ...props }, ref) => {
    const [api, setApi] = useState<CarouselApi>();
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [zoomedImage, setZoomedImage] = useState<{
      images: { src: string; alt: string }[];
      currentIndex: number;
    } | null>(null);

    // Extract all images from this carousel instance
    const extractImages = useCallback(() => {
      const images: { src: string; alt: string }[] = [];
      
      if (carouselRef.current) {
        const imgElements = carouselRef.current.querySelectorAll('img');
        imgElements.forEach((img) => {
          images.push({
            src: img.src,
            alt: img.alt || 'Image',
          });
        });
      }
      
      return images;
    }, []);

    const handleImageClick = useCallback((e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked on an image inside this carousel
      if (target.tagName === 'IMG' && carouselRef.current?.contains(target)) {
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

    useEffect(() => {
      // Add click listener to handle image clicks
      document.addEventListener('click', handleImageClick, true);
      
      return () => {
        document.removeEventListener('click', handleImageClick, true);
      };
    }, [handleImageClick]);

    const handleNavigate = useCallback((index: number) => {
      if (api) {
        api.scrollTo(index);
      }
      setZoomedImage(prev => prev ? { ...prev, currentIndex: index } : null);
    }, [api]);

    const handleClose = useCallback(() => {
      setZoomedImage(null);
    }, []);

    return (
      <>
        <div ref={carouselRef}>
          <Carousel
            ref={ref}
            className={cn("image-carousel", className)}
            setApi={setApi}
            {...props}
          >
            {children}
          </Carousel>
        </div>
        
        {zoomedImage && (
          <ImageCarouselZoomModal
            images={zoomedImage.images}
            currentIndex={zoomedImage.currentIndex}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";

// Re-export carousel components for convenience
export {
  CarouselContent as ImageCarouselContent,
  CarouselItem as ImageCarouselItem,
  CarouselPrevious as ImageCarouselPrevious,
  CarouselNext as ImageCarouselNext,
};