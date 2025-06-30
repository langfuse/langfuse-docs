import { useRouter } from "next/router";
import { allAuthors, Author } from "./Authors";
import contributorsData from "../data/generated/contributors.json";
import Image from "next/image";

export const DocsContributors = () => {
  const router = useRouter();

  // Get the current page path
  const currentPath = router.asPath.split("#")[0].split("?")[0];

  // Try different path variations to handle index pages
  let contributors = contributorsData[currentPath] || [];

  // If no contributors found, try with /index suffix for index pages
  if (contributors.length === 0 && !currentPath.endsWith("/index")) {
    contributors = contributorsData[currentPath + "/index"] || [];
  }

  // If still no contributors and path ends with /index, try without it
  if (contributors.length === 0 && currentPath.endsWith("/index")) {
    contributors = contributorsData[currentPath.replace("/index", "")] || [];
  }

  // Filter to only include known authors
  const validContributors = contributors.filter(
    (contributor: string) => contributor in allAuthors
  );

  if (validContributors.length === 0) {
    return null;
  }

  const displayedContributors = validContributors.slice(0, 3);
  const remainingCount = validContributors.length - 3;

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="text-sm font-medium text-foreground mb-2">
        Contributors
      </div>
      <div>
        {displayedContributors.map((contributor: string) => {
          const author = allAuthors[contributor];
          if (!author) return null;

          return (
            <a
              key={contributor}
              href={
                author.twitter ? `https://twitter.com/${author.twitter}` : "#"
              }
              className="group flex items-center gap-2.5 p-2 rounded-md hover:bg-accent transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={author.image}
                width={32}
                height={32}
                className="rounded-full flex-shrink-0"
                alt={`Picture ${author.name}`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-primary">
                  {author.name}
                </div>
                {author.title && (
                  <div className="text-xs text-muted-foreground">
                    {author.title}
                  </div>
                )}
              </div>
            </a>
          );
        })}
        {remainingCount > 0 && (
          <div className="mt-1 text-xs text-muted-foreground italic pl-2">
            ... and {remainingCount} more
          </div>
        )}
      </div>
    </div>
  );
};
