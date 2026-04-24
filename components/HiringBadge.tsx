"use client";

import { useState, useRef } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { HoverCorners } from "@/components/ui/corner-box";

export function HiringBadge({ className }: { className?: string }) {
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
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setGoats([]);
      }}
    >
      <div className="relative flex items-center p-1 group button-wrapper max-h-[34px]">
        <HoverCorners />
        <NextLink
          href="/careers"
          className={cn(
            "inline-flex w-full min-w-0 max-w-full items-center gap-[6px] overflow-hidden",
            "h-[26px] py-0.75 pl-[8px] pr-[8px] rounded-[2px]",
            "border border-line-structure dark:border-line-cta group-hover:border-line-cta",
            "bg-surface-bg text-text-secondary",
            "shadow-sm [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
            "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
            "no-underline transition-colors"
          )}
        >
          <span className="text-xs shrink-0" aria-hidden>🐐</span>
          <span className="relative min-w-0 flex-1 text-left">
            <span className={cn("block truncate", isHovered && "invisible")}>
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
      </div>

      {isHovered && (
        <div
          className="overflow-visible fixed z-[100] pointer-events-none"
          aria-hidden="true"
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
