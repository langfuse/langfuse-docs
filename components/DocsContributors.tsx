import { useRouter } from "next/router";
import React, { useState, useEffect, forwardRef } from "react";
import { allAuthors, Author, AuthorHoverCardContent } from "./Authors";
import contributorsData from "../data/generated/contributors.json";
import Image from "next/image";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";

const getContributors = (path: string): string[] => {
  // Try exact path first, then with/without /index suffix
  const variants = [
    path,
    path.endsWith("/index") ? path.slice(0, -6) : `${path}/index`,
  ];

  for (const variant of variants) {
    const contributors = contributorsData[variant];
    if (contributors?.length > 0) return contributors;
  }

  return [];
};

type ProcessedContributor = {
  username: string;
  name: string;
  title: string;
  image: string;
  profileUrl: string;
  author?: Author; // Full author object for team members (enables hovercard)
};

const ContributorCardContent = forwardRef<
  HTMLAnchorElement,
  {
    contributor: ProcessedContributor;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ contributor, className, ...props }, ref) => (
  <a
    ref={ref}
    href={contributor.profileUrl}
    className="group flex items-center gap-2.5 p-1 rounded-md hover:bg-accent transition-colors mb-1"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  >
    <Image
      src={contributor.image}
      width={32}
      height={32}
      className="rounded-full flex-shrink-0"
      alt={contributor.name}
    />
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-foreground group-hover:text-primary">
        {contributor.name}
      </div>
      <div className="text-xs text-muted-foreground">{contributor.title}</div>
    </div>
  </a>
));
ContributorCardContent.displayName = "ContributorCardContent";

const ContributorCard = ({
  contributor,
}: {
  contributor: ProcessedContributor;
}) => {
  // Team members get a hovercard with social links
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

  // External contributors just get a plain link
  return <ContributorCardContent contributor={contributor} />;
};

const processContributor = (username: string): ProcessedContributor => {
  const author = Object.values(allAuthors).find(
    (author) => author.github === username,
  );

  if (author) {
    // Internal contributor - always link to GitHub
    return {
      username,
      name: author.name,
      title: author.title || "Team Member",
      image: author.image,
      profileUrl: `https://github.com/${author.github}`,
      author, // Include full author for hovercard
    };
  }

  // External contributor
  return {
    username,
    name: username,
    title: "Contributor",
    image: `https://github.com/${username}.png?size=64`,
    profileUrl: `https://github.com/${username}`,
  };
};

export const DocsContributors = () => {
  const router = useRouter();
  const currentPath = router.asPath.split("#")[0].split("?")[0];
  const [showAll, setShowAll] = useState(false);

  // Reset showAll when the page changes
  useEffect(() => {
    setShowAll(false);
  }, [currentPath]);

  const contributors = getContributors(currentPath);
  if (contributors.length === 0) return null;

  const processedContributors = contributors.map(processContributor);
  const displayedContributors = showAll
    ? processedContributors
    : processedContributors.slice(0, 3);
  const remainingCount = Math.max(0, processedContributors.length - 3);

  return (
    <div className="mt-1 pt-4 border-t border-border w-full">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Contributors
      </div>
      <div>
        {displayedContributors.map((contributor) => (
          <ContributorCard
            key={contributor.username}
            contributor={contributor}
          />
        ))}
        {remainingCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-1 text-xs text-muted-foreground hover:text-foreground italic pl-2 transition-colors cursor-pointer"
          >
            ... and {remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
};
