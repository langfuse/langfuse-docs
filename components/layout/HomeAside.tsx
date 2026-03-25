import Link from "next/link";
import { GithubMenuBadge } from "@/components/GitHubBadge";

const COMMUNITY_LINKS = [
  { title: "GitHub Discussions", href: "https://github.com/langfuse/langfuse/discussions" },
  { title: "Discord", href: "https://discord.gg/7NXusRtqYU" },
  { title: "X / Twitter", href: "https://x.com/langfuse" },
];

const QUICK_LINKS = [
  { title: "Pricing", href: "/pricing" },
  { title: "Talk to us", href: "/talk-to-us" },
  { title: "Status", href: "https://status.langfuse.com" },
  { title: "Roadmap", href: "/docs/roadmap" },
];

export function HomeAside() {
  return (
    <aside className="hidden xl:flex flex-col border-l border-border/50 bg-background sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 gap-6 w-[240px] shrink-0">
      <div>
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Community
        </p>
        <div className="mb-3">
          <GithubMenuBadge />
        </div>
        <nav className="flex flex-col gap-1">
          {COMMUNITY_LINKS.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              {title}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Quick Links
        </p>
        <nav className="flex flex-col gap-1">
          {QUICK_LINKS.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              {title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
