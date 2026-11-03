"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LOOP_TICK_MS } from "./steps";

/** Cycles 0..length-1 while the user has not asked for reduced motion. */
export function useLoopTick(length: number) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % length),
      LOOP_TICK_MS,
    );
    return () => clearInterval(id);
  }, [length, reducedMotion]);

  return active;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function MonoLabel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] leading-none text-text-tertiary",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Yellow highlighter behind a short label, as used in the academy diagrams. */
export function Highlight({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn("px-1 -mx-1", className)}
      style={{
        background:
          "linear-gradient(transparent 55%, color-mix(in oklab, var(--surface-cta-primary) 80%, transparent) 55% 95%, transparent 95%)",
      }}
    >
      {children}
    </span>
  );
}

export function PulseDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-[background,box-shadow] duration-200"
      style={{
        background: active ? "var(--callout-success)" : "var(--text-disabled)",
        boxShadow: active
          ? "0 0 0 3px color-mix(in oklab, var(--callout-success) 25%, transparent)"
          : "none",
      }}
    />
  );
}

type Direction = "left" | "right" | "up" | "down";

// Drawn per direction so the tip stays crisp. Rotating one triangle blurs
// these small heads and lets the stroke show through the edges.
const ARROW_PATH: Record<Direction, string> = {
  right: "M 0 0 L 10 5 L 0 10 Z",
  down: "M 0 0 L 10 0 L 5 10 Z",
  left: "M 10 0 L 0 5 L 10 10 Z",
  up: "M 0 10 L 10 10 L 5 0 Z",
};

export function ArrowHead({
  direction,
  className,
  dark,
  size = 8,
}: {
  direction: Direction;
  className?: string;
  dark?: boolean;
  size?: number;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={cn("shrink-0", className)}
    >
      <path
        d={ARROW_PATH[direction]}
        fill={dark ? "var(--text-primary)" : "var(--text-secondary)"}
      />
    </svg>
  );
}

/** Horizontal arrow that stretches to fill its flex/grid cell. */
export function HArrow({
  direction = "right",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex w-full items-center",
        direction === "left" && "flex-row-reverse",
        className,
      )}
    >
      <div className="h-px flex-1 bg-text-secondary" />
      <ArrowHead direction={direction} className="-ml-px" />
    </div>
  );
}

/** Vertical arrow that stretches to fill its cell height. */
export function VArrow({
  direction = "down",
  className,
}: {
  direction?: "up" | "down";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full flex-col items-center",
        direction === "up" && "flex-col-reverse",
        className,
      )}
    >
      <div className="w-px flex-1 bg-text-secondary" />
      <ArrowHead direction={direction} className="-mt-px" />
    </div>
  );
}
