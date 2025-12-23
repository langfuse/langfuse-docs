import Link from "next/link";
import contributors from "./data/oss-contributors-2025.json";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

export function OSS() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Open Source"
        subtitle="Built in the open, with the community"
      />
      <div className="flex flex-wrap items-center gap-3">
        {contributors.map((contributor) => (
          <Link
            key={contributor.login}
            href={contributor.url}
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-sm hover:bg-muted transition-colors"
          >
            {contributor.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={contributor.avatarUrl}
                alt={contributor.login}
                className="h-6 w-6 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="h-6 w-6 rounded-full bg-muted" />
            )}
            <span className="font-medium">@{contributor.login}</span>
          </Link>
        ))}
      </div>
    </WrappedSection>
  );
}