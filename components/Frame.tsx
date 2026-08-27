"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Image Zoom Modal Component
const ImageZoomModal = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] bg-white rounded-lg shadow-2xl">
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
      </div>
    </div>,
    document.body,
  );
};

export const Frame = ({
  children,
  className,
  fullWidth = false,
  transparent = false,
  zoom = true,
  zoomOnMobile = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  transparent?: boolean;
  zoom?: boolean;
  zoomOnMobile?: boolean;
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !zoom) return;

    const openImage = (target: HTMLImageElement) => {
      const src = target.src;
      const alt = target.alt || "Image";
      if (src) {
        setZoomedImage({ src, alt });
      }
    };

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (target.tagName === "IMG") {
        if (!zoomOnMobile && window.innerWidth <= 500) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        openImage(target);
      }
    };

    const handleImageKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLImageElement;
      if (target.tagName === "IMG" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        e.stopPropagation();
        openImage(target);
      }
    };

    const updateImageAccessibility = () => {
      const pointerZoomEnabled = zoomOnMobile || window.innerWidth > 500;
      const images = frame.querySelectorAll("img");
      images.forEach((img) => {
        img.style.cursor = pointerZoomEnabled ? "zoom-in" : "default";
        img.style.transition = pointerZoomEnabled
          ? "opacity 0.2s ease"
          : "none";
        img.tabIndex = 0;
        img.setAttribute("role", "button");
        if (!img.getAttribute("aria-label")) {
          img.setAttribute(
            "aria-label",
            `Open ${img.alt || "image"} in full size`,
          );
        }
      });
    };

    frame.addEventListener("click", handleImageClick);
    frame.addEventListener("keydown", handleImageKeyDown);

    updateImageAccessibility();
    window.addEventListener("resize", updateImageAccessibility);

    return () => {
      frame.removeEventListener("click", handleImageClick);
      frame.removeEventListener("keydown", handleImageKeyDown);
      window.removeEventListener("resize", updateImageAccessibility);
    };
  }, [zoom, zoomOnMobile]);

  return (
    <>
      <div
        ref={frameRef}
        className={cn(
          "mt-4 border rounded inline-block overflow-hidden",
          className,
        )}
      >
        <div
          className={cn(
            "block bg-primary/5 max-w-2xl [&>*]:mt-0 [&>*]:mb-0 [&>*]:p-0 [&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:leading-none [&_img]:align-top [&_img]:my-0 [&_p]:my-0",
            fullWidth && "max-w-full",
            transparent && "bg-transparent",
          )}
        >
          {children}
        </div>
      </div>

      {zoomedImage && (
        <ImageZoomModal
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
};
