import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { WALKTHROUGH_TABS } from "./constants";
import { BookOpen, ExternalLink } from "lucide-react";

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

export function WatchWalkthroughs() {
  const router = useRouter();

  // Get current tab from query param or default to first tab
  const activeTab = (() => {
    const tab = router.query.tab as string;
    if (tab && WALKTHROUGH_TABS.some((t) => t.id === tab)) {
      return tab;
    }
    return WALKTHROUGH_TABS[0].id;
  })();

  // Handle tab change and update URL query param
  const handleTabChange = (value: string) => {
    const query = { ...router.query };

    query.tab = value;

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="h-auto p-2 gap-2 flex-wrap justify-center mx-auto flex-row">
          {WALKTHROUGH_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-none h-auto items-center justify-center md:gap-2 text-center whitespace-nowrap flex-row"
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
              className="mt-2 p-4 border rounded bg-card max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{tab.title}</h3>
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
                  className="w-full justify-start"
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
