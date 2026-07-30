"use client";

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { EXAMPLE_PROJECT_CTA, WALKTHROUGH_TABS } from "./constants";
import { BookOpen, ExternalLink, Joystick } from "lucide-react";
import { cn } from "@/lib/utils";

function WatchWalkthroughsInner({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const activeTab =
    tab && WALKTHROUGH_TABS.some((t) => t.id === tab)
      ? tab
      : WALKTHROUGH_TABS[0].id;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={cn("flex flex-col gap-8 items-center", className)}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex-row flex-wrap gap-2 justify-center mx-auto h-auto">
          {WALKTHROUGH_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-row flex-none justify-center items-center h-auto text-center whitespace-nowrap md:gap-2"
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {WALKTHROUGH_TABS.map((tab) => {
          return (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="relative overflow-visible p-4 mx-auto mt-2 max-w-2xl rounded-none border border-line-structure corner-box-corners bg-stripe-pattern"
            >
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold">{tab.title}</h3>
                <p>{tab.description}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  icon={<Joystick size={16} />}
                  href={EXAMPLE_PROJECT_CTA.href}
                >
                  <span className="flex items-center gap-2">
                    {EXAMPLE_PROJECT_CTA.title}
                    <ExternalLink size={12} className="ml-auto" />
                  </span>
                </Button>
                <Button icon={<BookOpen size={16} />} href={tab.docs.href}>
                  <span className="flex items-center gap-2">
                    {tab.docs.title}
                    <ExternalLink size={12} className="ml-auto" />
                  </span>
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

// Suspense boundary required because useSearchParams() inside WatchWalkthroughsInner
// would otherwise bail out of static prerendering and crash the production build.
export function WatchWalkthroughs({ className }: { className?: string }) {
  return (
    <Suspense>
      <WatchWalkthroughsInner className={className} />
    </Suspense>
  );
}
