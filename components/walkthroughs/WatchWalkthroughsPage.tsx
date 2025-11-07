import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quote } from "@/components/Quote";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeSection } from "../home/components/HomeSection";
import { WALKTHROUGH_TABS } from "./constants";

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

export function WatchWalkthroughsPage() {
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
    <HomeSection className="px-0 max-w-7xl">
      <Header
        title="Walkthroughs"
        description="End-to-end walkthroughs of all Langfuse platform features"
        h="h1"
      />
      <div className="flex flex-col gap-8 items-center">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="h-auto p-2 gap-2 md:gap-4 flex-wrap justify-center mx-auto flex-col sm:flex-row">
            {WALKTHROUGH_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-none h-auto items-center justify-center md:gap-2 md:px-4 md:py-3 text-center whitespace-nowrap flex-row"
              >
                <tab.icon className="size-5" />
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
                  <Quote
                    quote={tab.cta}
                    authorName="Marc Klingen"
                    authorTitle="Co-founder and CEO"
                    authorImageSrc="/images/people/marcklingen.jpg"
                    className="mt-4"
                  />
                </div>
                <VideoPlayer
                  videoId={tab.videoId}
                  title={`Langfuse ${tab.label.toLowerCase()} video`}
                />
                <div className="mt-4">
                  <div className="text-sm font-medium mb-1">Learn more:</div>
                  <ul className="list-disc list pl-6">
                    {tab.learnMoreLinks.map((item) => (
                      <li key={`${tab.id}-${item.href}`} className="my-2">
                        <Link
                          className="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]"
                          href={item.href}
                        >
                          <span className="">{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </HomeSection>
  );
}
