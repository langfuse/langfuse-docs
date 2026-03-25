import { Logo } from "@/components/logo";
import InkeepSearchBar from "@/components/inkeep/InkeepSearchBar";
import { ToAppButton } from "@/components/ToAppButton";
import { GithubMenuBadge } from "@/components/GitHubBadge";
import Link from "next/link";

export function NavbarDocs() {
  return (
    <header
      className="sticky top-0 z-50 h-[60px] border-b backdrop-blur-md border-foreground/10 bg-background/80"
      style={{ top: "var(--fd-banner-height, 0px)" }}
    >
      <div className="mx-auto grid h-full max-w-360 grid-cols-[1fr_auto_1fr] items-center gap-4 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        {/* Left: logo */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Logo wrapInLink={false} />
            <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
              Docs
            </span>
          </Link>
        </div>

        {/* Center: search */}
        <div className="flex items-center justify-center w-full max-w-xs lg:max-w-sm">
          <InkeepSearchBar />
        </div>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-2 lg:gap-3">
          <GithubMenuBadge />
          <ToAppButton
            signedInText="Launch App"
            signUpText="Launch App"
            dropdownText="App"
          />
        </div>
      </div>
    </header>
  );
}
