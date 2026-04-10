"use client";

import {
  useMemo,
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useReducer,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TabButton } from "./TabButton";
import { TabContent } from "./TabContent";
import type { AutoAdvanceConfig, FeatureTabData } from "./types";
import { Dot } from "@/components/ui/dot";
import { CornerBox } from "@/components/ui/corner-box";

/** Soft ease-out (Emil Kowalski–style: calm deceleration, no snappy linear segments). */
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

const contentTransition = (reduceMotion: boolean) =>
  reduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : { duration: 0.5, ease: CONTENT_EASE };

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
  isHovered: boolean;
};

type TabAction =
  | { type: "SET_PREVIEW_TAB"; payload: string | null }
  | { type: "SET_FOCUSED_INDEX"; payload: number }
  | { type: "PAUSE_AUTO_ADVANCE" }
  | { type: "RESUME_AUTO_ADVANCE" }
  | { type: "SET_AUTO_ADVANCE_PROGRESS"; payload: number }
  | { type: "SET_IN_VIEWPORT"; payload: boolean }
  | { type: "SET_HOVERED"; payload: boolean }
  | { type: "RESET_PROGRESS" };

function assertNever(action: never): never {
  throw new Error(`Unexpected tab action: ${String(action)}`);
}

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
    case "SET_HOVERED":
      return { ...state, isHovered: action.payload };
    case "RESET_PROGRESS":
      return { ...state, autoAdvanceProgress: 0 };
    default:
      return assertNever(action);
  }
};

const initialTabState: TabState = {
  previewTab: null,
  focusedIndex: 0,
  isAutoAdvancePaused: false,
  autoAdvanceProgress: 0,
  isInViewport: false,
  isHovered: false,
};

const DEFAULT_AUTO_ADVANCE: AutoAdvanceConfig = {
  enabled: true,
  intervalMs: 10000,
};

export const FeatureTabs = ({
  features,
  defaultTab = "observability",
  autoAdvance,
}: FeatureTabsProps) => {
  const defaultAutoAdvance = autoAdvance ?? DEFAULT_AUTO_ADVANCE;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(tabStateReducer, initialTabState);

  const tab = searchParams.get("tab");
  const activeTab =
    tab && features.some((f) => f.id === tab) ? tab : defaultTab;

  const tabListRef = useRef<HTMLDivElement>(null);
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
  const isHoveredRef = useRef(state.isHovered);

  useEffect(() => {
    isAutoAdvancePausedRef.current = state.isAutoAdvancePaused;
  }, [state.isAutoAdvancePaused]);

  useEffect(() => {
    isHoveredRef.current = state.isHovered;
  }, [state.isHovered]);

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
    const nextTab = features[nextIndex];

    dispatch({ type: "RESET_PROGRESS" });

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    features,
    activeTab,
    defaultAutoAdvance.enabled,
    router,
    pathname,
    searchParams,
  ]);

  const startAutoAdvance = useCallback(() => {
    if (
      !defaultAutoAdvance.enabled ||
      isAutoAdvancePausedRef.current ||
      isHoveredRef.current
    ) {
      return;
    }

    clearAutoAdvanceTimer();
    dispatch({ type: "RESET_PROGRESS" });

    const startTime = Date.now();
    const intervalMs = defaultAutoAdvance.intervalMs;

    const updateProgress = () => {
      if (isHoveredRef.current || isAutoAdvancePausedRef.current) {
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
    defaultAutoAdvance.enabled,
    defaultAutoAdvance.intervalMs,
    advanceToNextTab,
    clearAutoAdvanceTimer,
  ]);

  // Handle tab change and update URL query param
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (activeTab === tabId) return;

      dispatch({ type: "PAUSE_AUTO_ADVANCE" });
      clearAllTimers();

      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tabId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [activeTab, clearAllTimers, searchParams, pathname, router],
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
    defaultAutoAdvance.enabled,
    startAutoAdvance,
    state.isAutoAdvancePaused,
    state.isInViewport,
    state.isHovered,
    clearAutoAdvanceTimer,
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const activeFeature =
    features.find((f) => f.id === (state.previewTab || activeTab)) ??
    features[0];

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

      {/* Tab List */}
      <CornerBox
        ref={tabListRef}
        role="tablist"
        aria-label="Feature navigation. Use arrow keys to navigate, Enter or Space to select, Escape to toggle auto-advance."
        className="px-4 py-[2px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={handleKeyDown}
      >
        <div
          ref={tabListScrollRef}
          className="flex flex-row items-center flex-nowrap overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 px-4 -mx-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {features.map((feature, index) => (
            <Fragment key={feature.id}>
              <TabButton
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
              {index < features.length - 1 && <Dot />}
            </Fragment>
          ))}
        </div>
      </CornerBox>

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
              style={{ width: 800, height: 400 }}
            >
              <Image
                src={feature.image.light}
                alt=""
                fill
                sizes="100vw"
                loading={isNext ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </CornerBox>

      <CornerBox className="p-4 -mt-px" withStripes>
        <div className="relative w-full min-h-[410px] overflow-hidden">
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
    </div>
  );
};
