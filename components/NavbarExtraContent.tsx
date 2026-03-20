import Link from "next/link";
import { GithubMenuBadge } from "@/components/GitHubBadge";
import { ToAppButton } from "@/components/ToAppButton";
import { Button } from "@/components/ui/button";

/** Shared nav actions (X, GitHub, Get Demo, To App) used in Nextra theme.config and docs navbar */
export function NavbarExtraContent() {
  return (
    <>
      <a
        className="hidden p-1 lg:inline-block hover:opacity-80"
        target="_blank"
        href="https://x.com/langfuse"
        aria-label="Langfuse X formerly known as Twitter"
        rel="nofollow noreferrer"
      >
        <svg
          aria-hidden
          fill="currentColor"
          width="24"
          height="24"
          viewBox="0 0 24 22"
        >
          <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z" />
        </svg>
      </a>

      <GithubMenuBadge />

      <Button size="xs" asChild className="whitespace-nowrap" variant="outline">
        <Link href="/talk-to-us">Get Demo</Link>
      </Button>

      <ToAppButton />
    </>
  );
}
