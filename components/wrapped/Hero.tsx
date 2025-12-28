"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";

const title = "Langfuse Wrapped";
const titleChars = title.split("");

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [titleWidth, setTitleWidth] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollY = useMotionValue(0);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Measure the final title width once (only on desktop)
    if (titleRef.current && titleWidth === null && !isMobile) {
      // Temporarily show all letters to measure
      const tempSpan = document.createElement("span");
      tempSpan.textContent = title;
      tempSpan.className = "text-5xl sm:text-7xl lg:text-8xl font-bold font-mono";
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      document.body.appendChild(tempSpan);
      setTitleWidth(tempSpan.offsetWidth);
      document.body.removeChild(tempSpan);
    }
  }, [titleWidth, isMobile]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const containerTop = container.offsetTop;
      
      // Calculate scroll progress through the Hero viewport (0 to 1)
      const scrollProgress = Math.min(
        Math.max(0, (scrollTop - containerTop) / windowHeight),
        1
      );
      
      // Move Hero up and out based on scroll progress
      // Negative y moves it up (out of view)
      const newTranslateY = -scrollProgress * windowHeight * 1.2;
      setTranslateY(newTranslateY);
      scrollY.set(newTranslateY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <WrappedSection>
      <div ref={containerRef} className="relative">
        {/* Spacer to enable scrolling */}
        <div style={{ height: "100vh" }} />
        
        {/* Fixed position hero */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Decorative emojis */}
          <motion.div 
            className="absolute top-[25%] left-[25%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            style={{ y: scrollY }}
            transition={{ 
              delay: 0.5,
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            ⭐
          </motion.div>
          <motion.div 
            className="absolute top-[60%] right-[8%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 15 }}
            style={{ y: scrollY }}
            transition={{ 
              delay: 0.7,
              duration: 0.5,
              type: "spring",
              stiffness: 150,
              damping: 12
            }}
          >
            🎁
          </motion.div>
          <motion.div 
            className="absolute bottom-[20%] left-[15%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
            initial={{ opacity: 0, scale: 0, rotate: 180, x: -100 }}
            animate={{ opacity: 1, scale: 1, rotate: -8, x: 0 }}
            style={{ y: scrollY }}
            transition={{ 
              delay: 0.9,
              duration: 0.7,
              type: "spring",
              stiffness: 180,
              damping: 14
            }}
          >
            🎄
          </motion.div>
          <div
            ref={heroRef}
            style={{ transform: `translateY(${translateY}px)` }}
            className="text-center w-full px-4"
          >
            <div className="flex flex-col items-center justify-center gap-5 text-center w-full">
              <motion.span 
                className="text-primary/70 text-2xl sm:text-3xl lg:text-4xl font-bold font-mono"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                2025
              </motion.span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-mono text-balance w-full px-4 text-center">
                {/* Mobile: Simple static text */}
                <span className="sm:hidden">{title}</span>
                {/* Desktop: Animated letters */}
                <motion.span
                  ref={titleRef}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="hidden sm:inline-block sm:whitespace-nowrap"
                  style={{ 
                    minWidth: !isMobile && titleWidth ? `${titleWidth}px` : "auto",
                    maxWidth: "100%",
                  }}
                >
                  {titleChars.map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          x: -20,
                        },
                        visible: { 
                          opacity: 1, 
                          x: 0,
                          transition: {
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                      className="inline-block relative"
                      style={{ 
                        minWidth: char === " " ? "0.3em" : "auto",
                        willChange: "transform, opacity",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.span>
              </h1>
              <motion.p 
                className="text-xl sm:text-2xl text-muted-foreground max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                A year in review
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </WrappedSection>
  );
}

