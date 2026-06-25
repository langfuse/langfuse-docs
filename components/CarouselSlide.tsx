import { cn } from "@/lib/utils";

/**
 * Carousel slide for the careers polaroids. Renders each image at a uniform
 * height with its natural width so slides sit side-by-side as a filmstrip with
 * no letterboxing above or below the image.
 */
export function CarouselSlide({
  src,
  alt,
  className,
  frame = true,
}: {
  src: string;
  alt: string;
  className?: string;
  frame?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        "h-56 w-auto sm:h-64 md:h-72 md:cursor-pointer",
        frame && "rounded border border-line-structure bg-surface-1",
        className,
      )}
    />
  );
}
