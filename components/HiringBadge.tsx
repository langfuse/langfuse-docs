"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextLink from "next/link";
import { CHRISTMAS_MODE } from "@/lib/christmas";
import { cn } from "@/lib/utils";
import { HoverCorners } from "@/components/ui/corner-box";

const FULL_LABEL = "Hiring remotely";
const COMPACT_LABEL = "Hiring";
const HOVER_LABEL = "Looking for GOATS!";
const COMPACT_HOVER_LABEL = "GOATS!";
const REINDEER_SLEIGH = "🦌🛷";
const FLY_FALL_PX = 120;
const FLY_SPEED_PX_PER_S = 160;
const FLY_EXIT = { x: -90, y: -70 };
const GOAT_FALL_PX = 250;

type FallingParticle = {
  id: number;
  x: number;
  y: number;
  duration: number;
  kind?: "snow" | "sleigh" | "fly";
  drift?: number;
  size?: number;
  opacity?: number;
  /** Viewport left/top captured at launch. Snow and falling sleighs stay badge-relative. */
  viewport?: boolean;
};

function FlyingSleigh({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const flyDistance = Math.hypot(
      FLY_EXIT.x - x,
      FLY_EXIT.y - (y + FLY_FALL_PX),
    );
    const total = FLY_FALL_PX + flyDistance;
    const rotation = 360 * (FLY_FALL_PX / GOAT_FALL_PX);
    const animation = el.animate(
      [
        { transform: "translate3d(0px, 0px, 0) rotate(0deg)", offset: 0 },
        {
          transform: `translate3d(0px, ${FLY_FALL_PX}px, 0) rotate(${rotation}deg)`,
          offset: FLY_FALL_PX / total,
        },
        {
          transform: `translate3d(${FLY_EXIT.x - x}px, ${FLY_EXIT.y - y}px, 0) rotate(${rotation}deg)`,
          offset: 1,
        },
      ],
      {
        duration: (total / FLY_SPEED_PX_PER_S) * 1000,
        easing: "linear",
        fill: "forwards",
      },
    );
    animation.onfinish = () => onDoneRef.current();
    return () => animation.cancel();
  }, [x, y]);

  return (
    <span
      ref={ref}
      className="absolute whitespace-nowrap text-lg"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {REINDEER_SLEIGH}
    </span>
  );
}

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
  const sleighLaunchedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const spawnSnow = (x: number, y: number, count: number, spread = 0) => {
    const flakes: FallingParticle[] = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        id: goatIdRef.current++,
        x: x + (spread ? (Math.random() - 0.5) * spread : 0),
        y: y + (spread ? (Math.random() - 0.5) * spread : 0),
        duration: 2.4 + Math.random() * 1.6,
        kind: "snow",
        drift: Math.round((Math.random() - 0.5) * 72),
        size: 3 + Math.round(Math.random() * 4),
        opacity: 0.8 + Math.random() * 0.2,
      });
    }
    return flakes;
  };

  const spawnFallingSleigh = (x: number, y: number): FallingParticle => ({
    id: goatIdRef.current++,
    x,
    y,
    duration: 1.5 + Math.random() * 0.6,
    kind: "sleigh",
  });

  const releaseParticles = (particles: FallingParticle[]) => {
    setGoats((prev) => [...prev, ...particles]);
    for (const particle of particles) {
      setTimeout(
        () => {
          setGoats((prev) => prev.filter((g) => g.id !== particle.id));
        },
        (particle.duration + 0.5) * 1000,
      );
    }
  };

  const launchFlyingSleigh = (x: number, y: number) => {
    if (sleighLaunchedRef.current) return;
    sleighLaunchedRef.current = true;
    const sleigh: FallingParticle = {
      id: goatIdRef.current++,
      x,
      y,
      duration: 0,
      kind: "fly",
      viewport: true,
    };
    setGoats((prev) => [...prev, sleigh]);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!CHRISTMAS_MODE || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    releaseParticles([...spawnSnow(x, y, 8, 24), spawnFallingSleigh(x, y)]);
    launchFlyingSleigh(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovered) return;
    const now = Date.now();
    if (now - lastSpawnTimeRef.current < 100) return;
    lastSpawnTimeRef.current = now;

    const rect = containerRef.current.getBoundingClientRect();

    if (CHRISTMAS_MODE) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      releaseParticles([...spawnSnow(x, y, 3, 8), spawnFallingSleigh(x, y)]);
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
              if (goat.kind === "fly" && goat.viewport) {
                return (
                  <FlyingSleigh
                    key={goat.id}
                    x={goat.x}
                    y={goat.y}
                    onDone={() =>
                      setGoats((prev) =>
                        prev.filter((item) => item.id !== goat.id),
                      )
                    }
                  />
                );
              }

              if (!containerRef.current) return null;
              const rect = containerRef.current.getBoundingClientRect();

              if (goat.kind === "sleigh") {
                return (
                  <span
                    key={goat.id}
                    className="absolute whitespace-nowrap text-lg animate-fall"
                    style={{
                      left: `${rect.left + goat.x}px`,
                      top: `${rect.top + goat.y}px`,
                      animationDuration: `${goat.duration}s`,
                    }}
                  >
                    {REINDEER_SLEIGH}
                  </span>
                );
              }

              if (!CHRISTMAS_MODE || goat.kind == null) {
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
              }

              return (
                <span
                  key={goat.id}
                  className="absolute rounded-full bg-white animate-hiring-snow"
                  style={
                    {
                      left: `${rect.left + goat.x}px`,
                      top: `${rect.top + goat.y}px`,
                      width: `${goat.size ?? 4}px`,
                      height: `${goat.size ?? 4}px`,
                      animationDuration: `${goat.duration}s`,
                      boxShadow:
                        "0 0 0 1px rgba(150,170,190,0.5), 0 1px 2px rgba(0,0,0,0.12)",
                      "--snow-drift": `${goat.drift ?? 0}px`,
                      "--snow-opacity": String(goat.opacity ?? 0.9),
                    } as React.CSSProperties
                  }
                />
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsHovered(false);
        sleighLaunchedRef.current = false;
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
            {CHRISTMAS_MODE ? REINDEER_SLEIGH : "🐐"}
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
