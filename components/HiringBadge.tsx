"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { HoverCorners } from "@/components/ui/corner-box";

const FULL_LABEL = "Hiring in Europe and SF";
const COMPACT_LABEL = "Hiring";
const HOVER_LABEL = "Looking for GOATS!";

export function HiringBadge({
  className,
  adaptive = false,
}: {
  className?: string;
  /**
   * Size the badge to leftover space left of a centered nav: full label when
   * there is room, "Hiring" when space is tight, hidden when even that would
   * collide. The parent must be a shrinking width constraint (e.g. a `1fr`
   * grid column), not sized by this badge's content.
   */
  adaptive?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [goats, setGoats] = useState<
    Array<{ id: number; x: number; y: number; duration: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const goatIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    setTimeout(
      () => {
        setGoats((prev) => prev.filter((g) => g.id !== newGoat.id));
      },
      (newGoat.duration + 0.5) * 1000,
    );
  };

  const goatOverlay =
    isMounted && isHovered
      ? createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[60] overflow-visible"
            aria-hidden="true"
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
          </div>,
          document.body,
        )
      : null;

  const badge = (
    <div
      ref={containerRef}
      className={cn(
        adaptive && "hidden w-fit max-w-full min-w-0 @[6.5rem]/hiring:block",
        !adaptive && className,
      )}
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
          aria-label={FULL_LABEL}
          className={cn(
            "inline-flex w-full min-w-0 max-w-full items-center gap-[6px] overflow-hidden",
            "h-[26px] py-0.75 pl-[8px] pr-[8px] rounded-[2px]",
            "border border-line-structure dark:border-line-cta group-hover:border-line-cta",
            "bg-surface-bg text-text-secondary",
            "shadow-sm [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
            "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
            "no-underline transition-colors",
          )}
        >
          <span className="text-xs shrink-0" aria-hidden>
            🐐
          </span>
          <span className="relative min-w-0 flex-1 text-left">
            <span
              className={cn(
                "block whitespace-nowrap",
                isHovered && "invisible",
              )}
            >
              {adaptive ? (
                <>
                  <span className="hidden @[13rem]/hiring:inline">
                    {FULL_LABEL}
                  </span>
                  <span className="inline @[13rem]/hiring:hidden">
                    {COMPACT_LABEL}
                  </span>
                </>
              ) : (
                FULL_LABEL
              )}
            </span>
            <span
              className={cn(
                "absolute left-0 top-0 whitespace-nowrap",
                !isHovered && "invisible",
              )}
            >
              {HOVER_LABEL}
            </span>
          </span>
        </NextLink>
      </div>

      {goatOverlay}
    </div>
  );

  if (!adaptive) {
    return badge;
  }

  return (
    <div className={cn("@container/hiring w-full min-w-0", className)}>
      {badge}
    </div>
  );
}
