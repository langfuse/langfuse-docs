"use client";

import { Background } from "./Background";
import { ScheduleDemo } from "./CalComScheduleDemo";
import { Header } from "./Header";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ScheduleDemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region");

  const isValidRegion = selectedRegion === "us" || selectedRegion === "eu";

  const handleRegionSelect = (region: "us" | "eu") => {
    router.replace(`?region=${region}`);
  };

  return (
    <section className="flex flex-col gap-10 w-full min-h-screen items-center pt-10">
      <Header
        title="Talk to us"
        description="Learn more about Langfuse by meeting one of the founders"
        h="h1"
        buttons={[
          {
            href: "/enterprise",
            text: "Enterprise FAQ",
          },
          {
            href: "/watch-demo",
            text: "Watch Langfuse demo (10 min)",
          },
          {
            href: "/docs",
            text: "Docs",
          },
        ]}
      />

      {!isValidRegion && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Please select your timezone region</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => handleRegionSelect("us")}>
              US timezone
            </Button>
            <Button variant="outline" onClick={() => handleRegionSelect("eu")}>
              EU timezone
            </Button>
          </div>
        </div>
      )}

      {isValidRegion && selectedRegion && (
        <ScheduleDemo region={selectedRegion} />
      )}

      <Background />
    </section>
  );
}
