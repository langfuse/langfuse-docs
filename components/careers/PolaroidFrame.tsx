import Image from "next/image";

import { cn } from "@/lib/utils";

const LANGFUSE_MARK =
  "/brand-assets/icon/monochrome/langfuse-icon-monochrome.svg";

const POLAROID_SHADOW =
  "-8px 18px 18px rgba(0, 0, 0, 0.04), -3px 7px 9px rgba(0, 0, 0, 0.05), -1px 2px 4px rgba(0, 0, 0, 0.05)";

/** Tailwind `md:h-72` — used for `sizes` hints on the photo. */
const MD_PHOTO_HEIGHT_PX = 288;

const captionLabelClassName =
  "font-mono text-[9px] uppercase tracking-[0.04em] text-text-tertiary";

const captionValueClassName = (filled: boolean) =>
  cn(
    "inline-block border-b border-dashed border-line-divider-dash pb-px",
    "font-mono text-[10px] tracking-[0.02em]",
    filled ? "text-text-secondary" : "text-text-disabled",
  );

export type PolaroidFrameProps = {
  /** Image URL (local `/images/...` or remote). */
  src: string;
  /** Accessible description. Defaults from caption fields when omitted. */
  alt?: string;
  /** Top-line caption (F37 Analog). Renders a muted "Description" placeholder when empty. */
  description?: string;
  /** Location shown beside the date (Geist Mono). */
  location?: string;
  /** Date caption (Geist Mono). Renders a dashed blank line when empty. */
  year?: string | number;
  /** Label for the date field. Default `"Date"`; use `"Year"` for year-only values. */
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
  const when = year !== undefined && year !== null ? String(year).trim() : "";
  if (description && when) {
    return location
      ? `${description}, ${location}, ${when}`
      : `${description}, ${when}`;
  }
  if (description) return description;
  if (location && when) return `${location}, ${when}`;
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

function CaptionField({
  label,
  value,
  minWidth,
}: {
  label: string;
  value: string | null;
  minWidth?: string;
}) {
  const filled = Boolean(value?.trim());

  return (
    <div className="flex items-center gap-1.5">
      <span className={captionLabelClassName}>{label}</span>
      <span
        className={captionValueClassName(filled)}
        style={minWidth ? { minWidth } : undefined}
      >
        {filled ? value : "\u00A0"}
      </span>
    </div>
  );
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
  const dateText =
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
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <CaptionField
                label={dateLabel}
                value={dateText}
                minWidth="3rem"
              />
              <CaptionField label="Location" value={location ?? null} />
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
