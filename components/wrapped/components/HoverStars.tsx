"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface HoverStarsProps {
  className?: string;
}

export function HoverStars({ className }: HoverStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const getStarAnimation = (direction: "tl" | "tr" | "bl" | "br") => {
    const movements = {
      tl: { x: 8, y: 8 }, // top-left: move right and down (towards center)
      tr: { x: -8, y: 8 }, // top-right: move left and down (towards center)
      bl: { x: 8, y: -8 }, // bottom-left: move right and up (towards center)
      br: { x: -8, y: -8 }, // bottom-right: move left and up (towards center)
    };
    
    return {
      hidden: {
        opacity: 0,
        scale: 0.5,
        x: 0,
        y: 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: movements[direction].x,
        y: movements[direction].y,
        transition: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0",
        className
      )}
    >
      {/* Top-left star */}
      <motion.span
        className="absolute top-1 left-1 text-lg leading-none"
        variants={getStarAnimation("tl")}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      >
        ⭐
      </motion.span>

      {/* Top-right star */}
      <motion.span
        className="absolute top-1 right-1 text-lg leading-none"
        variants={getStarAnimation("tr")}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      >
        ⭐
      </motion.span>

      {/* Bottom-left star */}
      <motion.span
        className="absolute bottom-1 left-1 text-lg leading-none"
        variants={getStarAnimation("bl")}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      >
        ⭐
      </motion.span>

      {/* Bottom-right star */}
      <motion.span
        className="absolute bottom-1 right-1 text-lg leading-none"
        variants={getStarAnimation("br")}
        initial="hidden"
        animate={isHovered ? "visible" : "hidden"}
      >
        ⭐
      </motion.span>
    </div>
  );
}

