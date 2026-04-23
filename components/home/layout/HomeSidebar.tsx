import { changelogSource } from "@/lib/source";
import { getGitHubStars } from "@/lib/github-stars";
import { LinkBox } from "@/components/ui/link-box";
import { Text } from "@/components/ui/text";
import discussionsData from "../../../src/langfuse_github_discussions.json";
import { Link } from "@/components/ui/link";

function formatCount(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const dayDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (dayDiff < 1) return "today";
  if (dayDiff < 14) return `${Math.round(dayDiff)} days ago`;
  if (dayDiff < 30) return `${Math.round(dayDiff / 7)} weeks ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ── Static data ───────────────────────────────────────────────────────────────

const githubStars = getGitHubStars();

const qaCount =
  (discussionsData.categories as Array<{ category: string; discussions: unknown[] }>)
    .find((c) => c.category === "Support")?.discussions.length ?? 0;

const ideasCount =
  (discussionsData.categories as Array<{ category: string; discussions: unknown[] }>)
    .find((c) => c.category === "Ideas")?.discussions.length ?? 0;

const communityStats: Array<{
  label: string;
  value: string;
  href: string;
  tooltip: string;
}> = [
    {
      label: "GitHub Stars",
      value: formatCount(githubStars),
      href: "https://github.com/langfuse/langfuse",
      tooltip: "Leave a Star ⭐",
    },
    {
      label: "Contributors",
      value: "300+",
      href: "https://github.com/langfuse/langfuse/graphs/contributors",
      tooltip: "View contributors",
    },
    {
      label: "Community Q&A threads",
      value: formatCount(qaCount),
      href: "https://github.com/orgs/langfuse/discussions/categories/support",
      tooltip: "Browse Q&A",
    },
    {
      label: "Roadmap threads",
      value: formatCount(ideasCount),
      href: "https://github.com/orgs/langfuse/discussions/categories/ideas",
      tooltip: "Browse ideas",
    },
  ];

const selfHostingLinks = [
  { label: "Docker Compose", href: "/self-hosting/deployment/docker-compose" },
  { label: "Kubernetes (Helm)", href: "/self-hosting/deployment/kubernetes-helm" },
  { label: "AWS (Terraform)", href: "/self-hosting/deployment/aws" },
  { label: "GCP (Terraform)", href: "/self-hosting/deployment/gcp" },
  { label: "Azure (Terraform)", href: "/self-hosting/deployment/azure" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeSidebar() {
  const changelogItems = changelogSource
    .getPages()
    .filter((p) => p.data.title && p.data.date)
    .sort(
      (a, b) =>
        new Date(b.data.date as string).getTime() -
        new Date(a.data.date as string).getTime()
    )
    .slice(0, 3)
    .map((p) => ({
      route: p.url,
      title: p.data.title as string,
      date: new Date(p.data.date as string).toISOString(),
    }));

  const latestReleaseDate = changelogItems[0]?.date;

  return (
    <aside
      className="hidden lg:flex flex-col bg-line-structure sticky p-px pt-0 w-[240px] shrink-0"
      style={{
        top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height))",
        height: "calc(100vh - var(--fd-banner-height, 0px) - var(--lf-nav-primary-height))",
      }}
    >
      <nav className="flex overflow-y-auto overflow-x-hidden flex-col flex-1 rounded-sm bg-surface-1">
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <Text size="s" className="px-2 mb-3 font-[430] text-left text-[13px] text-text-primary">Community Stats</Text>
            <div className="flex flex-col gap-[2px] mb-[2px]">
              {communityStats.map((stat) => (
                <LinkBox
                  key={stat.label}
                  href={stat.href}
                  tooltip={stat.tooltip}
                  className="block px-2 w-full hover:bg-surface-bg"
                >
                  <div className="flex gap-2 justify-between items-center w-full">
                    <Text size="s" className="text-left group-hover:text-text-primary text-[13px]">{stat.label}</Text>
                    <Text size="s" className="tabular-nums text-right shrink-0 text-[13px] group-hover:text-text-primary">
                      {stat.value}
                    </Text>
                  </div>
                </LinkBox>
              ))}
            </div>

            {latestReleaseDate && (
              <LinkBox
                href="https://github.com/langfuse/langfuse/releases"
                tooltip="View releases"
                className="block px-2 w-full hover:bg-surface-bg"
              >
                <div className="flex gap-2 justify-between items-center w-full">
                  <Text size="s" className="text-left text-[13px] group-hover:text-text-primary">Latest OSS release</Text>
                  <Text size="s" className="text-right text-[13px] shrink-0 group-hover:text-text-primary">
                    {formatRelativeDate(latestReleaseDate)}
                  </Text>
                </div>
              </LinkBox>
            )}
          </div>
        </div>

        {/* ── Changelog ─────────────────────────────────────────────────── */}
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <div className="flex justify-between items-center px-2 mb-3">
              <Text size="s" className="font-[430] text-[13px] text-left text-text-primary">
                Changelog
              </Text>
              <Link href="/changelog">
                <Text size="xs" className="transition-colors hover:text-text-primary">
                  View All
                </Text>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {changelogItems.map((item) => (
                <LinkBox
                  key={item.route}
                  href={item.route}
                  tooltip="Read article"
                  tooltipPlacement="bottom-right"
                  className="block px-2 w-full hover:bg-surface-bg"
                >
                  <div className="flex flex-col gap-1.5">
                    <Text size="s" className="leading-snug text-left text-[13px] group-hover:text-text-primary">
                      {item.title}
                    </Text>
                    <Text size="xs" className="text-left no-underline group-hover:text-text-primary">
                      {formatRelativeDate(item.date)}
                    </Text>
                  </div>
                </LinkBox>
              ))}
            </div>
          </div>
        </div>

        {/* ── Self Hosting Guides ────────────────────────────────────────── */}
        <div className="pb-px bg-line-structure">
          <div className="px-2 py-4 rounded-sm bg-surface-1">
            <Text
              size="s"
              className="block px-2 mb-2 font-[430] text-left text-[13px] text-text-primary"
            >
              Self Hosting Guides
            </Text>
            <div className="flex flex-col gap-[2px]">
              {selfHostingLinks.map((link) => (
                <LinkBox key={link.href} href={link.href} className="block px-2 w-full hover:bg-surface-bg">
                  <Text size="s" className="text-left text-text-tertiary text-[13px] group-hover:text-text-primary">
                    {link.label}
                  </Text>
                </LinkBox>
              ))}
            </div>
          </div>
        </div>

        <span className="flex px-px w-full bg-line-structure h-[3px]">
          <span className="w-full h-full rounded-t-sm bg-surface-1" />
        </span>
      </nav>
    </aside>
  );
}
