import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Fixed-aspect-ratio carousel slide that handles mixed image sizes gracefully.
 * Uses a 16:9 container with object-cover so the carousel height stays
 * consistent regardless of the source image's native aspect ratio.
 */
export function CarouselSlide({
  src,
  alt,
  className,
  aspectRatio = "aspect-[16/9]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded border border-line-structure bg-surface-1",
        aspectRatio,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 680px) 100vw, 680px"
      />
    </div>
  );
}
