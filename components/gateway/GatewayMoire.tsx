"use client";

import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/utils";
import styles from "./GatewayHero.module.css";

const LINE_WIDTH = 0.55;
const LINE_ALPHA = 0.42;
// Time constants of the pointer swell: it covers 90% of the way in about 0.4s.
const FOLLOW_SECONDS = 0.18;
const FADE_SECONDS = 0.3;
const ROW_OVERSCAN = 40;
const SAMPLE_OVERSCAN = 24;

// Two hairline layers that drift slightly out of step; `accent` is the purple one.
const LAYERS = [
  { offset: 0, f: 1, a: 1, accent: false },
  { offset: 0.5, f: 1.07, a: 1.22, accent: true },
];

/**
 * Live moiré line field. Fills its positioned parent and follows the pointer
 * inside `pointerScopeRef` (default: the parent).
 */
export function GatewayMoire({
  className,
  pointerScopeRef,
}: {
  className?: string;
  pointerScopeRef?: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let gap = 7.5;
    let step = 22;
    let ink = "";
    let accent = "";
    let t = 0;

    // The bump eases towards the pointer target.
    const bump = { x: 0, y: 0, on: 0 };
    const target = { x: 0, y: 0, on: 0, seen: false };

    const readColors = () => {
      const computed = getComputedStyle(canvas);
      ink = computed.color;
      accent =
        computed.getPropertyValue("--gateway-moire-accent").trim() || ink;
    };

    const draw = () => {
      if (!width || !height) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = LINE_WIDTH;
      ctx.globalAlpha = LINE_ALPHA;

      const xs: number[] = [];
      const ys: number[] = [];
      for (let y0 = -ROW_OVERSCAN; y0 <= height + ROW_OVERSCAN; y0 += gap) {
        for (const layer of LAYERS) {
          const yy = y0 + layer.offset * gap;
          let n = 0;
          for (
            let x = -SAMPLE_OVERSCAN;
            x <= width + SAMPLE_OVERSCAN;
            x += step
          ) {
            const X = x * layer.f;
            const env =
              0.55 + 0.45 * Math.sin(X * 0.0042 - yy * 0.0057 + t * 0.21 + 1.1);
            let dy =
              env *
              (24 * Math.sin(X * 0.01 + yy * 0.019 + t * 0.37) +
                10 * Math.sin(X * 0.023 - yy * 0.013 - t * 0.61 + 0.7) +
                6 * Math.sin(X * 0.041 + yy * 0.031 + t * 0.93 + 2.3) +
                12 * Math.sin(X * 0.006 - yy * 0.004 - t * 0.17 + 0.4));
            dy *= layer.a * (0.6 + 0.4 * Math.sin((Math.PI * x) / width));

            const ddx = x - bump.x;
            const ddy = yy - bump.y;
            const g =
              Math.exp(
                -(ddx * ddx) / (2 * 150 * 150) - (ddy * ddy) / (2 * 110 * 110),
              ) * bump.on;
            dy =
              dy * (1 - 0.35 * g) -
              ddy * 0.55 * g +
              26 * g * Math.sin(ddx * 0.03 - t * 0.6);

            xs[n] = x;
            ys[n] = yy + dy;
            n++;
          }

          ctx.strokeStyle = layer.accent ? accent : ink;
          ctx.beginPath();
          ctx.moveTo(xs[0], ys[0]);
          for (let i = 1; i < n - 1; i++) {
            ctx.quadraticCurveTo(
              xs[i],
              ys[i],
              (xs[i] + xs[i + 1]) / 2,
              (ys[i] + ys[i + 1]) / 2,
            );
          }
          ctx.lineTo(xs[n - 1], ys[n - 1]);
          ctx.stroke();
        }
      }
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const narrow = window.innerWidth < 640;
      gap = narrow ? 9 : 7.5;
      step = narrow ? 28 : 22;
      readColors();
      draw();
    };

    const startedAt = performance.now();
    let raf = 0;
    let lastFrame = 0;
    let colorsReadAt = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Easing uses elapsed time, so the swell moves the same at any refresh rate.
      const dt = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      t = (now - startedAt) / 1000;
      const follow = 1 - Math.exp(-dt / FOLLOW_SECONDS);
      bump.x += (target.x - bump.x) * follow;
      bump.y += (target.y - bump.y) * follow;
      bump.on += (target.on - bump.on) * (1 - Math.exp(-dt / FADE_SECONDS));
      // Picks up a theme change about once a second.
      if (now - colorsReadAt > 1000) {
        colorsReadAt = now;
        readColors();
      }
      draw();
    };

    // Runs whatever the reduced-motion setting is, like the rotating value props.
    let onScreen = false;
    const syncLoop = () => {
      const run = onScreen && !document.hidden;
      if (run && !raf) {
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastFrame = 0;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver((entries) => {
      // Entries arrive oldest first; the last one is the current state.
      onScreen = entries[entries.length - 1].isIntersecting;
      syncLoop();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", syncLoop);
    // A theme switch repaints at once, so a still frame never keeps old colours.
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Touch devices get the field without the pointer bump.
    const scope = pointerScopeRef?.current ?? canvas.parentElement;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      target.on = 1;
      if (!target.seen) {
        target.seen = true;
        bump.x = target.x;
        bump.y = target.y;
      }
    };
    const onPointerLeave = () => {
      target.on = 0;
    };
    if (scope && canHover) {
      scope.addEventListener("pointermove", onPointerMove);
      scope.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
      scope?.removeEventListener("pointermove", onPointerMove);
      scope?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pointerScopeRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 block h-full w-full text-text-primary",
        styles.moire,
        className,
      )}
    />
  );
}
