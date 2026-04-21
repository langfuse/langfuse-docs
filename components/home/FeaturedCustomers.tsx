"use client";

import { useEffect, useState, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BoxCorners, CornerBox } from "@/components/ui/corner-box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import canvaLogo from "./img/canva-tile.png";
import khanAcademyLogo from "./img/khan-academy-tile.png";
import sumupLogo from "./img/sumup-tile.png";
import canvaMono from "./img/canva-mono.svg";
import khanAcademyMono from "./img/khan-academy-mono.svg";
import sumupMono from "./img/sumup-mono.svg";
import { cn } from "@/lib/utils";

const stories = [
  {
    name: "Canva",
    logo: canvaLogo as StaticImageData,
    logoMono: canvaMono as StaticImageData,
    description: "Canva's AI team relies on Langfuse to trace and debug their generative design features in production.",
    href: "/users/canva",
  },
  {
    name: "Khan Academy",
    logo: khanAcademyLogo as StaticImageData,
    logoMono: khanAcademyMono as StaticImageData,
    description: "Khan Academy builds Khanmigo, their AI tutor, on Langfuse to debug and improve student-facing LLM features.",
    href: "/users/khan-academy",
  },
  {
    name: "SumUp",
    logo: sumupLogo as StaticImageData,
    logoMono: sumupMono as StaticImageData,
    description: "SumUp runs AI-powered support for 4 million merchants across 35+ markets on Langfuse.",
    href: "/users/sumup",
  },
] as const;

export function FeaturedCustomers({ corners = { tl: true, tr: true, bl: true, br: true } }: { corners?: BoxCorners }) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);
  const [focusedLogo, setFocusedLogo] = useState<number | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const story = stories[active];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isHovered || !isInViewport) return;

    const interval = window.setInterval(() => {
      setActive((prev) => (prev + 1) % stories.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isHovered, isInViewport]);

  return (
    <CornerBox
      ref={containerRef}
      className="flex flex-col gap-3 p-4 -mt-px lg:flex-row lg:items-center lg:gap-6"
      corners={corners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Row 1 (mobile) / left side (desktop): logo switchers + button */}
      <div className="flex gap-6 items-center lg:contents">
        <div className="flex gap-1 shrink-0">
          {stories.map((s, i) => {
            const isActive = i === active;
            const showLogoCorners =
              isActive || hoveredLogo === i || focusedLogo === i;
            const logoInner = (
              <div className="relative flex justify-center items-center w-full h-full overflow-hidden bg-surface-2">
                <Image
                  src={s.logoMono}
                  alt=""
                  aria-hidden
                  width={50}
                  height={50}
                  className={cn(
                    "absolute inset-0 object-contain w-full h-full transition-opacity duration-150",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                />
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={100}
                  height={100}
                  className={cn(
                    "relative object-cover w-full h-full transition-opacity duration-150",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            );
            const logoShellClass =
              "flex justify-center items-center p-0.75 w-11 h-11 cursor-pointer";
            return (
              <a
                key={s.name}
                href={s.href}
                onMouseEnter={() => {
                  setHoveredLogo(i);
                  setActive(i);
                }}
                onMouseLeave={() => setHoveredLogo(null)}
                onFocus={() => setFocusedLogo(i)}
                onBlur={() => setFocusedLogo(null)}
                aria-label={`Read the ${s.name} customer story`}
                className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {/*
                  Do not pass all-false `corners` to CornerBox: mask layers become
                  `none` and the ::before fills with line-cta (solid dark overlay).
                */}
                {showLogoCorners ? (
                  <CornerBox className={cn(logoShellClass, "border-none")}>
                    {logoInner}
                  </CornerBox>
                ) : (
                  <div className={cn("relative", logoShellClass)}>{logoInner}</div>
                )}
              </a>
            );
          })}
        </div>

        {/* Button: right of logos on mobile, far right on desktop */}
        <div className="ml-auto shrink-0 lg:ml-0 lg:order-last">
          <Button
            href="/cloud"
            shortcutKey="s"
          >
            Start free
          </Button>
        </div>
      </div>

      {/* Row 2 (mobile) / middle (desktop): animated content */}
      <div className="overflow-hidden flex-1 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <a
              href={story.href}
              className="inline-flex items-baseline gap-1.5 group"
            >
              <span className="text-[15px] font-medium text-text-primary leading-snug group-hover:underline">
                {story.name}
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="translate-y-px text-text-tertiary shrink-0"
                aria-hidden
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <Text size="s" className="text-left mt-0.5 line-clamp-2 lg:line-clamp-1 text-text-tertiary">
              {story.description}
            </Text>
          </motion.div>
        </AnimatePresence>
      </div>
    </CornerBox>
  );
}
