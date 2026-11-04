"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LOOP_TICK_MS } from "./steps";

/** Cycles 0..length-1 unless paused or the user asked for reduced motion. */
export function useLoopTick(length: number, paused = false) {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || paused) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % length),
      LOOP_TICK_MS,
    );
    return () => clearInterval(id);
  }, [length, reducedMotion, paused]);

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
