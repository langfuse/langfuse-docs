"use client";

import { useMemo } from "react";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TabButton } from "./TabButton";
import { TabContent } from "./TabContent";
import type { FeatureTabData } from "./types";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureTabsProps {
  features: FeatureTabData[];
  defaultTab?: string;
}

export const FeatureTabs = ({ features, defaultTab = "observability" }: FeatureTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [previewTab, setPreviewTab] = useState(defaultTab);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const activeFeature = useMemo(() => {
    if (previewTab) {
      return features.find(f => f.id === previewTab) || features[0];
    }
    return features.find(f => f.id === activeTab) || features[0];
  }, [activeTab, previewTab,features]);


  return (
    <Card className="p-0 mt-0 bg-background border-radius-none">
      <CardContent
        className="space-y-8 p-0 border-radius-none"
      >
    <div className="w-full">
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Feature navigation"
        className={cn(" overflow-x-sroll p-2 border-b border-solid")}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide  border-border snap-x snap-mandatory gap-1 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {features.map((feature, index) => (
            <TabButton
              key={feature.id}
              ref={(el) => (tabRefs.current[index] = el)}
              feature={feature}
              isActive={activeTab === feature.id}
              onClick={() => handleTabChange(feature.id)}
              onMouseEnter={() => {
                console.log("mouse enter", feature.id);
                setPreviewTab(feature.id);
              }}
              onMouseLeave={() => {
                console.log("mouse leave", feature.id);
                setPreviewTab(null);
              }}
              tabIndex={focusedIndex === index ? 0 : -1}
              className="snap-center"
            />
          ))}
        </div>
      </div>

        <TabContent feature={activeFeature} isActive={true} />

    </div>
    </CardContent>
    </Card>
  );
};