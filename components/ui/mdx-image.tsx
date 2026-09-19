"use client";

import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { ImgHTMLAttributes } from "react";
import { Image } from "@/components/ui/image";
import { shouldZoomMdxImage } from "@/components/ui/image-utils";

export type MdxImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * MDX `img` / `Image` mapping: keep next/image optimization, add Fumadocs
 * ImageZoom so markdown screenshots zoom without a custom lightbox.
 *
 * Badges, logos, and tiny assets skip zoom. Mermaid and Video posters are
 * not MDX `img` nodes, so they are unaffected.
 */
export function MdxImage(props: MdxImageProps) {
  const { src, alt, width, height, className } = props;
  const srcString = typeof src === "string" ? src : undefined;

  if (
    !srcString ||
    !shouldZoomMdxImage({
      src: srcString,
      width,
      height,
      className,
    })
  ) {
    return <Image {...props} />;
  }

  return (
    <ImageZoom src={srcString} alt={alt ?? ""} zoomInProps={{ alt: alt ?? "" }}>
      <Image {...props} />
    </ImageZoom>
  );
}
