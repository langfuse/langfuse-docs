"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { HoverCorners } from "@/components/ui/corner-box";

/**
 * Temporary Christmas decoration for the hiring badge.
 * Set this to false after Christmas to restore the goat icon and falling goats.
 */
const CHRISTMAS_DECORATION = true;

const FULL_LABEL = "Hiring remotely";
const COMPACT_LABEL = "Hiring";
const HOVER_LABEL = "Looking for GOATS!";
const COMPACT_HOVER_LABEL = "GOATS!";
const SNOWFLAKES = ["❄", "❅", "❆"] as const;
const REINDEER_SLEIGH = "🦌🛷";

type FallingParticle = {
  id: number;
  x: number;
  y: number;
  duration: number;
  kind?: "snow" | "sleigh";
  emoji?: string;
  drift?: number;
};

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
  const [goats, setGoats] = useState<FallingParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const goatIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const christmasTickRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovered) return;
    const now = Date.now();
    if (now - lastSpawnTimeRef.current < 100) return;
    lastSpawnTimeRef.current = now;

    const rect = containerRef.current.getBoundingClientRect();

    if (CHRISTMAS_DECORATION) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tick = christmasTickRef.current++;
      const snow: FallingParticle = {
        id: goatIdRef.current++,
        x,
        y,
        duration: 2.4 + Math.random() * 0.6,
        kind: "snow",
        emoji: SNOWFLAKES[Math.floor(Math.random() * SNOWFLAKES.length)],
        drift: Math.round((Math.random() - 0.5) * 80),
      };
      const spawned: FallingParticle[] = [snow];

      // Sleighs on every other tick so snow stays constant without doubling the rate.
      if (tick % 2 === 0) {
        spawned.push({
          id: goatIdRef.current++,
          x,
          y,
          duration: 1.5 + Math.random() * 0.6,
          kind: "sleigh",
          emoji: REINDEER_SLEIGH,
        });
      }

      setGoats((prev) => [...prev, ...spawned]);
      for (const particle of spawned) {
        setTimeout(
          () => {
            setGoats((prev) => prev.filter((g) => g.id !== particle.id));
          },
          (particle.duration + 0.5) * 1000,
        );
      }
      return;
    }

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
              const position = {
                left: `${rect.left + goat.x}px`,
                top: `${rect.top + goat.y}px`,
                animationDuration: `${goat.duration}s`,
              };

              if (!CHRISTMAS_DECORATION || goat.kind == null) {
                return (
                  <span
                    key={goat.id}
                    className="absolute text-lg animate-fall"
                    style={position}
                  >
                    🐐
                  </span>
                );
              }

              const isSnow = goat.kind === "snow";
              return (
                <span
                  key={goat.id}
                  className={
                    isSnow
                      ? "absolute whitespace-nowrap text-base animate-hiring-snow"
                      : "absolute whitespace-nowrap text-lg animate-fall"
                  }
                  style={
                    {
                      ...position,
                      ...(isSnow
                        ? { "--snow-drift": `${goat.drift ?? 0}px` }
                        : {}),
                    } as React.CSSProperties
                  }
                >
                  {goat.emoji}
                </span>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  const idleLabel = adaptive ? (
    <>
      <span className="hidden @[9rem]/hiring:inline">{FULL_LABEL}</span>
      <span className="inline @[9rem]/hiring:hidden">{COMPACT_LABEL}</span>
    </>
  ) : (
    FULL_LABEL
  );

  const hoverLabel = adaptive ? (
    <>
      <span className="hidden @[9rem]/hiring:inline">{HOVER_LABEL}</span>
      <span className="inline @[9rem]/hiring:hidden">
        {COMPACT_HOVER_LABEL}
      </span>
    </>
  ) : (
    HOVER_LABEL
  );

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
            {CHRISTMAS_DECORATION ? REINDEER_SLEIGH : "🐐"}
          </span>
          <span className="text-left">
            <span className="block whitespace-nowrap">
              {isHovered ? hoverLabel : idleLabel}
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
