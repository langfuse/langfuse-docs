export type TagWithCount = { name: string; count: number };

export type BlogFrontMatter = {
  showInBlogIndex?: boolean;
  tag?: string;
};

export function normalizeTags(tagString?: string): string[] {
  if (tagString == null || typeof tagString !== "string") return [];
  return tagString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

export function computeTagCounts(
  tagStrings: (string | undefined)[],
): TagWithCount[] {
  const counts = new Map<string, number>();
  for (const tagStr of tagStrings) {
    for (const tag of normalizeTags(tagStr)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Parse a calendar date as UTC midnight.
 * Frontmatter uses `YYYY/MM/DD`, which `new Date()` treats as local time.
 * Formatting that instant with `timeZone: "UTC"` then shifts a day east of UTC.
 */
export function parseCalendarDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const calendar = dateStr.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (calendar) {
    const year = Number(calendar[1]);
    const month = Number(calendar[2]);
    const day = Number(calendar[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) {
      return null;
    }
    return parsed;
  }
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}

/** Stable UTC date for list rows. Avoids hydration/CLS from relative labels. */
export function formatAbsoluteDate(dateStr?: string): string {
  const d = parseCalendarDate(dateStr);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const CALENDAR_DATE = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;

/**
 * Whole calendar days between `dateStr` and today in the viewer's local
 * calendar. Calendar dates are taken as-is; timestamps are first converted to
 * the viewer's local day. Comparing against the current instant instead would
 * count a post from earlier today as one day old after UTC noon.
 */
export function calendarDaysSince(
  dateStr?: string,
  now: Date = new Date(),
): number | null {
  const d = parseCalendarDate(dateStr);
  if (!d || !dateStr) return null;
  const day = CALENDAR_DATE.test(dateStr.trim())
    ? d.getTime()
    : Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - day) / MS_PER_DAY);
}

export function formatDate(dateStr?: string, now: Date = new Date()): string {
  const d = parseCalendarDate(dateStr);
  const diffDays = calendarDaysSince(dateStr, now);
  if (!d || diffDays === null) return "";
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1 Day Ago";
  if (diffDays < 14) return `${diffDays} Days Ago`;
  if (diffDays < 30) return `${Math.round(diffDays / 7)} Weeks Ago`;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Lowercase, short-month variant used in the home sidebar. */
export function formatShortRelativeDate(
  dateStr?: string,
  now: Date = new Date(),
): string {
  const d = parseCalendarDate(dateStr);
  const diffDays = calendarDaysSince(dateStr, now);
  if (!d || diffDays === null) return "";
  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 14) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.round(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
