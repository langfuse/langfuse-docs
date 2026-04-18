"use client";

import {
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TabContent } from "./TabContent";
import type { AutoAdvanceConfig, FeatureTabData } from "./types";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui/text-highlight";
/** Soft ease-out (Emil Kowalski–style: calm deceleration, no snappy linear segments). */
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

const contentTransition = (reduceMotion: boolean) =>
  reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.5, ease: CONTENT_EASE };

export interface FeatureTabsProps {
  features: FeatureTabData[];
  mobileFeature: FeatureTabData;
  defaultTab?: string;
  autoAdvance?: AutoAdvanceConfig;
}

// State management with useReducer
type TabState = {
  focusedIndex: number;
  isAutoAdvancePaused: boolean;
  isInViewport: boolean;
};

type TabAction =
  | { type: "SET_FOCUSED_INDEX"; payload: number }
  | { type: "PAUSE_AUTO_ADVANCE" }
  | { type: "RESUME_AUTO_ADVANCE" }
  | { type: "SET_IN_VIEWPORT"; payload: boolean };

function assertNever(action: never): never {
  throw new Error(`Unexpected tab action: ${String(action)}`);
}

const tabStateReducer = (state: TabState, action: TabAction): TabState => {
  switch (action.type) {
    case "SET_FOCUSED_INDEX":
      return { ...state, focusedIndex: action.payload };
    case "PAUSE_AUTO_ADVANCE":
      return { ...state, isAutoAdvancePaused: true };
    case "RESUME_AUTO_ADVANCE":
      return { ...state, isAutoAdvancePaused: false };
    case "SET_IN_VIEWPORT":
      return { ...state, isInViewport: action.payload };
    default:
      return assertNever(action);
  }
};

const initialTabState: TabState = {
  focusedIndex: 0,
  isAutoAdvancePaused: false,
  isInViewport: false,
};

const DEFAULT_AUTO_ADVANCE: AutoAdvanceConfig = {
  enabled: true,
  intervalMs: 5000,
};

