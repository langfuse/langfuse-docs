"use client";

import { useMemo } from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { TabButton } from "./TabButton";
import { TabContent } from "./TabContent";
import type { AutoAdvanceConfig, FeatureTabData } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export interface FeatureTabsProps {
  features: FeatureTabData[];
  defaultTab?: string;
  autoAdvance?: AutoAdvanceConfig;
}

export const FeatureTabs = ({
  features,
  defaultTab = "observability",
  autoAdvance,
}: FeatureTabsProps) => {
  // Default auto-advance configuration
  const defaultAutoAdvance = autoAdvance || {
    enabled: true,
    intervalMs: 10000,
  };

  const router = useRouter();

  // Get current tab from query param or default to defaultTab
  const activeTab = (() => {
    const tab = router.query.tab as string;
    if (tab && features.some((f) => f.id === tab)) {
      return tab;
    }
    return defaultTab;
  })();
  const [previewTab, setPreviewTab] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isAutoAdvancePaused, setIsAutoAdvancePaused] = useState(false);
  const [autoAdvanceProgress, setAutoAdvanceProgress] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isAutoTransitioning, setIsAutoTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update focused index when active tab changes
  useEffect(() => {
    const index = features.findIndex((f) => f.id === activeTab);
    if (index !== -1) {
      setFocusedIndex(index);
    }
  }, [activeTab, features]);

  // Viewport detection for auto-advance
  useEffect(() => {
    const setupObserver = () => {
      if (!containerRef.current) {
        return null;
      }

      const element = containerRef.current;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInViewport(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: "50px",
          threshold: [0, 0.1, 0.25, 0.5],
        }
      );

      observer.observe(element);
      return observer;
    };

    const timer = setTimeout(() => {
      const observer = setupObserver();
      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle tab change and update URL query param
  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return; // Prevent unnecessary transitions

    // Pause auto-advance on manual interaction
    pauseAutoAdvance();

    // Update URL query param
    const query = { ...router.query };
    query.tab = tabId;

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    let newIndex = focusedIndex;

    switch (key) {
      case "ArrowLeft":
        event.preventDefault();
        newIndex = focusedIndex > 0 ? focusedIndex - 1 : features.length - 1;
        break;
      case "ArrowRight":
        event.preventDefault();
        newIndex = focusedIndex < features.length - 1 ? focusedIndex + 1 : 0;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = features.length - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        handleTabChange(features[focusedIndex].id);
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  // Scroll active tab into view (for mobile)
  useEffect(() => {
    if (tabListRef.current && tabRefs.current[focusedIndex]) {
      const tabList = tabListRef.current;
      const activeTabButton = tabRefs.current[focusedIndex];

      if (activeTabButton) {
        const tabListRect = tabList.getBoundingClientRect();
        const activeTabRect = activeTabButton.getBoundingClientRect();

        if (
          activeTabRect.left < tabListRect.left ||
          activeTabRect.right > tabListRect.right
        ) {
          activeTabButton.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [focusedIndex]);

  // Auto-advance functionality
  const advanceToNextTab = useCallback(() => {
    if (!defaultAutoAdvance?.enabled || isAutoAdvancePaused) {
      return;
    }

    const currentIndex = features.findIndex((f) => f.id === activeTab);
    const nextIndex = (currentIndex + 1) % features.length;
    const nextTab = features[nextIndex];

    setIsAutoTransitioning(true);

    // Small delay to allow fade out
    setTimeout(() => {
      setAutoAdvanceProgress(0);

      // Update URL query param
      const query = { ...router.query };
      query.tab = nextTab.id;

      router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });

      // Allow fade in
      setTimeout(() => {
        setIsAutoTransitioning(false);
      }, 50);
    }, 100);
  }, [
    features,
    activeTab,
    defaultAutoAdvance?.enabled,
    isAutoAdvancePaused,
    router,
  ]);

  const pauseAutoAdvance = useCallback(() => {
    setIsAutoAdvancePaused(true);
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (!defaultAutoAdvance?.enabled || isAutoAdvancePaused || isHovered) {
      return;
    }

    // Clear existing timers
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setAutoAdvanceProgress(0);

    // Start progress indicator
    const progressInterval = 50; // Update every 50ms
    const totalSteps = Math.ceil(
      defaultAutoAdvance.intervalMs / progressInterval
    );
    let currentStep = 0;

    progressTimerRef.current = setInterval(() => {
      // Pause progress when hovered
      if (isHovered) return;

      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      setAutoAdvanceProgress(Math.min(progress, 100));

      if (currentStep >= totalSteps) {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }
    }, progressInterval);

    // Set main timer
    autoAdvanceTimerRef.current = setTimeout(() => {
      // Only advance if not hovered
      if (!isHovered) {
        advanceToNextTab();
      }
    }, defaultAutoAdvance.intervalMs);
  }, [
    defaultAutoAdvance?.enabled,
    defaultAutoAdvance?.intervalMs,
    advanceToNextTab,
    isAutoAdvancePaused,
    isHovered,
  ]);

  // Auto-advance effect
  useEffect(() => {
    if (
      defaultAutoAdvance?.enabled &&
      !isAutoAdvancePaused &&
      isInViewport &&
      !isHovered
    ) {
      startAutoAdvance();
    }

    return () => {
      if (autoAdvanceTimerRef.current)
        clearTimeout(autoAdvanceTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [
    activeTab,
    defaultAutoAdvance?.enabled,
    startAutoAdvance,
    isAutoAdvancePaused,
    isInViewport,
    isHovered,
  ]);

  const activeFeature = useMemo(() => {
    const displayedTab = previewTab || activeTab;
    return features.find((f) => f.id === displayedTab) || features[0];
  }, [activeTab, previewTab, features]);

  return (
    <Card
      ref={containerRef}
      className="p-0 mt-0 bg-card border-radius-none overflow-hidden"
    >
      <CardContent className="space-y-8 p-0 border-radius-none overflow-hidden">
        <div className="w-full">
          {/* Tab List */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Feature navigation"
            className="p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-0 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {features.map((feature, index) => (
                <TabButton
                  key={feature.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  feature={feature}
                  isActive={activeTab === feature.id}
                  onClick={() => handleTabChange(feature.id)}
                  onMouseEnter={() => {
                    setPreviewTab(feature.id);
                    setIsHovered(true);
                  }}
                  onMouseLeave={() => {
                    setPreviewTab(null);
                    setIsHovered(false);
                  }}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  className="snap-center"
                />
              ))}
            </div>
          </div>

          {/* Auto-advance progress indicator - always maintains height */}
          {defaultAutoAdvance?.enabled && (
            <div className="w-full h-0.5 overflow-hidden border-b-0.5 border-solid border-border">
              {!isAutoAdvancePaused && isInViewport ? (
                <div
                  className="h-full bg-primary/15 transition-all duration-[50ms] ease-in-out rounded-lg"
                  style={{ width: `${autoAdvanceProgress}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
          )}

          <div className="relative overflow-hidden">
            <div
              className={`${
                isAutoTransitioning
                  ? "transition-opacity duration-100 ease-in-out opacity-30"
                  : "transition-opacity duration-200 ease-in-out opacity-100"
              }`}
            >
              <TabContent feature={activeFeature} isActive={true} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
