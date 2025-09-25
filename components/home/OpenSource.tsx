import Link from "next/link";
import Changelog from "./Changelog";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";

import { GITHUB_STARS } from "../../src/github-stars";
import discussionsData from "../../src/langfuse_github_discussions.json";

const supportDiscussions =
  discussionsData.categories.find((cat) => cat.category === "Support")
    ?.discussions || [];
const ideasDiscussions =
  discussionsData.categories.find((cat) => cat.category === "Ideas")
    ?.discussions || [];

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

      {/* <Link href="https://github.com/langfuse/langfuse">
        <ShimmerButton borderRadius="0.25rem" className="mt-11">
          <div className="flex gap-4 items-center whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            <IconGithub className="text-white h-9 w-9" />
            <span>langfuse/langfuse:</span>
            <StarCount />
            <span>⭐️</span>
          </div>
        </ShimmerButton>
      </Link> */}

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-6xl mx-auto px-5">
        <Changelog />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Latest Releases Box */}
          <div className="rounded border p-5 bg-card">
            <div className="px-5 py-2 text-center -mt-5 -mx-5 mb-5 border-b font-medium">
              <h3>latest releases</h3>
            </div>
            <div className="flex flex-col justify-center items-center h-32 space-y-4">
              <div className="text-center">
                <div className="font-bold text-primary text-4xl">v3.112.1</div>
                <div className="text-sm text-primary/70">2 days ago</div>
              </div>
              <Link
                href="https://github.com/langfuse/langfuse/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary/70 hover:text-primary"
              >
                view all →
              </Link>
            </div>
          </div>

          {/* GitHub Stars Box */}
          <div className="rounded border p-5 bg-card">
            <div className="px-5 py-2 text-center -mt-5 -mx-5 mb-5 border-b font-medium">
              <h3>stars</h3>
            </div>
            <div className="flex flex-col justify-center items-center h-32 space-y-4">
              <div className="text-center">
                <div className="font-bold text-primary text-4xl">
                  {GITHUB_STARS.toLocaleString()}
                </div>
              </div>
              <Link
                href="https://github.com/langfuse/langfuse"
                className="text-sm text-primary/70 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                view all →
              </Link>
            </div>
          </div>

          {/* Community Questions Box */}
          <div className="rounded border p-5 bg-card">
            <div className="px-5 py-2 text-center -mt-5 -mx-5 mb-5 border-b font-medium">
              <h3># community q&a</h3>
            </div>
            <div className="flex flex-col justify-center items-center h-32 space-y-4">
              <div className="text-center">
                <div className="font-bold text-primary text-4xl">
                  {supportCount.toLocaleString()}
                </div>
                <div className="text-sm text-primary/70">
                  latest {formatTimeDiff(latestSupportActivity)}
                </div>
              </div>
              <Link
                href="/gh-support"
                className="text-sm text-primary/70 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                view all →
              </Link>
            </div>
          </div>

          {/* Feature Discussions Box */}
          <div className="rounded border p-5 bg-card">
            <div className="px-5 py-2 text-center -mt-5 -mx-5 mb-5 border-b font-medium">
              <h3># feature discussions</h3>
            </div>
            <div className="flex flex-col justify-center items-center h-32 space-y-4">
              <div className="text-center">
                <div className="font-bold text-primary text-4xl">
                  {ideasCount.toLocaleString()}
                </div>
                <div className="text-sm text-primary/70">
                  latest {formatTimeDiff(latestIdeasActivity)}
                </div>
              </div>
              <Link
                href="/ideas"
                className="text-sm text-primary/70 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                view all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
