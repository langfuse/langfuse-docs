import NextImage from "next/image";
import type { ImgHTMLAttributes } from "react";

/**
 * Unified image component wrapping next/image.
 *
 * - Local paths (/images/...) and known remote domains → next/image (optimized)
 * - External URLs (badges, shields.io, etc.) → native <img> (unoptimized, safe)
 * - Unknown dimensions: fills container width, preserves aspect ratio
 * - Known dimensions: renders at exact size
 */

const OPTIMIZED_HOSTNAMES = ["static.langfuse.com", "langfuse.com", "github.com"];

function isOptimizable(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) return true; // local path
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTNAMES.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export function Image(props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string; priority?: boolean }) {
  const { src, alt, width, height, className, style, fill, sizes, priority, ...rest } = props;
  if (!src) return null;

  // External URLs not in our domain list — render as native img to avoid
  // next/image remotePatterns errors (e.g. shields.io badges).
  if (!isOptimizable(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} width={width} height={height} className={className} style={style} {...rest} />
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
      sizes={sizes ?? (hasExplicitDimensions ? undefined : "(max-width: 768px) 100vw, 800px")}
      style={hasExplicitDimensions ? style : { width: "100%", height: "auto", ...style }}
      priority={priority}
      className={className}
      {...(rest as object)}
    />
  );
}
