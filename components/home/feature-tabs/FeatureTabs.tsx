"use client";

import { useMemo } from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TabButton } from "./TabButton";
import { TabContent } from "./TabContent";
import type { FeatureTabsProps, FeatureTabData } from "./types";
import { Card, CardContent } from "@/components/ui/card";

export const FeatureTabs = ({ features, defaultTab = "observability", autoAdvance }: FeatureTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [previewTab, setPreviewTab] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isAutoAdvancePaused, setIsAutoAdvancePaused] = useState(false);
  const [autoAdvanceProgress, setAutoAdvanceProgress] = useState(0);

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle deep linking via URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const matchedFeature = features.find(f => f.id === hash);
      if (matchedFeature) {
        setActiveTab(hash);
        const index = features.findIndex(f => f.id === hash);
        setFocusedIndex(index);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [features]);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const index = features.findIndex(f => f.id === tabId);
    setFocusedIndex(index);

    // Pause auto-advance on manual interaction
    pauseAutoAdvance();

    // Update URL hash without triggering navigation
    if (window.location.hash.replace('#', '') !== tabId) {
      window.history.pushState(null, '', `#${tabId}`);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    let newIndex = focusedIndex;

    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = focusedIndex > 0 ? focusedIndex - 1 : features.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = focusedIndex < features.length - 1 ? focusedIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = features.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabChange(features[focusedIndex].id);
        return;
      default:
        return;
    }

    setFocusedIndex(newIndex);
    tabRefs.current[newIndex]?.focus();

    // Pause auto-advance on keyboard navigation
    pauseAutoAdvance();
  };

  // Scroll active tab into view (for mobile)
  useEffect(() => {
    if (tabListRef.current && tabRefs.current[focusedIndex]) {
      const tabList = tabListRef.current;
      const activeTabButton = tabRefs.current[focusedIndex];

      if (activeTabButton) {
        const tabListRect = tabList.getBoundingClientRect();
        const activeTabRect = activeTabButton.getBoundingClientRect();

        if (activeTabRect.left < tabListRect.left || activeTabRect.right > tabListRect.right) {
          activeTabButton.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      }
    }
  }, [focusedIndex]);

  // Auto-advance functionality
  const advanceToNextTab = useCallback(() => {
    if (!autoAdvance?.enabled || isAutoAdvancePaused) return;

    const currentIndex = features.findIndex(f => f.id === activeTab);
    const nextIndex = (currentIndex + 1) % features.length;
    const nextTab = features[nextIndex];

    setActiveTab(nextTab.id);
    setFocusedIndex(nextIndex);
    setAutoAdvanceProgress(0);

    // Update URL hash
    if (window.location.hash.replace('#', '') !== nextTab.id) {
      window.history.pushState(null, '', `#${nextTab.id}`);
    }
  }, [features, activeTab, autoAdvance?.enabled, isAutoAdvancePaused]);

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
    if (!autoAdvance?.enabled || isAutoAdvancePaused) return;

    // Clear existing timers
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setAutoAdvanceProgress(0);

    // Start progress indicator
    const progressInterval = 50; // Update every 50ms
    const totalSteps = autoAdvance.intervalMs / progressInterval;
    let currentStep = 0;

    progressTimerRef.current = setInterval(() => {
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
      advanceToNextTab();
    }, autoAdvance.intervalMs);
  }, [autoAdvance?.enabled, autoAdvance?.intervalMs, advanceToNextTab, isAutoAdvancePaused]);

  // Auto-advance effect
  useEffect(() => {
    if (autoAdvance?.enabled && !isAutoAdvancePaused) {
      startAutoAdvance();
    }

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [activeTab, autoAdvance?.enabled, startAutoAdvance, isAutoAdvancePaused]);

  const activeFeature = useMemo(() => {
    const displayedTab = previewTab || activeTab;
    return features.find(f => f.id === displayedTab) || features[0];
  }, [activeTab, previewTab, features]);


  return (
    <Card className="p-0 mt-0 bg-background border-radius-none">
      <CardContent className="space-y-8 p-0 border-radius-none overflow-hidden">
        <div className="w-full">
          {/* Tab List */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Feature navigation"
            className="p-2 border-b border-solid [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide border-border snap-x snap-mandatory gap-0 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {features.map((feature, index) => (
                <TabButton
                  key={feature.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  feature={feature}
                  isActive={activeTab === feature.id}
                  onClick={() => handleTabChange(feature.id)}
                  onMouseEnter={() => {
                    setPreviewTab(feature.id);
                    pauseAutoAdvance();
                  }}
                  onMouseLeave={() => {
                    setPreviewTab(null);
                  }}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  className="snap-center"
                />
              ))}
            </div>

            {/* Auto-advance progress indicator */}
            {autoAdvance?.enabled && !isAutoAdvancePaused && (
              <div className="w-full h-1 bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-[50ms] ease-linear"
                  style={{ width: `${autoAdvanceProgress}%` }}
                />
              </div>
            )}
          </div>

          <TabContent feature={activeFeature} isActive={true} />
        </div>
      </CardContent>
    </Card>
  );
};