import type { PolaroidFrameProps } from "./PolaroidFrame";

export type CareersPolaroid = Pick<
  PolaroidFrameProps,
  | "src"
  | "description"
  | "location"
  | "year"
  | "dateLabel"
  | "ratio"
  | "rotate"
  | "alt"
  | "priority"
>;

/** Team Impressions carousel — add new photos here; display order is sorted by date (newest first). */
export const careersPolaroids: CareersPolaroid[] = [
  {
    src: "/images/careers/san-francisco-june-2026.png",
    description: "First billboard campaign in SF",
    location: "San Francisco",
    year: "June 2026",
    ratio: "4/3",
    rotate: -1.2,
  },
  {
    src: "/images/careers/berlin-june-2026.png",
    description: "First onsite week",
    location: "Berlin",
    year: "June 2026",
    ratio: "3/4",
    rotate: 1.2,
  },
  {
    src: "/images/careers/munich-may-2026.png",
    description: "CDTM event",
    location: "Munich",
    year: "May 2026",
    ratio: "3/4",
    rotate: -0.8,
  },
  {
    src: "/images/careers/tokyo-may-2026.png",
    description: "Shibuya crossing",
    location: "Tokyo",
    year: "May 2026",
    ratio: "4/3",
    rotate: -1.1,
  },
  {
    src: "/images/careers/tokyo-may-2026-team.png",
    description: "At ClickHouse offsite",
    location: "Tokyo",
    year: "May 2026",
    ratio: "16/9",
    rotate: 1.0,
  },
  {
    src: "/images/careers/tokyo-may-2026-ebisu.png",
    description: "Night out in Tokyo",
    location: "Tokyo",
    year: "May 2026",
    ratio: "4/3",
    rotate: -1.3,
  },
  {
    src: "/images/careers/tokyo-may-2026-event.png",
    description: "Last night atClickHouse offsite",
    location: "Tokyo",
    year: "May 2026",
    ratio: "5/4",
    rotate: 0.7,
  },
  {
    src: "/images/careers/tokyo-may-2022.png",
    description: "ClickHouse AI team dinner",
    location: "Tokyo",
    year: "2026",
    dateLabel: "Year",
    ratio: "3/2",
    rotate: -0.9,
  },
  {
    src: "/images/careers/berlin-christmas-2025.png",
    description: "Christmas dinner",
    location: "Berlin",
    year: "December 2025",
    ratio: "4/3",
    rotate: 1.1,
  },
  {
    src: "/images/careers/portugal-july-2025.png",
    description: "Langfuse offsite",
    location: "Portugal",
    year: "July 2025",
    ratio: "4/3",
    rotate: 0.9,
  },
  {
    src: "/images/careers/berlin-may-2025.png",
    description: "Team photo",
    location: "Berlin",
    year: "May 2025",
    ratio: "3/4",
    rotate: -0.9,
  },
  {
    src: "/images/careers/san-francisco-october-2024.png",
    description: "Picnic",
    location: "San Francisco",
    year: "October 2024",
    ratio: "4/3",
    rotate: -1.0,
  },
  {
    src: "/images/careers/san-francisco-july-2024.png",
    description: "Exploring SF",
    location: "San Francisco",
    year: "July 2024",
    ratio: "3/4",
    rotate: 1.1,
  },
  {
    src: "/images/careers/y-combinator-april-2023.png",
    description: "Founders at YC",
    location: "Y Combinator",
    year: "April 2023",
    ratio: "3/2",
    rotate: 0.8,
  },
  {
    src: "/images/careers/langfuse-is-born-march-2023.png",
    description: "Langfuse is born",
    location: "Berlin",
    year: "March 2023",
    ratio: "3/4",
    rotate: -1.0,
  },
];

/** Pinned first slide — always shown at the start of the gallery. */
export const LANGFUSE_IS_BORN_SRC =
  "/images/careers/langfuse-is-born-march-2023.png";

const MONTH_INDEX: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  christmas: 12,
};

/** Parse caption date for sorting (year + month; month 0 = year-only). */
export function parsePolaroidSortKey(when: string | number | undefined): {
  year: number;
  month: number;
} {
  const text = String(when ?? "").toLowerCase();
  const yearMatch = text.match(/\b(20\d{2})\b/);
  const year = yearMatch ? Number.parseInt(yearMatch[1], 10) : 0;

  for (const [name, month] of Object.entries(MONTH_INDEX)) {
    if (text.includes(name)) {
      return { year, month };
    }
  }

  return { year, month: 0 };
}

export function sortPolaroidsByDateNewestFirst(
  polaroids: CareersPolaroid[],
): CareersPolaroid[] {
  return [...polaroids].sort((a, b) => {
    const da = parsePolaroidSortKey(a.year);
    const db = parsePolaroidSortKey(b.year);

    if (da.year !== db.year) {
      return db.year - da.year;
    }

    return db.month - da.month;
  });
}

export type OrderedPolaroidGallery = {
  /** "Langfuse is born" — always first. */
  anchor: CareersPolaroid;
  /** Most recent photo by date — shown beside the anchor when distinct. */
  newest: CareersPolaroid | null;
  /** Remaining photos, newest-first. */
  rest: CareersPolaroid[];
};

/** Anchor + newest at the start; everything else sorted by date (newest first). */
export function orderPolaroidsForGallery(
  polaroids: CareersPolaroid[],
): OrderedPolaroidGallery {
  const sorted = sortPolaroidsByDateNewestFirst(polaroids);
  const anchor =
    polaroids.find((p) => p.src === LANGFUSE_IS_BORN_SRC) ??
    sorted[sorted.length - 1]!;
  const newest = sorted.find((p) => p.src !== anchor.src) ?? null;
  const rest = sorted.filter(
    (p) => p.src !== anchor.src && p.src !== newest?.src,
  );

  return { anchor, newest, rest };
}
