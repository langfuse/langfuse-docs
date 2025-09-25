import Link from "next/link";
import { useEffect, useState } from "react";
import Changelog from "./Changelog";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import ShimmerButton from "../magicui/shimmer-button";
import IconGithub from "../icons/github";
import { StarCount } from "../GitHubBadge";
import { Button } from "../ui/button";

import discussionsData from "../../src/langfuse_github_discussions.json";
import IconAWS from "../icons/aws";
import IconAzure from "../icons/azure";
import IconGCP from "../icons/gcp";

// Discussion item interface
interface Discussion {
  number: number;
  title: string;
  href: string;
  created_at: string;
  updated_at: string;
  upvotes: number;
  comment_count: number;
  resolved: boolean;
  labels: string[];
  author: {
    login: string;
    html_url: string;
  };
  category: string;
}

// Individual discussion item component
function DiscussionItem({ discussion }: { discussion: Discussion }) {
  return (
    <div className="flex flex-col space-y-1 p-3 border-b border-border/10 text-xs">
      <div className="font-medium text-foreground/30 truncate leading-relaxed">
        {discussion.title}
      </div>
      <div className="flex items-center justify-between text-foreground/20">
        <span className="truncate max-w-[60%]">@{discussion.author.login}</span>
        <div className="flex items-center space-x-2 text-[10px]">
          {discussion.resolved && <span className="text-green-500/50">✓</span>}
          <span>{discussion.upvotes}↑</span>
          <span>{discussion.comment_count}💬</span>
        </div>
      </div>
    </div>
  );
}

// Scrolling discussions background component
function ScrollingDiscussions({
  discussions,
  speed = "30s",
}: {
  discussions: Discussion[];
  speed?: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
      <div
        className="animate-marquee-vertical space-y-0"
        style={
          {
            "--duration": speed,
            "--gap": "0px",
            animationDirection: "reverse",
          } as React.CSSProperties
        }
      >
        {/* Duplicate discussions to create seamless loop */}
        {[...discussions].map((discussion, index) => (
          <DiscussionItem
            key={`${discussion.number}-${index}`}
            discussion={discussion}
          />
        ))}
      </div>
    </div>
  );
}

// API response interface
interface ReleaseData {
  repo: string;
  latestRelease?: string;
  publishedAt?: string;
  url?: string;
}

// Reusable StatBox component
interface StatBoxProps {
  title: string;
  mainValue: string;
  subtitle?: string;
  linkHref: string;
  linkText?: string;
  isExternal?: boolean;
  discussions?: Discussion[];
}

function StatBox({
  title,
  mainValue,
  subtitle,
  linkHref,
  linkText = "View all →",
  isExternal = false,
  discussions,
}: StatBoxProps) {
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className="rounded border bg-card overflow-hidden h-full flex flex-col">
      {/* Title Section */}
      <div className="px-5 py-2 text-center border-b text-xs sm:text-base font-medium">
        <h3>{title}</h3>
      </div>

      {/* Main Content Section with Background Discussions */}
      <div className="flex-1 relative">
        {/* Background Discussions */}
        {discussions && discussions.length > 0 && (
          <ScrollingDiscussions discussions={discussions} />
        )}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col justify-center items-center space-y-1 px-2 py-4 h-full">
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
  discussionsData.categories
    .find((cat) => cat.category === "Support")
    ?.discussions.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    ) || [];
const supportDiscussionsTop50 = supportDiscussions.slice(0, 20);

const ideasDiscussions =
  discussionsData.categories
    .find((cat) => cat.category === "Ideas")
    ?.discussions.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    ) || [];

const ideasDiscussionsTop50 = ideasDiscussions.slice(0, 20);

// Calculate metrics
const supportCount = supportDiscussions.length;
const ideasCount = ideasDiscussions.length;

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          {/* Self-Host Langfuse Card */}
          <div className="rounded border bg-card overflow-hidden h-full flex flex-col">
            {/* Title Section */}
            <div className="px-5 py-2 text-center border-b text-xs sm:text-base font-medium">
              <h3>Self-Host Langfuse</h3>
            </div>

            {/* Main Content Section */}
            <div className="flex-1 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"></div>
                <div className="absolute top-4 right-4 text-6xl opacity-20">
                  🚀
                </div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-15">
                  ⚡
                </div>
              </div>

              {/* Foreground Content */}
              <div className="relative z-10 flex flex-col justify-center items-center space-y-3 px-3 py-4 h-full">
                {/* Deployment Options */}
                <div className="space-y-2 w-full">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2"
                  >
                    <Link href="/self-hosting/deployment/docker-compose">
                      <span className="flex items-center gap-2">
                        <span>🐳</span>
                        Docker Compose
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2"
                  >
                    <Link href="/self-hosting/deployment/kubernetes-helm">
                      <span className="flex items-center gap-2">
                        <span>⚓</span>
                        Kubernetes (Helm)
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2"
                  >
                    <Link href="/self-hosting/deployment/aws">
                      <span className="flex items-center gap-2">
                        <span>
                          <IconAWS />
                        </span>
                        AWS (Terraform)
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2"
                  >
                    <Link href="/self-hosting/deployment/gcp">
                      <span className="flex items-center gap-2">
                        <span>
                          <IconGCP />
                        </span>
                        GCP (Terraform)
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2"
                  >
                    <Link href="/self-hosting/deployment/azure">
                      <span className="flex items-center gap-2">
                        <span>
                          <IconAzure />
                        </span>
                        Azure (Terraform)
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <StatBox
            title="# Community Q&A"
            mainValue={supportCount.toLocaleString()}
            subtitle={`threads (last ${formatTimeDiff(latestSupportActivity)})`}
            linkHref="/gh-support"
            isExternal={true}
            discussions={supportDiscussionsTop50}
          />

          <StatBox
            title="# Feature Discussions"
            mainValue={ideasCount.toLocaleString()}
            subtitle={`last thread ${formatTimeDiff(latestIdeasActivity)}`}
            linkHref="/ideas"
            isExternal={true}
            discussions={ideasDiscussionsTop50}
          />
        </div>
      </div>
    </HomeSection>
  );
}
