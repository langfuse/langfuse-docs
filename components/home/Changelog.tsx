import { cn } from "@/lib/utils";
import Link from "next/link";
import { Page } from "nextra";
import { getPagesUnderRoute } from "nextra/context";

export default function Changelog({ className }: { className?: string }) {
  const changelog = (
    getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>
  )
    .filter(
      (page) => page.route && page.frontMatter.title && page.frontMatter.date
    )
    .slice(0, 30)
    .map(({ route, frontMatter }) => ({
      route,
      title: frontMatter.title ?? null,
      author: frontMatter.author ?? null,
      date: new Date(frontMatter.date),
    }));

  return (
    <div
      className={cn(
        "rounded-3xl ring-1 ring-primary/80 p-5 max-w-lg mx-5 sm:mx-auto",
        className
      )}
    >
      <div role="list" className="space-y-6 max-h-36 lg:max-h-96 overflow-y-scroll">
        {changelog.map((activityItem) => (
          <Link
            href={activityItem.route}
            className="relative flex gap-x-4 group"
          >
            <div className="-bottom-6 absolute left-0 top-0 flex w-6 justify-center">
              <div className="w-px bg-primary/40" />
            </div>

            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[rgba(17,17,17,var(--tw-bg-opacity))]">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/40 ring-1 ring-primary/80 opacity-60 group-hover:opacity-100" />
            </div>
            <p className="flex-auto py-0.5 text-sm leading-5 text-primary/60 opacity-80 group-hover:opacity-100">
              <span className="font-medium text-primary">
                {activityItem.title}
              </span>{" "}
              {activityItem.author ? `by ${activityItem.author}` : null}
            </p>
            {activityItem.date ? (
              <time
                dateTime={activityItem.date.toISOString()}
                className="flex-none py-0.5 text-sm leading-5 text-primary/60 opacity-80 group-hover:opacity-100"
              >
                {formatDate(activityItem.date)}
              </time>
            ) : null}
          </Link>
        ))}
      </div>
      <Link href="/changelog" className="relative flex gap-x-4 group">
        <div className="h-6 absolute left-0 top-0 flex w-6 justify-center">
          <div className="w-px bg-primary/40" />
        </div>

        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[rgba(17,17,17,var(--tw-bg-opacity))]">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40 ring-1 ring-primary/80 opacity-60 group-hover:opacity-100" />
        </div>
        <p className="flex-auto py-0.5 text-sm leading-5 text-primary/60 opacity-80 group-hover:opacity-100">
          <span className="font-medium text-primary">
            Read the full changelog ...
          </span>{" "}
          {null}
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
