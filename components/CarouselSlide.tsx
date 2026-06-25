import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Carousel slide for the careers polaroids. Renders each image at a uniform
 * height with its natural width so slides sit side-by-side as a filmstrip with
 * no letterboxing above or below the image. Uses next/image (with the source's
 * intrinsic dimensions) so Next.js can serve lazy-loaded, optimized variants.
 */
export function CarouselSlide({
  src,
  alt,
  width,
  height,
  className,
  frame = true,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  frame?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 50vw, 320px"
      className={cn(
        "h-56 w-auto sm:h-64 md:h-72 md:cursor-pointer",
        frame && "rounded border border-line-structure bg-surface-1",
        className,
      )}
    />
  );
}
