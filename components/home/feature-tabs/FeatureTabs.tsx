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
import { cn } from "@/lib/utils";
import { MD_MIN_WIDTH_QUERY, useMinWidth } from "@/lib/use-min-width";

/** Soft ease-out (Emil Kowalski–style: calm deceleration, no snappy linear segments). */
const CONTENT_EASE = [0.22, 1, 0.36, 1] as const;

/** Quick ease-in for exit so the incoming panel reads sooner. */
const CONTENT_EXIT_EASE = [0.4, 0, 1, 1] as const;

const tabImageVariants = (reduceMotion: boolean) =>
  reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.12, ease: "easeOut" as const },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.12, ease: "easeOut" as const },
        },
      }
    : {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: { duration: 0.26, ease: CONTENT_EASE },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.14, ease: CONTENT_EXIT_EASE },
        },
      };

export interface FeatureTabsProps {
  features: FeatureTabData[];
  defaultTab?: string;
  autoAdvance?: AutoAdvanceConfig;
}

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
  const isMd = useMinWidth(MD_MIN_WIDTH_QUERY);
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
    handleTabChange(features[newIndex]!.id);
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
      {/* Accessibility: announce pause/resume only, not every auto-advance */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {defaultAutoAdvance.enabled && (
          <span>
            Auto-advance is {state.isAutoAdvancePaused ? "paused" : "active"}.
            Press Escape to {state.isAutoAdvancePaused ? "resume" : "pause"}{" "}
            auto-advance.
          </span>
        )}
      </div>

      {/* Preload neighbor tab images on md+ only — on mobile this competed with LCP. */}
      {isMd ? (
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
      ) : null}

      {/* Clickable product-area names, then animated subtitle */}
      <CornerBox className="px-4 py-3">
        <div
          ref={tabListScrollRef}
          role="tablist"
          aria-label="Product area screenshots. Use arrow keys to navigate, Escape to toggle auto-advance."
          className="flex !flex-nowrap md:!flex-wrap items-center overflow-x-auto md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-sm leading-snug"
          onKeyDown={handleKeyDown}
        >
          {features.map((feature, index) => {
            const isActive = activeTab === feature.id;

            return (
              <span
                key={feature.id}
                className="inline-flex items-center shrink-0"
              >
                {index > 0 && (
                  <span aria-hidden className="px-2 text-text-tertiary">
                    ·
                  </span>
                )}
                <button
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="tabpanel-product-area"
                  id={`tab-${feature.id}`}
                  tabIndex={state.focusedIndex === index ? 0 : -1}
                  onClick={() => handleTabChange(feature.id)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-sm py-0.5 transition-colors duration-150",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
                    isActive
                      ? "font-medium text-primary"
                      : "font-normal text-text-tertiary hover:text-primary",
                  )}
                >
                  {feature.name}
                </button>
              </span>
            );
          })}
        </div>

        <div className="relative mt-3 min-h-[1.125rem] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {activeFeature && (
              <motion.p
                key={activeFeature.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="text-xs leading-relaxed font-normal text-text-tertiary"
              >
                {activeFeature.subtitle}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </CornerBox>

      <CornerBox
        className="p-4 -mt-px"
        withStripes
        role="tabpanel"
        id="tabpanel-product-area"
        aria-labelledby={activeFeature ? `tab-${activeFeature.id}` : undefined}
      >
        <div className="relative w-full overflow-hidden aspect-[2205/1291] custom-card-shadow">
          <AnimatePresence mode="sync" initial={false}>
            {activeFeature ? (
              <motion.div
                key={activeFeature.id}
                variants={tabImageVariants(Boolean(reduceMotion))}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TabContent feature={activeFeature} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </CornerBox>
    </div>
  );
};
