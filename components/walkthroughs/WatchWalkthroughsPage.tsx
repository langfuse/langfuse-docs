import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { Quote } from "@/components/Quote";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeSection } from "../home/components/HomeSection";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { WALKTHROUGH_TABS } from "./constants";

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onVideoEnd?: () => void;
  hasNextVideo: boolean;
  nextVideoTitle?: string;
  onNextVideo?: () => void;
}

function VideoPlayer({
  videoId,
  title,
  onVideoEnd,
  hasNextVideo,
  nextVideoTitle,
  onNextVideo,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const progressCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingProgressRef = useRef(false);
  const [isApiReady, setIsApiReady] = useState(false);

  const checkVideoProgress = useCallback(() => {
    if (!playerRef.current || !hasNextVideo) return;

    if (isCheckingProgressRef.current) return;

    isCheckingProgressRef.current = true;

    // Clear any existing progress check interval
    if (progressCheckIntervalRef.current) {
      clearInterval(progressCheckIntervalRef.current);
    }

    progressCheckIntervalRef.current = setInterval(() => {
      if (!playerRef.current) {
        if (progressCheckIntervalRef.current) {
          clearInterval(progressCheckIntervalRef.current);
          progressCheckIntervalRef.current = null;
        }
        isCheckingProgressRef.current = false;
        return;
      }

      try {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const timeRemaining = duration - currentTime;

        // Show overlay when 10 seconds remaining
        if (timeRemaining <= 10 && timeRemaining > 0) {
          setShowOverlay(true);
        }

        // Stop checking if video is paused or ended
        const state = playerRef.current.getPlayerState();
        if (state !== 1) {
          // Not playing
          if (progressCheckIntervalRef.current) {
            clearInterval(progressCheckIntervalRef.current);
            progressCheckIntervalRef.current = null;
          }
          isCheckingProgressRef.current = false;
        }
      } catch (e) {
        // Player methods failed, likely destroyed - clear interval
        if (progressCheckIntervalRef.current) {
          clearInterval(progressCheckIntervalRef.current);
          progressCheckIntervalRef.current = null;
        }
        isCheckingProgressRef.current = false;
      }
    }, 500);
  }, [hasNextVideo]);

  const handleVideoEnd = useCallback(() => {
    if (!hasNextVideo) {
      onVideoEnd?.();
      return;
    }

    // Show overlay without countdown
    setShowOverlay(true);
  }, [hasNextVideo, onVideoEnd]);

  const onPlayerStateChange = useCallback(
    (event: any) => {
      // Playing
      if (event.data === 1) {
        checkVideoProgress();
      }
      // Ended
      if (event.data === 0) {
        handleVideoEnd();
      }
    },
    [checkVideoProgress, handleVideoEnd]
  );

  // Use a ref to avoid reinitializing the player when callbacks change
  const onPlayerStateChangeRef = useRef(onPlayerStateChange);
  useEffect(() => {
    onPlayerStateChangeRef.current = onPlayerStateChange;
  }, [onPlayerStateChange]);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || !window.YT || !window.YT.Player) return;

    // Destroy existing player if it exists
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        // Ignore errors during destruction
      }
    }

    // Clear the container to ensure clean state
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: videoId,
        playerVars: {
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => onPlayerStateChangeRef.current(event),
        },
      });
    } catch (e) {
      console.error("Error initializing YouTube player:", e);
    }
  }, [videoId]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    // Load the API if not already loaded
    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      // Mark as necessary for CookieYes to allow loading
      tag.setAttribute("data-cookieyes", "necessary");
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      // Script exists but API might not be ready yet
      const checkApi = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setIsApiReady(true);
          clearInterval(checkApi);
        }
      }, 100);

      return () => clearInterval(checkApi);
    }
  }, []);

  // Initialize player when API is ready and videoId changes
  useEffect(() => {
    if (isApiReady && videoId) {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isApiReady, videoId, initPlayer]);

  const handleNextClick = () => {
    setShowOverlay(false);
    onNextVideo?.();
  };

  // Reset overlay state when videoId changes
  useEffect(() => {
    setShowOverlay(false);
    if (progressCheckIntervalRef.current) {
      clearInterval(progressCheckIntervalRef.current);
      progressCheckIntervalRef.current = null;
    }
    isCheckingProgressRef.current = false;
  }, [videoId]);

  return (
    <div className="relative w-full aspect-[16/9] rounded border overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        title={title}
      />

      {showOverlay && hasNextVideo && (
        <div
          className="absolute top-0 left-0 right-0 bg-background/95 backdrop-blur-md z-10 border-b shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-sm font-medium whitespace-nowrap text-muted-foreground">
                Watch next:
              </div>
              <div className="text-sm font-medium text-foreground truncate">
                {nextVideoTitle}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleNextClick}
                size="sm"
                className="whitespace-nowrap gap-1.5"
              >
                Play Next
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
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
    <HomeSection className="px-0">
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

          {WALKTHROUGH_TABS.map((tab, index) => {
            const tabHasNextVideo = index < WALKTHROUGH_TABS.length - 1;
            const tabNextTab = tabHasNextVideo
              ? WALKTHROUGH_TABS[index + 1]
              : null;

            return (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="mt-2 p-4 border rounded bg-card"
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
                  hasNextVideo={tabHasNextVideo}
                  nextVideoTitle={tabNextTab ? tabNextTab.title : undefined}
                  onNextVideo={() => {
                    if (tabHasNextVideo && tabNextTab) {
                      handleTabChange(tabNextTab.id);
                    }
                  }}
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
