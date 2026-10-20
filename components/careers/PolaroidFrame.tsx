import Image from "next/image";

import { cn } from "@/lib/utils";

const LANGFUSE_MARK =
  "/brand-assets/icon/monochrome/langfuse-icon-monochrome.svg";

const POLAROID_SHADOW =
  "-8px 18px 18px rgba(0, 0, 0, 0.04), -3px 7px 9px rgba(0, 0, 0, 0.05), -1px 2px 4px rgba(0, 0, 0, 0.05)";

/** Tailwind `md:h-72` — used for `sizes` hints on the photo. */
const MD_PHOTO_HEIGHT_PX = 288;

export type PolaroidFrameProps = {
  /** Image URL (local `/images/...` or remote). */
  src: string;
  /** Accessible description. Defaults to the caption (description, or location + year). */
  alt?: string;
  /** Handwritten-style caption (F37 Analog). Renders a muted placeholder when empty. */
  description?: string;
  /** Location shown as a small label next to the date, e.g. "Berlin". */
  location?: string;
  /** Year or date caption (Geist Mono). Renders a dashed blank line when empty. */
  year?: string | number;
  /** Label above the year/date line when no `location` is set. Default `"Date"`. */
  dateLabel?: string;
  /** Photo aspect ratio, e.g. `"4/3"`, `"3/4"`, `"16/9"`. Default `"4/3"`. */
  ratio?: `${number}/${number}`;
  /** Degrees to tilt the whole card for scrapbook layouts, e.g. `-1.4`. Default `0`. */
  rotate?: number;
  className?: string;
  priority?: boolean;
};

function buildAlt(
  alt: string | undefined,
  description: string | undefined,
  location: string | undefined,
  year: string | number | undefined,
): string {
  if (alt) return alt;
  if (description) return description;
  if (location && year) return `${location}, ${year}`;
  if (location) return location;
  return "Team photo";
}

function photoWidthAtHeight(
  ratio: `${number}/${number}`,
  height: number,
): number {
  const [w, h] = ratio.split("/").map(Number);
  return Math.round(height * (w / h));
}

/**
 * Langfuse-styled polaroid photo frame for the careers page.
 * Photo height is fixed; width follows the aspect ratio so portrait shots
 * render narrower than landscape ones in a carousel row.
 */
export function PolaroidFrame({
  src,
  alt,
  description,
  location,
  year,
  dateLabel = "Date",
  ratio = "4/3",
  rotate = 0,
  className,
  priority,
}: PolaroidFrameProps) {
  const hasDescription = Boolean(description?.trim());
  const captionLabel = location?.trim() || dateLabel;
  const yearText =
    year !== undefined && year !== null && String(year).trim() !== ""
      ? String(year)
      : null;
  const photoWidthMd = photoWidthAtHeight(ratio, MD_PHOTO_HEIGHT_PX);

  return (
    <figure
      className={cn("not-prose inline-block shrink-0", className)}
      style={{
        transform: rotate !== 0 ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <div
        className="w-fit rounded-[2px] border border-line-structure bg-card pt-[13px] px-[13px] pb-0"
        style={{ boxShadow: POLAROID_SHADOW }}
      >
        <div
          className={cn(
            "relative h-56 w-auto overflow-hidden rounded-[1px] border border-line-structure bg-surface-2 sm:h-64 md:h-72",
            "corner-box-corners",
          )}
          style={{ aspectRatio: ratio.replace("/", " / ") }}
        >
          <Image
            src={src}
            alt={buildAlt(alt, description, location, year)}
            fill
            priority={priority}
            sizes={`(max-width: 768px) 50vw, ${photoWidthMd}px`}
            className="object-contain"
          />
        </div>

        <figcaption className="flex items-end justify-between gap-2 px-1 pt-2.5 pb-3">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "font-analog text-sm font-medium leading-[110%]",
                "border-b border-dashed border-line-divider-dash pb-1",
                hasDescription ? "text-text-primary" : "text-text-disabled",
              )}
            >
              {hasDescription ? description : "Description"}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.04em] text-text-tertiary">
                {captionLabel}
              </span>
              <span
                className={cn(
                  "inline-block min-w-12 border-b border-dashed border-line-divider-dash pb-px",
                  "font-mono text-[10px] tracking-[0.02em]",
                  yearText ? "text-text-secondary" : "text-text-disabled",
                )}
              >
                {yearText ?? "\u00A0"}
              </span>
            </div>
          </div>
          <Image
            src={LANGFUSE_MARK}
            alt=""
            aria-hidden
            width={16}
            height={16}
            className="mb-px shrink-0 opacity-[0.32]"
          />
        </figcaption>
      </div>
    </figure>
  );
}
