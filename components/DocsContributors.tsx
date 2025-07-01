import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { allAuthors } from "./Authors";
import contributorsData from "../data/generated/contributors.json";
import Image from "next/image";

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

const processContributor = (username: string) => {
  const author = Object.values(allAuthors).find(
    (author) => author.github === username
  );

  if (author) {
    // Internal contributor
    return {
      username,
      name: author.name,
      title: author.title || "Team Member",
      image: author.image,
      profileUrl:
        "twitter" in author
          ? `https://twitter.com/${author.twitter}`
          : `https://github.com/${author.github}`,
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
          <a
            key={contributor.username}
            href={contributor.profileUrl}
            className="group flex items-center gap-2.5 p-2 rounded-md hover:bg-accent transition-colors"
            target="_blank"
            rel="noopener noreferrer"
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
              <div className="text-xs text-muted-foreground">
                {contributor.title}
              </div>
            </div>
          </a>
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
