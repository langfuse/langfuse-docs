import Link from "next/link";
import { useEffect, useState } from "react";
import Changelog from "./Changelog";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { ChartContainer, ChartConfig } from "../ui/chart";
import { AreaChart, Area } from "recharts";
import ShimmerButton from "../magicui/shimmer-button";
import IconGithub from "../icons/github";
import { StarCount } from "../GitHubBadge";

import { GITHUB_STARS } from "../../src/github-stars";
import discussionsData from "../../src/langfuse_github_discussions.json";

// API response interface
interface ReleaseData {
  repo: string;
  latestRelease?: string;
  publishedAt?: string;
  url?: string;
}

// Helper function to create time-series data from discussions
function createTimeSeriesData(discussions: any[], days = 365, groupByDays = 7) {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Create array of date groups for the specified period
  const dateMap = new Map();
  const totalGroups = Math.ceil(days / groupByDays);

  for (let i = 0; i < totalGroups; i++) {
    const groupStartDate = new Date(
      startDate.getTime() + i * groupByDays * 24 * 60 * 60 * 1000
    );
    const groupEndDate = new Date(
      Math.min(
        groupStartDate.getTime() + (groupByDays - 1) * 24 * 60 * 60 * 1000,
        now.getTime()
      )
    );

    const dateKey = groupStartDate.toISOString().split("T")[0];
    dateMap.set(dateKey, {
      date: dateKey,
      count: 0,
      startDate: groupStartDate,
      endDate: groupEndDate,
    });
  }

  // Count discussions by creation date, grouping by the specified interval
  discussions.forEach((discussion) => {
    const discussionDate = new Date(discussion.created_at);
    if (discussionDate >= startDate) {
      // Find which group this discussion belongs to
      Array.from(dateMap.entries()).forEach(([dateKey, group]) => {
        if (
          discussionDate >= group.startDate &&
          discussionDate <= group.endDate
        ) {
          group.count += 1;
        }
      });
    }
  });

  return Array.from(dateMap.values()).map(({ date, count }) => ({
    date,
    count,
  }));
}

// Reusable StatBox component
interface StatBoxProps {
  title: string;
  mainValue: string;
  subtitle?: string;
  linkHref: string;
  linkText?: string;
  isExternal?: boolean;
  chartData?: Array<{ date: string; count: number }>;
}

function StatBox({
  title,
  mainValue,
  subtitle,
  linkHref,
  linkText = "View all →",
  isExternal = false,
  chartData,
}: StatBoxProps) {
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <div className="rounded border bg-card overflow-hidden h-full flex flex-col">
      {/* Title Section */}
      <div className="px-5 py-2 text-center border-b text-xs sm:text-base font-medium">
        <h3>{title}</h3>
      </div>

      {/* Main Content Section with Background Chart */}
      <div className="flex-1 relative">
        {/* Background Chart */}
        {chartData && (
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="50%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  fill="url(#chartGradient)"
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col justify-center items-center space-y-4 px-2 py-4 h-full">
          <div className="text-center bg-background/40 backdrop-blur-[2px] rounded-md px-3 py-2">
            <div className="font-bold text-primary text-3xl sm:text-4xl">
              {mainValue}
            </div>
            {subtitle && (
              <div className="text-sm text-primary/70">{subtitle}</div>
            )}
          </div>
          <Link
            href={linkHref}
            className="text-sm text-primary/70 hover:text-primary bg-background/30 backdrop-blur-[1px] px-2 py-1 rounded transition-all hover:bg-background/50"
            {...linkProps}
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}

const supportDiscussions =
  discussionsData.categories.find((cat) => cat.category === "Support")
    ?.discussions || [];
const ideasDiscussions =
  discussionsData.categories.find((cat) => cat.category === "Ideas")
    ?.discussions || [];

// Calculate metrics
const supportCount = supportDiscussions.length;
const ideasCount = ideasDiscussions.length;

// Create chart data for discussions
const supportChartData = createTimeSeriesData(supportDiscussions);
const ideasChartData = createTimeSeriesData(ideasDiscussions);

// Get latest activity times
const getLatestActivity = (discussions: any[]) => {
  if (discussions.length === 0) return null;
  const latest = discussions.reduce((latest, discussion) => {
    const discussionDate = new Date(discussion.updated_at);
    return discussionDate > latest ? discussionDate : latest;
  }, new Date(0));
  return latest;
};

const latestSupportActivity = getLatestActivity(supportDiscussions);
const latestIdeasActivity = getLatestActivity(ideasDiscussions);

export default function OpenSource() {
  const [releaseData, setReleaseData] = useState<ReleaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch latest release data
  useEffect(() => {
    const fetchReleaseData = async () => {
      try {
        const response = await fetch("/api/latest-releases");
        if (response.ok) {
          const data: ReleaseData[] = await response.json();
          const langfuseRelease = data.find(
            (release) => release.repo === "langfuse/langfuse"
          );
          setReleaseData(langfuseRelease || null);
        }
      } catch (error) {
        console.error("Failed to fetch release data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReleaseData();
  }, []);

  // Format time difference
  const formatTimeDiff = (date: Date | null) => {
    if (!date) return "no activity";
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  return (
    <HomeSection className="flex flex-col items-center">
      <Header
        title="Proudly Open Source"
        description={
          <span>
            Langfuse is committed to open source. You can also run it{" "}
            <Link
              href="/self-hosting/deployment/docker-compose"
              className="underline"
            >
              locally
            </Link>{" "}
            or{" "}
            <Link href="/self-hosting" className="underline">
              self-hosted
            </Link>
            .
          </span>
        }
        className="mb-0"
      />

      <Link href="https://github.com/langfuse/langfuse">
        <ShimmerButton borderRadius="0.25rem" className="mt-11">
          <div className="flex gap-4 items-center whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            <IconGithub className="text-white h-9 w-9" />
            <span>langfuse/langfuse:</span>
            <StarCount />
            <span>⭐️</span>
          </div>
        </ShimmerButton>
      </Link>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-6xl mx-auto px-5">
        <Changelog />

        <div className="grid grid-cols-2 gap-3">
          <StatBox
            title="Latest Release"
            mainValue={
              isLoading ? "loading..." : releaseData?.latestRelease || "unknown"
            }
            subtitle={
              isLoading
                ? ""
                : formatTimeDiff(
                    releaseData?.publishedAt
                      ? new Date(releaseData.publishedAt)
                      : null
                  )
            }
            linkHref={
              releaseData?.url ||
              "https://github.com/langfuse/langfuse/releases"
            }
            isExternal={true}
            linkText="View on GitHub →"
          />

          <StatBox
            title="Stars"
            mainValue={GITHUB_STARS.toLocaleString()}
            linkHref="https://github.com/langfuse/langfuse"
            isExternal={true}
          />

          <StatBox
            title="# Community Q&A"
            mainValue={supportCount.toLocaleString()}
            subtitle={`threads (last ${formatTimeDiff(latestSupportActivity)})`}
            linkHref="/gh-support"
            isExternal={true}
            chartData={supportChartData}
          />

          <StatBox
            title="# Feature Discussions"
            mainValue={ideasCount.toLocaleString()}
            subtitle={`last thread ${formatTimeDiff(latestIdeasActivity)}`}
            linkHref="/ideas"
            isExternal={true}
            chartData={ideasChartData}
          />
        </div>
      </div>
    </HomeSection>
  );
}
