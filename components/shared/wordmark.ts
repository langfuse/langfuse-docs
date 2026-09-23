import type { StaticImageData } from "next/image";

/** Original shared wordmark canvas height before the files were cropped to ink. */
export const WORDMARK_SOURCE_HEIGHT = 40;

export function wordmarkDisplaySize(
  logo: Pick<StaticImageData, "width" | "height">,
  canvasDisplayHeight: number,
) {
  const scale = canvasDisplayHeight / WORDMARK_SOURCE_HEIGHT;
  return {
    width: logo.width * scale,
    height: logo.height * scale,
  };
}
