"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";

const messages = [
  "2025 was a big year for 🪢 Langfuse.",
  "We 🚢 more features than ever.",
  "Our community grew 📈 exponentially.",
  "Let's take a l👀k back.",
];

export function Intro() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const previousActiveIndex = useRef(-1);
  const lastMessageWasHidden = useRef(false);

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const containerTop = container.offsetTop;
      
      // Track scroll direction
      const currentDirection = scrollTop > lastScrollTop.current ? "down" : "up";
      if (scrollTop !== lastScrollTop.current) {
        setScrollDirection(currentDirection);
      }
      lastScrollTop.current = scrollTop;
      
      // Account for Hero taking the first viewport (100vh)
      // Intro messages start after Hero has disappeared (with gap)
      const heroEnd = containerTop - windowHeight; // Hero ends at 100vh
      const introStart = heroEnd + windowHeight * 0.8; // Start 0.8 viewports after Hero ends
      
      // Find Metrics component position (it comes after Intro)
      // Intro spacer is messages.length * 75vh + 50vh extra gap, so Metrics starts after that
      const introEnd = containerTop + (messages.length * windowHeight * 0.75) + (windowHeight * 0.5);
      const metricsStart = introEnd;
      
      // Only show messages when we've scrolled past the Hero fade-out point
      if (scrollTop >= introStart) {
        const scrollProgress = (scrollTop - introStart) / windowHeight;
        
        // Calculate which message should be active based on scroll position
        // Each message gets 0.6 viewport height with a gap between transitions
        // This creates a fade-out, gap, then fade-in effect
        const messageDuration = 0.6; // Each message visible for 0.6 viewports
        const gapDuration = 0.15; // Gap between messages (0.15 viewports)
        const totalDuration = messageDuration + gapDuration; // 0.75 viewports per message cycle
        
        const messageCycle = scrollProgress / totalDuration;
        const cyclePosition = (scrollProgress % totalDuration) / totalDuration;
        
        // During the gap (last 25% of cycle), hide the message
        const isInGap = cyclePosition > (messageDuration / totalDuration);
        
        const newIndex = isInGap 
          ? -1 // Hide during gap
          : Math.min(
              Math.max(0, Math.floor(messageCycle)),
              messages.length - 1
            );
        
        // Fade out the last message before Metrics starts appearing
        // Start fading when we're 0.8 viewports before Metrics appears
        // Hide completely when we're 0.5 viewports before Metrics appears
        const metricsFadeStart = metricsStart - windowHeight * 0.8;
        const metricsHideStart = metricsStart - windowHeight * 0.5;
        
        if (newIndex === messages.length - 1) {
          // When scrolling back up from Metrics, show the last message
          if (scrollTop >= metricsHideStart && scrollDirection === "up") {
            // Coming back from Metrics - show the last message
            if (activeIndex !== newIndex) {
              setActiveIndex(newIndex);
            }
            setShouldFadeOut(false);
          } else if (scrollTop >= metricsHideStart) {
            // Scrolling down past the threshold - hide it (regardless of previous state)
            if (scrollDirection === "down") {
              setActiveIndex(-1);
              setShouldFadeOut(false);
            } else {
              // Still scrolling up, keep showing it
              if (activeIndex !== newIndex) {
                setActiveIndex(newIndex);
              }
              setShouldFadeOut(false);
            }
          } else if (scrollTop >= metricsFadeStart) {
            // Start fading out the last message (only when scrolling down)
            if (scrollDirection === "down") {
              setShouldFadeOut(true);
            } else {
              setShouldFadeOut(false);
            }
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
            }
          } else {
            // Show the last message normally before fade starts
            if (newIndex !== activeIndex) {
              setActiveIndex(newIndex);
            }
            setShouldFadeOut(false);
          }
        } else {
          // For non-last messages, show normally
          if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
          }
          setShouldFadeOut(false);
        }
      } else {
        // Before Intro messages should appear, don't show any message
        if (activeIndex !== -1) {
          setActiveIndex(-1);
        }
        setShouldFadeOut(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  return (
    <WrappedSection>
      <div ref={containerRef} className="relative">
        {/* Spacer to enable scrolling - add extra space after last message */}
        {/* Each message gets 0.75 viewport height (0.6 visible + 0.15 gap), plus 50vh extra gap */}
        <div style={{ height: `${messages.length * 75 + 50}vh` }} />
        
        {/* Fixed position messages */}
        {activeIndex >= 0 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: shouldFadeOut ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center w-full"
              >
                <p className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-center text-balance max-w-4xl px-4 mx-auto">
                  {messages[activeIndex]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </WrappedSection>
  );
}

