import { NotFoundAnimation } from "@/components/NotFoundAnimation";
import { BrokenLinkIssue } from "@/components/BrokenLinkIssue";
import { HomeLayout } from "@/components/layout";
import { Button } from "@/components/ui";

/**
 * Body of the 404 page.
 *
 * Shared by the per-root-layout `not-found.tsx` files (which are wrapped in an
 * `<html>` by their root layout) and by `app/not-found.tsx` (which renders for
 * URLs that match no root layout and so supplies its own document shell).
 */
export function NotFoundContent() {
  return (
    <HomeLayout showAside={false} forceLight={false}>
      <div className="flex flex-col items-center justify-center text-center sm:py-20 min-h-[calc(100vh-4rem)]">
        <NotFoundAnimation />
        <div className="flex flex-col gap-6 justify-center items-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="mt-6 text-2xl font-bold">404: Page Not Found</h1>
            <p className="mt-2 text-muted-foreground">
              The page you were looking for does not exist.
            </p>
          </div>
          <div className="flex flex-row flex-wrap gap-3 justify-center items-center">
            <Button size="default" href="/">
              Go back home
            </Button>
            <BrokenLinkIssue />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