export const FeatureTabs = ({
  features,
  mobileFeature,
  defaultTab = "observability",
  autoAdvance,
}: FeatureTabsProps) => {
  const defaultAutoAdvance = autoAdvance ?? DEFAULT_AUTO_ADVANCE;

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [state, dispatch] = useReducer(tabStateReducer, initialTabState);

  const tabListScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [observeRoot, setObserveRoot] = useState<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);

  const isAutoAdvancePausedRef = useRef(state.isAutoAdvancePaused);

  useEffect(() => {
    isAutoAdvancePausedRef.current = state.isAutoAdvancePaused;
  }, [state.isAutoAdvancePaused]);

  const setContainerNode = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    setObserveRoot(node);
  }, []);

  // Update focused index when active tab changes
  useEffect(() => {
    const index = features.findIndex((f) => f.id === activeTab);
    if (index !== -1) {
      dispatch({ type: "SET_FOCUSED_INDEX", payload: index });
    }
  }, [activeTab, features]);

  // Viewport detection for auto-advance (re-attach if root node changes)
  useEffect(() => {
    if (!observeRoot) {
      return;
    }

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

    observer.observe(observeRoot);

    return () => {
      observer.disconnect();
    };
  }, [observeRoot]);

  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearAutoAdvanceTimer();
  }, [clearAutoAdvanceTimer]);

  const advanceToNextTab = useCallback(() => {
    if (!defaultAutoAdvance.enabled || isAutoAdvancePausedRef.current) {
      return;
    }

    const currentIndex = features.findIndex((f) => f.id === activeTab);
    const nextIndex = (currentIndex + 1) % features.length;

    setActiveTab(features[nextIndex].id);
  }, [features, activeTab, defaultAutoAdvance.enabled]);

  const startAutoAdvance = useCallback(() => {
    if (!defaultAutoAdvance.enabled || isAutoAdvancePausedRef.current) {
      return;
    }

    clearAutoAdvanceTimer();

    autoAdvanceTimerRef.current = setTimeout(() => {
      if (!isAutoAdvancePausedRef.current) {
        advanceToNextTab();
      }
    }, defaultAutoAdvance.intervalMs);
  }, [
    defaultAutoAdvance.enabled,
    defaultAutoAdvance.intervalMs,
    advanceToNextTab,
    clearAutoAdvanceTimer,
  ]);

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (activeTab === tabId) return;

      dispatch({ type: "PAUSE_AUTO_ADVANCE" });
      clearAllTimers();
      setActiveTab(tabId);
    },
    [activeTab, clearAllTimers],
  );

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (features.length === 0) {
      return;
    }

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
        handleTabChange(features[state.focusedIndex]!.id);
        return;
      case "Escape":
        event.preventDefault();
        if (state.isAutoAdvancePaused) {
          dispatch({ type: "RESUME_AUTO_ADVANCE" });
        } else {
          dispatch({ type: "PAUSE_AUTO_ADVANCE" });
          clearAllTimers();
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
          const scrollLeft =
            activeTabButton.offsetLeft -
            tabList.clientWidth / 2 +
            activeTabButton.clientWidth / 2;

          tabList.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }
  }, [state.focusedIndex]);

  // Simplified auto-advance effect with better cleanup
  useEffect(() => {
    if (
      defaultAutoAdvance.enabled &&
      !state.isAutoAdvancePaused &&
      state.isInViewport
    ) {
      startAutoAdvance();
    } else {
      clearAutoAdvanceTimer();
    }

    return clearAutoAdvanceTimer;
  }, [
    activeTab,
    defaultAutoAdvance.enabled,
    startAutoAdvance,
    state.isAutoAdvancePaused,
    state.isInViewport,
    clearAutoAdvanceTimer,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const activeFeature = features.find((f) => f.id === activeTab) ?? features[0];

  const activeIndex = features.findIndex((f) => f.id === activeTab);
  const n = features.length;
  const preloadNeighborIndices = useMemo(() => {
    if (n < 2 || activeIndex < 0) {
      return new Set<number>();
    }
    const prev = (activeIndex - 1 + n) % n;
    const next = (activeIndex + 1) % n;
    return new Set([prev, next]);
  }, [n, activeIndex]);

  return (
    <div
      ref={setContainerNode}
      className="overflow-hidden p-0 mt-0 bg-card border-radius-none"
    >
      {/* Accessibility: Auto-advance status announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {defaultAutoAdvance.enabled && (
          <span>
            Auto-advance is{" "}
            {state.isAutoAdvancePaused ? "paused" : "active"}. Press Escape
            to {state.isAutoAdvancePaused ? "resume" : "pause"}{" "}
            auto-advance.
          </span>
        )}
      </div>

      {/* Preload light images for previous/next tab only (current is in TabContent) */}
      <CornerBox
        aria-hidden="true"
        className="overflow-hidden absolute pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0.01 }}
      >
        {features.map((feature, index) => {
          if (!preloadNeighborIndices.has(index)) {
            return null;
          }
          const isNext = index === (activeIndex + 1 + n) % n;
          return (
            <div
              key={`preload-${feature.id}`}
              className="relative"
              style={{ width: 806, height: 410 }}
            >
              <Image
                src={feature.image.light}
                alt=""
                fill
                quality={100}
                sizes="806px"
                loading={isNext ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </CornerBox>

      {/* Title bar with corner box */}
      <CornerBox
        role="tablist"
        aria-label="Feature navigation. Use arrow keys to navigate, Enter or Space to select, Escape to toggle auto-advance."
        className="px-4 py-2 hidden md:block"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={tabListScrollRef}
          className="flex flex-row items-center"
        >
          {/* Title — left-aligned */}
          <div className="relative overflow-hidden min-w-0 flex-1">
            <div aria-hidden className="flex flex-col">
              {features.map((f) => (
                <span key={f.id} className="whitespace-nowrap text-xl font-analog font-medium invisible h-0 block">
                  {f.title}
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {activeFeature && (
                <motion.h3
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="block whitespace-nowrap text-xl font-analog font-medium text-primary"
                >
                  {activeFeature.title}
                </motion.h3>
              )}
            </AnimatePresence>
          </div>

          {/* Dot indicators — right-aligned */}
          <div className="flex flex-row items-center gap-1.5 ml-auto shrink-0">
            {features.map((feature, index) => {
              const isActive = activeTab === feature.id;

              return (
                <button
                  key={feature.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={feature.title}
                  aria-controls={`tabpanel-${feature.id}`}
                  id={`tab-${feature.id}`}
                  tabIndex={state.focusedIndex === index ? 0 : -1}
                  onClick={() => handleTabChange(feature.id)}
                  className="group p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded"
                >
                  <span
                    className={`block w-3 h-1.5 rounded-sm transition-colors ${isActive
                      ? "bg-primary"
                      : "bg-text-disabled group-hover:bg-primary"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </CornerBox>

      {/* Image box - desktop */}
      <CornerBox className="p-4 md:-mt-px hidden md:block" withStripes>
        <div className="relative w-full overflow-hidden aspect-2646/1512 sm:aspect-auto sm:min-h-[410px]">
          <AnimatePresence mode="sync" initial={false}>
            {activeFeature ? (
              <motion.div
                key={activeFeature.id}
                className="absolute inset-0 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={contentTransition(Boolean(reduceMotion))}
              >
                <TabContent feature={activeFeature} priority />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </CornerBox>

      {/* Image box - mobile */}
      <CornerBox className="p-4 md:-mt-px block md:hidden" withStripes>
        <div className="relative w-full overflow-hidden min-h-[410px]">
          <Image
            src={mobileFeature?.image.light}
            alt={mobileFeature?.image.alt}
            width={1223}
            height={706}
            quality={100}
            className="absolute left-0 top-0 h-auto max-w-none w-[900px] sm:w-[1223px]"
            sizes="(min-width: 640px) 1223px, 900px"
            priority
          />
        </div>
      </CornerBox>
    </div>
  );
};
