"use client";

import {
  useMemo,
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
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

// State management with useReducer
type TabState = {
  previewTab: string | null;
  focusedIndex: number;
  isAutoAdvancePaused: boolean;
  autoAdvanceProgress: number;
  isInViewport: boolean;
  isAutoTransitioning: boolean;
  isHovered: boolean;
};

type TabAction =
  | { type: "SET_PREVIEW_TAB"; payload: string | null }
  | { type: "SET_FOCUSED_INDEX"; payload: number }
  | { type: "PAUSE_AUTO_ADVANCE" }
  | { type: "RESUME_AUTO_ADVANCE" }
  | { type: "SET_AUTO_ADVANCE_PROGRESS"; payload: number }
  | { type: "SET_IN_VIEWPORT"; payload: boolean }
  | { type: "SET_AUTO_TRANSITIONING"; payload: boolean }
  | { type: "SET_HOVERED"; payload: boolean }
  | { type: "RESET_PROGRESS" };

const tabStateReducer = (state: TabState, action: TabAction): TabState => {
  switch (action.type) {
    case "SET_PREVIEW_TAB":
      return { ...state, previewTab: action.payload };
    case "SET_FOCUSED_INDEX":
      return { ...state, focusedIndex: action.payload };
    case "PAUSE_AUTO_ADVANCE":
      return { ...state, isAutoAdvancePaused: true, autoAdvanceProgress: 0 };
    case "RESUME_AUTO_ADVANCE":
      return { ...state, isAutoAdvancePaused: false };
    case "SET_AUTO_ADVANCE_PROGRESS":
      return { ...state, autoAdvanceProgress: action.payload };
    case "SET_IN_VIEWPORT":
      return { ...state, isInViewport: action.payload };
    case "SET_AUTO_TRANSITIONING":
      return { ...state, isAutoTransitioning: action.payload };
    case "SET_HOVERED":
      return { ...state, isHovered: action.payload };
    case "RESET_PROGRESS":
      return { ...state, autoAdvanceProgress: 0 };
    default:
      return state;
  }
};

const initialTabState: TabState = {
  previewTab: null,
  focusedIndex: 0,
  isAutoAdvancePaused: false,
  autoAdvanceProgress: 0,
  isInViewport: false,
  isAutoTransitioning: false,
  isHovered: false,
};

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
  const [state, dispatch] = useReducer(tabStateReducer, initialTabState);

  // Memoize activeTab computation to prevent unnecessary re-renders
  const activeTab = useMemo(() => {
    const tab = router.query.tab as string;
    if (tab && features.some((f) => f.id === tab)) {
      return tab;
    }
    return defaultTab;
  }, [router.query.tab, features, defaultTab]);

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabListScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update focused index when active tab changes
  useEffect(() => {
    const index = features.findIndex((f) => f.id === activeTab);
    if (index !== -1) {
      dispatch({ type: "SET_FOCUSED_INDEX", payload: index });
    }
  }, [activeTab, features]);

  // Viewport detection for auto-advance - Fixed intersection observer setup
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        dispatch({ type: "SET_IN_VIEWPORT", payload: entry.isIntersecting });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle tab change and update URL query param
  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId) return; // Prevent unnecessary transitions

    // Pause auto-advance on manual interaction
    dispatch({ type: "PAUSE_AUTO_ADVANCE" });
    clearAutoAdvanceTimer();

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
    let newIndex = state.focusedIndex;

    switch (key) {
      case "ArrowLeft":
        event.preventDefault();
        newIndex =
          state.focusedIndex > 0 ? state.focusedIndex - 1 : features.length - 1;
        break;
      case "ArrowRight":
        event.preventDefault();
        newIndex =
          state.focusedIndex < features.length - 1 ? state.focusedIndex + 1 : 0;
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
        handleTabChange(features[state.focusedIndex].id);
        return;
      case "Escape":
        // Accessibility: Allow users to pause auto-advance
        event.preventDefault();
        if (state.isAutoAdvancePaused) {
          dispatch({ type: "RESUME_AUTO_ADVANCE" });
        } else {
          dispatch({ type: "PAUSE_AUTO_ADVANCE" });
          clearAutoAdvanceTimer();
        }
        return;
      default:
        return;
    }

    dispatch({ type: "SET_FOCUSED_INDEX", payload: newIndex });
    tabRefs.current[newIndex]?.focus();
  };

  // Scroll active tab into view (for mobile)
  useEffect(() => {
    if (tabListScrollRef.current && tabRefs.current[state.focusedIndex]) {
      const tabList = tabListScrollRef.current;
      const activeTabButton = tabRefs.current[state.focusedIndex];

      if (activeTabButton) {
        const tabListRect = tabList.getBoundingClientRect();
        const activeTabRect = activeTabButton.getBoundingClientRect();

        if (
          activeTabRect.left < tabListRect.left ||
          activeTabRect.right > tabListRect.right
        ) {
          // Calculate the scroll position needed
          const scrollLeft =
            activeTabButton.offsetLeft -
            tabList.clientWidth / 2 +
            activeTabButton.clientWidth / 2;

          // Smooth scroll the container only (not the viewport)
          tabList.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }
  }, [state.focusedIndex]);

  // Simplified timer management
  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Simplified auto-advance functionality
  const advanceToNextTab = useCallback(() => {
    if (!defaultAutoAdvance?.enabled || state.isAutoAdvancePaused) {
      return;
    }

    const currentIndex = features.findIndex((f) => f.id === activeTab);
    const nextIndex = (currentIndex + 1) % features.length;
    const nextTab = features[nextIndex];

    dispatch({ type: "SET_AUTO_TRANSITIONING", payload: true });

    // Small delay to allow fade out
    setTimeout(() => {
      dispatch({ type: "RESET_PROGRESS" });

      // Update URL query param
      const query = { ...router.query };
      query.tab = nextTab.id;

      router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      });

      // Allow fade in
      setTimeout(() => {
        dispatch({ type: "SET_AUTO_TRANSITIONING", payload: false });
      }, 50);
    }, 100);
  }, [
    features,
    activeTab,
    defaultAutoAdvance?.enabled,
    state.isAutoAdvancePaused,
    router,
  ]);

  // Simplified auto-advance with single timer and optimized progress updates
  const startAutoAdvance = useCallback(() => {
    if (
      !defaultAutoAdvance?.enabled ||
      state.isAutoAdvancePaused ||
      state.isHovered
    ) {
      return;
    }

    clearAutoAdvanceTimer();
    dispatch({ type: "RESET_PROGRESS" });

    const startTime = Date.now();
    const intervalMs = defaultAutoAdvance.intervalMs;

    // Use a single timer with less frequent updates (every 100ms instead of 50ms)
    const updateProgress = () => {
      if (state.isHovered || state.isAutoAdvancePaused) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / intervalMs) * 100, 100);
      dispatch({ type: "SET_AUTO_ADVANCE_PROGRESS", payload: progress });

      if (elapsed >= intervalMs) {
        advanceToNextTab();
      } else {
        autoAdvanceTimerRef.current = setTimeout(updateProgress, 100);
      }
    };

    autoAdvanceTimerRef.current = setTimeout(updateProgress, 100);
  }, [
    defaultAutoAdvance?.enabled,
    defaultAutoAdvance?.intervalMs,
    advanceToNextTab,
    state.isAutoAdvancePaused,
    state.isHovered,
    clearAutoAdvanceTimer,
  ]);

  // Simplified auto-advance effect with better cleanup
  useEffect(() => {
    if (
      defaultAutoAdvance?.enabled &&
      !state.isAutoAdvancePaused &&
      state.isInViewport &&
      !state.isHovered
    ) {
      startAutoAdvance();
    } else {
      clearAutoAdvanceTimer();
    }

    return clearAutoAdvanceTimer;
  }, [
    activeTab,
    defaultAutoAdvance?.enabled,
    startAutoAdvance,
    state.isAutoAdvancePaused,
    state.isInViewport,
    state.isHovered,
    clearAutoAdvanceTimer,
  ]);

  const activeFeature = useMemo(() => {
    const displayedTab = state.previewTab || activeTab;
    return features.find((f) => f.id === displayedTab) || features[0];
  }, [activeTab, state.previewTab, features]);

  return (
    <Card
      ref={containerRef}
      className="p-0 mt-0 bg-card border-radius-none overflow-hidden"
    >
      <CardContent className="space-y-8 p-0 border-radius-none overflow-hidden">
        <div className="w-full">
          {/* Accessibility: Auto-advance status announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {defaultAutoAdvance?.enabled && (
              <span>
                Auto-advance is{" "}
                {state.isAutoAdvancePaused ? "paused" : "active"}. Press Escape
                to {state.isAutoAdvancePaused ? "resume" : "pause"}{" "}
                auto-advance.
              </span>
            )}
          </div>

          {/* Tab List */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Feature navigation. Use arrow keys to navigate, Enter or Space to select, Escape to toggle auto-advance."
            className="p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onKeyDown={handleKeyDown}
          >
            <div
              ref={tabListScrollRef}
              className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-0 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {features.map((feature, index) => (
                <TabButton
                  key={feature.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  feature={feature}
                  isActive={activeTab === feature.id}
                  onClick={() => handleTabChange(feature.id)}
                  onMouseEnter={() => {
                    dispatch({ type: "SET_PREVIEW_TAB", payload: feature.id });
                    dispatch({ type: "SET_HOVERED", payload: true });
                  }}
                  onMouseLeave={() => {
                    dispatch({ type: "SET_PREVIEW_TAB", payload: null });
                    dispatch({ type: "SET_HOVERED", payload: false });
                  }}
                  tabIndex={state.focusedIndex === index ? 0 : -1}
                  className="snap-center"
                />
              ))}
            </div>
          </div>

          {/* Auto-advance progress indicator - always maintains height */}
          {defaultAutoAdvance?.enabled && (
            <div
              className="w-full h-0.5 overflow-hidden border-b-0.5 border-solid border-border"
              role="progressbar"
              aria-label="Auto-advance progress"
              aria-valuenow={state.autoAdvanceProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-hidden={state.isAutoAdvancePaused || !state.isInViewport}
            >
              {!state.isAutoAdvancePaused && state.isInViewport ? (
                <div
                  className="h-full bg-primary/15 transition-all duration-100 ease-in-out rounded-lg"
                  style={{ width: `${state.autoAdvanceProgress}%` }}
                />
              ) : (
                <div className="h-full bg-transparent" />
              )}
            </div>
          )}

          <div className="relative overflow-hidden">
            <div
              className={`${
                state.isAutoTransitioning
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
