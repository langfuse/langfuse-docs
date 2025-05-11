import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function WatchDemoPage() {
  return (
    <div>
      <Header
        title="Watch a Demo"
        description="10 Minute Walkthrough of All Langfuse Features"
        h="h1"
      />
      <div className="flex md:flex-col flex-col-reverse gap-4">
        <div className="flex flex-row gap-4 bg-card p-4 rounded border items-start md:items-center">
          <Image
            src="/images/people/marcklingen.jpg"
            alt="Marc Klingen"
            width={40}
            height={40}
            className="rounded-full aspect-square"
          />
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
            <span className="text-sm">
              Watch this demo for a complete overview of Langfuse features.
              Considering our paid plans and have additional questions? Let's
              chat about your needs.{" "}
              <span className="inline-block">
                –{" "}
                <Link
                  href="https://www.linkedin.com/in/marcklingen"
                  className="font-medium"
                >
                  Marc Klingen
                </Link>
                , Co-founder and CEO
              </span>
            </span>
            <Button
              className="whitespace-nowrap"
              variant="secondary"
              size="sm"
              asChild
            >
              <Link href="/talk-to-us">Talk to us</Link>
            </Button>
          </div>
        </div>
        <iframe
          width="100%"
          className="aspect-[16/9] rounded border w-full"
          src="https://www.youtube-nocookie.com/embed/2E8iTvGo9Hs?si=bT3wbaxdv2DIBCBo"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
