import Link from "next/link";

/**
 * Release timeline for Langfuse Cloud and self-hosted (OSS), in the style of
 * the Node.js release schedule. Each segment is a link to the relevant docs
 * section. Dates are month-granular; edit the `ROWS` data below when the
 * schedule changes.
 */

const AXIS_START = { year: 2026, month: 1 }; // Jan 2026
const AXIS_END = { year: 2027, month: 4 }; // Apr 2027

type Month = { year: number; month: number };

type Segment = {
  label: string;
  from: Month;
  to: Month;
  href: string;
  title: string;
  className: string;
};

const SEGMENT_STYLES = {
  ga: "bg-muted-green text-foreground",
  previous: "bg-muted text-muted-foreground",
  preview: "bg-muted-blue text-foreground",
  expected:
    "bg-muted-green/30 text-foreground border border-dashed border-muted-foreground",
} as const;

const ROWS: { name: string; segments: Segment[] }[] = [
  {
    name: "Langfuse Cloud",
    segments: [
      {
        label: "v3",
        from: { year: 2026, month: 1 },
        to: { year: 2026, month: 3 },
        href: "/docs/compatibility#sdk-server",
        title: "Langfuse Cloud ran v3 until March 2026",
        className: SEGMENT_STYLES.previous,
      },
      {
        label: "v3 + v4 Preview",
        from: { year: 2026, month: 3 },
        to: { year: 2026, month: 11 },
        href: "/docs/v4",
        title:
          "Since March 10, 2026: v3 with all v4 features available in preview",
        className: SEGMENT_STYLES.preview,
      },
      {
        label: "v4",
        from: { year: 2026, month: 11 },
        to: AXIS_END,
        href: "/docs/v4",
        title:
          "From October 31, 2026, v4 is the only experience on Langfuse Cloud and legacy APIs are removed",
        className: SEGMENT_STYLES.ga,
      },
    ],
  },
  {
    name: "Self-hosted (OSS)",
    segments: [
      {
        label: "v3",
        from: { year: 2026, month: 1 },
        to: { year: 2026, month: 8 },
        href: "/docs/compatibility#sdk-server",
        title: "Self-hosted GA version is v3",
        className: SEGMENT_STYLES.previous,
      },
      {
        label: "v4 (from Aug 1, 2026)",
        from: { year: 2026, month: 8 },
        to: AXIS_END,
        href: "/self-hosting/upgrade",
        title: "v4 launches for self-hosted deployments by August 1, 2026",
        className: SEGMENT_STYLES.expected,
      },
    ],
  },
];

const TICKS: Month[] = [
  { year: 2026, month: 1 },
  { year: 2026, month: 4 },
  { year: 2026, month: 7 },
  { year: 2026, month: 10 },
  { year: 2027, month: 1 },
  { year: 2027, month: 4 },
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function monthIndex(m: Month): number {
  return m.year * 12 + (m.month - 1);
}

const AXIS_TOTAL = monthIndex(AXIS_END) - monthIndex(AXIS_START);

function pct(m: Month): number {
  return ((monthIndex(m) - monthIndex(AXIS_START)) / AXIS_TOTAL) * 100;
}

export function VersionTimeline() {
  return (
    <div className="my-6 overflow-x-auto">
      <div className="min-w-[640px] pr-8">
        {/* Axis labels */}
        <div className="relative ml-36 mb-1 h-5 text-xs text-muted-foreground">
          {TICKS.map((t) => (
            <span
              key={`${t.year}-${t.month}`}
              className="absolute -translate-x-1/2"
              style={{ left: `${pct(t)}%` }}
            >
              {MONTH_LABELS[t.month - 1]} {t.year}
            </span>
          ))}
        </div>
        {/* Rows */}
        <div className="relative">
          {/* Tick grid lines */}
          <div className="absolute inset-y-0 left-36 right-0">
            {TICKS.map((t) => (
              <span
                key={`${t.year}-${t.month}`}
                className="absolute inset-y-0 border-l border-line-structure"
                style={{ left: `${pct(t)}%` }}
              />
            ))}
          </div>
          {ROWS.map((row) => (
            <div
              key={row.name}
              className="relative flex items-center gap-0 py-1.5"
            >
              <div className="w-36 shrink-0 pr-3 text-right text-sm font-medium">
                {row.name}
              </div>
              <div className="relative h-10 flex-1">
                {row.segments.map((seg) => (
                  <Link
                    key={seg.label}
                    href={seg.href}
                    title={seg.title}
                    className={`absolute inset-y-0 flex items-center overflow-hidden rounded px-3 text-sm font-medium no-underline hover:opacity-80 ${seg.className}`}
                    style={{
                      left: `calc(${pct(seg.from)}% + 1px)`,
                      width: `calc(${pct(seg.to) - pct(seg.from)}% - 2px)`,
                    }}
                  >
                    <span className="truncate">{seg.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
