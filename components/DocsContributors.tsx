"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect, forwardRef } from "react";
import { allAuthors, Author, AuthorHoverCardContent } from "./Authors";
import contributorsData from "../data/generated/contributors.json";
import Image from "next/image";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowUpRight, Github } from "lucide-react";
import InkeepChatButton from "@/components/inkeep/InkeepChatButton";
import Link from "next/link";

// ─── Utility functions ────────────────────────────────────────────────────────

const getGithubEditUrl = (path: string): string | null => {
  const cleanPath = path.split("#")[0].split("?")[0];
  const [, section, ...slugParts] = cleanPath.split("/");

  const sectionToDir: Record<string, string> = {
    docs: "content/docs",
    guides: "content/guides",
    handbook: "content/handbook",
    integrations: "content/integrations",
    "self-hosting": "content/self-hosting",
    library: "content/library",
  };

  const contentDir = sectionToDir[section];
  if (!contentDir) return null;

  const slugPath = slugParts.join("/");
  const filePath = `${contentDir}/${slugPath === "" ? "index" : slugPath}.mdx`;
  return `https://github.com/langfuse/langfuse-docs/edit/main/${filePath}`;
};

const getFeedbackUrl = (pageTitle?: string): string => {
  const title = (pageTitle ?? "this page").trim();
  const params = new URLSearchParams({
    title: `Feedback for "${title}"`,
    labels: "feedback",
  });
  return `https://github.com/langfuse/langfuse-docs/issues/new?${params.toString()}`;
};

const getContributors = (path: string): string[] => {
  const variants = [
    path,
    path.endsWith("/index") ? path.slice(0, -6) : `${path}/index`,
  ];
  for (const variant of variants) {
    const contributors = (contributorsData as Record<string, string[]>)[variant];
    if (contributors?.length > 0) return contributors;
  }
  return [];
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ProcessedContributor = {
  username: string;
  name: string;
  title: string;
  image: string;
  profileUrl: string;
  author?: Author;
};

// ─── Contributor card ─────────────────────────────────────────────────────────

const ContributorCardContent = forwardRef<
  HTMLAnchorElement,
  { contributor: ProcessedContributor } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ contributor, ...props }, ref) => (
  <a
    ref={ref}
    href={contributor.profileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 py-1 rounded-sm hover:opacity-80 transition-opacity"
    {...props}
  >
    <Image
      src={contributor.image}
      width={28}
      height={28}
      className="rounded-full shrink-0"
      alt={contributor.name}
    />
    <span className="text-sm text-text-secondary truncate">{contributor.name}</span>
  </a>
));
ContributorCardContent.displayName = "ContributorCardContent";

const ContributorCard = ({ contributor }: { contributor: ProcessedContributor }) => {
  if (contributor.author) {
    return (
      <HoverCard openDelay={50} closeDelay={50}>
        <HoverCardTrigger asChild>
          <ContributorCardContent contributor={contributor} />
        </HoverCardTrigger>
        <AuthorHoverCardContent author={contributor.author} side="left" />
      </HoverCard>
    );
  }
  return <ContributorCardContent contributor={contributor} />;
};

const processContributor = (username: string): ProcessedContributor => {
  const author = Object.values(allAuthors).find((a) => a.github === username);
  if (author) {
    return {
      username,
      name: author.name,
      title: author.title || "Team Member",
      image: author.image,
      profileUrl: `https://github.com/${author.github}`,
      author,
    };
  }
  return {
    username,
    name: username,
    title: "Contributor",
    image: `https://github.com/${username}.png?size=64`,
    profileUrl: `https://github.com/${username}`,
  };
};

// ─── X / Twitter icon (simple SVG) ───────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type DocsContributorsProps = {
  pageTitle?: string;
};

export const DocsContributors = ({ pageTitle }: DocsContributorsProps) => {
  const pathname = usePathname() ?? "";
  const currentPath = pathname.split("#")[0].split("?")[0];
  const [showAll, setShowAll] = useState(false);
  const editUrl = getGithubEditUrl(currentPath);
  const feedbackUrl = getFeedbackUrl(pageTitle);

  useEffect(() => {
    setShowAll(false);
  }, [currentPath]);

  const contributors = getContributors(currentPath);
  const processedContributors = contributors.map(processContributor);
  const displayedContributors = showAll
    ? processedContributors
    : processedContributors.slice(0, 3);
  const remainingCount = Math.max(0, processedContributors.length - 3);

  return (
    <div className="toc-footer flex flex-col gap-5">
      {/* Actions */}
      {(editUrl || feedbackUrl) && (
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Actions</p>
          <div className="flex flex-col gap-1.5">
            {feedbackUrl && (
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Give us feedback
                <ArrowUpRight size={13} className="shrink-0" />
              </a>
            )}
            {editUrl && (
              <a
                href={editUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Edit this page on GitHub
              </a>
            )}
          </div>
        </div>
      )}

      {/* Contributors */}
      {processedContributors.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-text-primary mb-1">Contributors</p>
          <div className="flex flex-col">
            {displayedContributors.map((contributor) => (
              <React.Fragment key={contributor.username}>
                <ContributorCard contributor={contributor} />
              </React.Fragment>
            ))}
            {remainingCount > 0 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer text-left py-1"
              >
                +{remainingCount} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* Community */}
      <div>
        <p className="text-sm font-semibold text-text-primary mb-2">Community</p>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/langfuse/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </Link>
          <Link
            href="https://x.com/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="X / Twitter"
          >
            <XIcon className="size-[17px]" />
          </Link>
          <div className="ml-auto">
            <InkeepChatButton />
          </div>
        </div>
      </div>
    </div>
  );
};
