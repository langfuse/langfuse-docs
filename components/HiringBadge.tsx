"use client";

import { useState, useRef } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

export function HiringBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [goats, setGoats] = useState<
    Array<{ id: number; x: number; y: number; duration: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const goatIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovered) return;
    const now = Date.now();
    if (now - lastSpawnTimeRef.current < 100) return;
    lastSpawnTimeRef.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    const newGoat = {
      id: goatIdRef.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 1.5 + Math.random() * 0.6,
    };
    setGoats((prev) => [...prev, newGoat]);
    setTimeout(() => {
      setGoats((prev) => prev.filter((g) => g.id !== newGoat.id));
    }, (newGoat.duration + 0.5) * 1000);
  };

  return (
    <div
      ref={containerRef}
      className="hidden relative lg:block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setGoats([]);
      }}
    >
      <NextLink
        href="/careers"
        className={cn(
          "inline-flex items-center gap-1.5 h-6 px-2.5",
          "rounded-[2px] border border-line-structure",
          "bg-surface-bg text-text-tertiary",
          "font-sans text-[11px] font-[450] leading-[150%] tracking-[-0.06px]",
          "no-underline transition-colors",
          "hover:border-line-cta hover:text-text-secondary"
        )}
        style={{ width: "max-content" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FBFF7A] shrink-0" />
        <span className="relative">
          <span className={cn("block", isHovered && "invisible")}>
            Hiring in Europe and SF
          </span>
          <span
            className={cn(
              "absolute left-0 top-0 whitespace-nowrap",
              !isHovered && "invisible"
            )}
          >
            Looking for GOATS!
          </span>
        </span>
      </NextLink>

      {isHovered && (
        <div
          className="overflow-visible fixed z-50 pointer-events-none"
          style={{ top: 0, left: 0, width: "100vw", height: "100vh" }}
        >
          {goats.map((goat) => {
            if (!containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            return (
              <span
                key={goat.id}
                className="absolute text-lg animate-fall"
                style={{
                  left: `${rect.left + goat.x}px`,
                  top: `${rect.top + goat.y}px`,
                  animationDuration: `${goat.duration}s`,
                }}
              >
                🐐
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
