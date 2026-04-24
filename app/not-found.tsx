import Link from "next/link";
import { NotFoundAnimation } from "@/components/NotFoundAnimation";
import { BrokenLinkIssue } from "@/components/BrokenLinkIssue";
import { HomeLayout } from "@/components/layout";
import { Button } from "@/components/ui";

export default function NotFound() {
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
          <Button href="/">
            Go back home
          </Button>
          <div className="mt-4">
            <BrokenLinkIssue />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
