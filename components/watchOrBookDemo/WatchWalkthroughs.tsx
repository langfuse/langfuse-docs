"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { WALKTHROUGH_TABS } from "./constants";
import { BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  return (
    <iframe
      width="100%"
      className="aspect-[16/9] rounded mt-3"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
}

export function WatchWalkthroughs({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const activeTab =
    tab && WALKTHROUGH_TABS.some((t) => t.id === tab)
      ? tab
      : WALKTHROUGH_TABS[0].id;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className={cn("flex flex-col gap-8 items-center", className)}>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex-row flex-wrap gap-2 justify-center p-2 mx-auto h-auto">
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
              className="p-4 mx-auto mt-2 max-w-2xl rounded border bg-card"
            >
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold">{tab.title}</h3>
                <p>{tab.description}</p>
              </div>
              <VideoPlayer
                videoId={tab.videoId}
                title={`Langfuse ${tab.label.toLowerCase()} video`}
              />
              <div className="mt-4">
                <Button
                  asChild
                  variant="outline"
                  className="justify-start w-full"
                >
                  <Link href={tab.docs.href}>
                    <BookOpen size={16} />
                    {tab.docs.title}
                    <ExternalLink size={14} className="ml-auto" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
