import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ChangelogItem {
  route: string;
  title: string | null;
  author: string | null;
  date: string; // ISO string
}

export default function Changelog({
  className,
  items,
}: {
  className?: string;
  items: ChangelogItem[];
}) {
  return (
    <div
      className={cn("rounded border p-5 bg-card", className)}
      role="region"
      aria-labelledby="changelog-heading"
    >
      <div className="px-5 py-2 text-center -mt-5 -mx-5 mb-5 border-b font-medium text-xs sm:text-base">
        <h3 id="changelog-heading">Changelog</h3>
      </div>
      <div
        role="list"
        className="space-y-6 max-h-52 lg:max-h-96 overflow-y-scroll"
        aria-label="Recent changelog entries"
      >
        {items.map((activityItem) => {
          const date = new Date(activityItem.date);
          return (
            <Link
              href={activityItem.route}
              className="relative flex gap-x-4 group"
              key={activityItem.route}
              role="listitem"
              aria-label={`Changelog entry for ${activityItem.title}`}
            >
              <div className="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
                <div className="w-px bg-secondary" />
              </div>

              <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-card">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary ring-1 ring-primary/80 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="flex-auto py-0.5 text-sm leading-5 text-primary/70 opacity-80 group-hover:opacity-100">
                <span className="font-medium text-primary">
                  {activityItem.title}
                </span>{" "}
                {activityItem.author ? `by ${activityItem.author}` : null}
              </p>
              <time
                dateTime={date.toISOString()}
                className="flex-none py-0.5 text-sm leading-5 text-primary/70 opacity-80 group-hover:opacity-100"
                aria-label={`Date: ${formatDate(date)}`}
              >
                {formatDate(date)}
              </time>
            </Link>
          );
        })}
      </div>
      <Link
        key="root"
        href="/changelog"
        className="relative flex gap-x-4 group"
        role="button"
        aria-label="Read the full changelog"
      >
        <div className="h-6 absolute left-0 top-0 flex w-6 justify-center">
          <div className="w-px bg-secondary" />
        </div>

        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-card">
          <div className="h-1.5 w-1.5 rounded-full bg-secondary ring-1 ring-primary/80 opacity-60 group-hover:opacity-100" />
        </div>
        <p className="flex-auto py-0.5 text-sm leading-5 text-primary/60 opacity-80 group-hover:opacity-100">
          <span className="font-medium text-primary">
            Read the full changelog ...
          </span>
        </p>
      </Link>
    </div>
  );
}

function formatDate(date: Date) {
  const dayDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (dayDiff < 1) return "today";
  if (dayDiff < 14) return `${Math.round(dayDiff)} days ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
