import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import { type Page } from "nextra";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface LaunchItemProps {
  title: string;
  route: string;
}

function LaunchItem({ title, route }: LaunchItemProps) {
  return (
    <Link
      href={route}
      className="flex items-center py-1.5 -mx-6 lg:-mx-8 px-6 lg:px-8 hover:bg-muted/50 transition-colors text-sm"
    >
      <span className="mr-2 flex-shrink-0">-</span>
      <span className="truncate">{title}</span>
    </Link>
  );
}

interface MonthBoxProps {
  month: string;
  year: number;
  launches: Array<{
    title: string;
    route: string;
  }>;
}

function MonthBox({ month, year, launches }: MonthBoxProps) {
  const monthDate = new Date(year, parseInt(month) - 1, 1);
  const monthName = monthDate.toLocaleDateString("en-US", { month: "long" });

  // Get launch week blog post URL for May and November
  const getLaunchWeekUrl = (month: string) => {
    if (month === "05") return "/blog/2025-05-19-launch-week-3";
    if (month === "11") return "/blog/2025-10-29-launch-week-4";
    return null;
  };

  const launchWeekUrl = getLaunchWeekUrl(month);

  return (
    <WrappedGridItem colSpan={1}>
      <div className="h-full flex flex-col p-6 lg:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <h3 className="text-2xl font-bold font-mono">{monthName}</h3>
          <span className="text-sm text-muted-foreground">
            {launches.length} {launches.length === 1 ? "launch" : "launches"}
          </span>
          {launchWeekUrl && (
            <Link
              href={launchWeekUrl}
              className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Launch Week
            </Link>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          {launches.map((launch, index) => (
            <LaunchItem key={index} {...launch} />
          ))}
        </div>
      </div>
    </WrappedGridItem>
  );
}

export function Launches() {
  const allPages = (
    getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>
  )
    .filter(
      (page) =>
        page.frontMatter?.date &&
        new Date(page.frontMatter.date).getFullYear() === 2025
    )
    .sort(
      (a, b) =>
        new Date(a.frontMatter.date).getTime() -
        new Date(b.frontMatter.date).getTime()
    );

  // Group by month
  const launchesByMonth = allPages.reduce(
    (acc, page) => {
      const date = new Date(page.frontMatter.date);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${month}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push({
        title: page.frontMatter.title || page.name || "Untitled",
        route: page.route,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{
        title: string;
        route: string;
      }>
    >
  );

  // Get all months and sort them (Jan to Dec)
  const months = Object.keys(launchesByMonth).sort((a, b) => {
    // Sort by year-month ascending (oldest first)
    return a.localeCompare(b);
  });

  return (
    <WrappedSection>
      <SectionHeading
        title="Launches"
        subtitle="Everything we shipped in 2025"
      />
      <WrappedGrid className="!grid-cols-1 sm:!grid-cols-1 lg:!grid-cols-3">
        {months.map((monthKey) => {
          const [year, month] = monthKey.split("-");
          return (
            <MonthBox
              key={monthKey}
              month={month}
              year={parseInt(year)}
              launches={launchesByMonth[monthKey]}
            />
          );
        })}
      </WrappedGrid>
    </WrappedSection>
  );
}

