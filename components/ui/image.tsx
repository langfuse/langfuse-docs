import NextImage from "next/image";
import type { ImgHTMLAttributes } from "react";
import { isOptimizable } from "@/components/ui/image-utils";

/**
 * Unified image component wrapping next/image.
 *
 * - Local paths (/images/...) and known remote domains → next/image (optimized)
 * - External URLs (badges, shields.io, etc.) → native <img> (unoptimized, safe)
 * - Unknown dimensions: fills container width, preserves aspect ratio
 * - Known dimensions: renders at exact size
 *
 * MDX pages should use `MdxImage` (mapped as `img` / `Image`) so screenshots
 * get Fumadocs ImageZoom. Direct imports here stay non-zoomable (logos,
 * cards, video posters).
 */

export function Image(
  props: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    quality?: number;
  },
) {
  const {
    src,
    alt,
    width,
    height,
    className,
    style,
    fill,
    sizes,
    priority,
    quality,
    ...rest
  } = props;
  if (!src) return null;

  // External URLs not in our domain list — render as native img to avoid
  // next/image remotePatterns errors (e.g. shields.io badges).
  if (!isOptimizable(src)) {
    return (
      <img
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  // fill mode: next/image manages sizing entirely — don't pass width/height or height style
  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={className}
        style={style}
        {...(rest as object)}
      />
    );
  }

  const hasExplicitDimensions = Boolean(width && height);

  return (
    <NextImage
      src={src}
      alt={alt ?? ""}
      width={hasExplicitDimensions ? Number(width) : 0}
      height={hasExplicitDimensions ? Number(height) : 0}
      sizes={
        sizes ??
        (hasExplicitDimensions ? undefined : "(max-width: 768px) 100vw, 800px")
      }
      quality={quality}
      style={
        hasExplicitDimensions
          ? style
          : { width: "100%", height: "auto", ...style }
      }
      priority={priority}
      className={className}
      {...(rest as object)}
    />
  );
}
