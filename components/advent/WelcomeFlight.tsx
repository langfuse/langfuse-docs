"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { trackAdvent } from "./analytics";
import { logAdvent } from "./advent-debug";
import { canvasScale, frameMonitor, renderPixels } from "./render-budget";
import { createWinterVault } from "./winter-optics";
import { WELCOME_SECONDS } from "./fold-timing";

type Props = {
  reducedMotion: boolean;
  active: boolean;
  onReveal: () => void;
  onComplete: () => void;
  onSound: () => void | (() => void);
};

/** A small projected winter world, drawn once per frame without DOM particles. */
export function WelcomeFlight({
  reducedMotion,
  active,
  onReveal,
  onComplete,
  onSound,
}: Props) {
  const shaderRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;
  useEffect(() => {
    if (!active) return;
    // Choose a treatment once per flight; changing the preference must not restart it.
    const reducedMotion = reducedRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      trackAdvent("transition_skipped", {
        transition: "intro",
        reason: "canvas_unavailable",
      });
      onReveal();
      onComplete();
      return;
    }
    const shaderCanvas = shaderRef.current;
    const vault = shaderCanvas
      ? createWinterVault(shaderCanvas, reducedMotion)
      : null;
    const monitor = frameMonitor();
    let shaderPixels = renderPixels(650_000);
    let fallbackLogged = !vault;
    trackAdvent("transition_started", {
      transition: "intro",
      gentle: reducedMotion,
      renderer: vault ? "webgl" : "canvas",
    });
    let frame = 0;
    let revealed = false;
    let finished = false;
    const stopSound = onSound();
    const finish = (skip = false) => {
      if (finished) return;
      finished = true;
      trackAdvent("transition_finished", {
        transition: "intro",
        outcome: skip ? "skipped" : "completed",
        renderer: fallbackLogged ? "canvas" : "webgl",
        ...monitor.summary(),
      });
      if (skip && typeof stopSound === "function") stopSound();
      if (!revealed) onReveal();
      onComplete();
    };
    skipRef.current = () => finish(true);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(true);
    };
    document.addEventListener("keydown", keydown);
    const resize = () => {
      const dpr = canvasScale(innerWidth, innerHeight, shaderPixels * 1.38);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (shaderCanvas) {
        const resolution = canvasScale(innerWidth, innerHeight, shaderPixels);
        shaderCanvas.width = Math.round(innerWidth * resolution);
        shaderCanvas.height = Math.round(innerHeight * resolution);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    // Seven tiny cached sprites replace thousands of path operations per frame.
    const sprites = Array.from({ length: 7 }, (_, kind) => {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 192;
      const paint = sprite.getContext("2d")!;
      paint.translate(96, 96);
      paint.scale(1.2, 1.2);
      drawDecoration(paint, kind);
      return sprite;
    });
    const start = performance.now();
    let last = 0;
    const draw = (now: number) => {
      if (finished) return;
      if (last && now - last < 1000 / 30 - 1) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = now;
      if (monitor.frame(now) && shaderPixels > 200_000) {
        shaderPixels = Math.max(200_000, shaderPixels * 0.7);
        resize();
        logAdvent("renderer.resolution_reduced", {
          transition: "intro",
          pixels: shaderPixels,
        });
      }
      const t = Math.min(1, (now - start) / (WELCOME_SECONDS * 1000));
      const w = innerWidth,
        h = innerHeight;
      const reveal = Math.max(0, (t - 0.69) / 0.31);
      const speed = reducedMotion ? t * 0.12 : t * 5 + t * t * 4;
      const cx =
        w / 2 + Math.sin(t * 6) * w * (reducedMotion ? 0 : 0.06) * (1 - reveal);
      const cy =
        h / 2 + Math.cos(t * 5) * h * (reducedMotion ? 0 : 0.04) * (1 - reveal);
      ctx.clearRect(0, 0, w, h);
      const shaderDrawn = vault?.draw(t) ?? false;
      if (!shaderDrawn) {
        if (!fallbackLogged) {
          fallbackLogged = true;
          trackAdvent("renderer_fallback", {
            transition: "intro",
            reason: "context_lost",
            renderer: "canvas",
          });
        }
        const bg = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          Math.max(w, h) * 0.8,
        );
        bg.addColorStop(0, "#fff9df");
        bg.addColorStop(0.28, "#d5e6da");
        bg.addColorStop(0.7, "#24594c");
        bg.addColorStop(1, "#102e2c");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        // Nested garlands mark the depth; each one rolls past the camera.
        for (let i = 18; i >= 0; i--) {
          const depth = (i / 19 + speed * 0.18) % 1;
          const radius = Math.pow(depth, 2.3) * Math.max(w, h) * 0.95 + 4;
          ctx.strokeStyle = i % 2 ? "#eac369" : "#fff5d4";
          ctx.globalAlpha = Math.sin(depth * Math.PI) * 0.22;
          ctx.lineWidth = 1 + depth * 4;
          ctx.beginPath();
          ctx.ellipse(
            cx,
            cy,
            radius,
            radius * 0.72,
            reducedMotion ? 0 : t * 0.7,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }
      // Snow catches the light in long streaks as the camera accelerates.
      const density = Math.min(1, shaderPixels / 650_000);
      for (
        let i = 0;
        i < (reducedMotion ? 0 : Math.max(32, Math.round(100 * density)));
        i++
      ) {
        const d = (i * 0.723 + speed * 0.28) % 1;
        const a = i * 2.718;
        const r = d * d * Math.max(w, h);
        const stretch = 1 + 0.04 * d * (1 + t);
        ctx.globalAlpha = d * 0.45;
        ctx.strokeStyle = "#fff8df";
        ctx.lineWidth = 0.5 + d;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8);
        ctx.lineTo(
          cx + Math.cos(a) * r * stretch,
          cy + Math.sin(a) * r * 0.8 * stretch,
        );
        ctx.stroke();
      }
      // Sprites follow corkscrew lanes, leaving the center clear to fly through.
      for (let i = 0; i < Math.max(16, Math.round(42 * density)); i++) {
        const depth = (i * 0.6180339 + speed * 0.15) % 1;
        const spread = Math.pow(depth, 2.5);
        const angle =
          i * 2.39996 +
          ((i % 3) * Math.PI * 2) / 3 +
          (reducedMotion ? 0 : t * 0.8);
        const radius = 22 + spread * Math.max(w, h) * 0.85;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.75;
        const size = 2 + spread * (i % 5 === 0 ? 125 : 68);
        ctx.globalAlpha = Math.min(1, depth * 5) * (1 - reveal * 0.5);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(reducedMotion ? 0 : Math.sin(angle + t * 3) * 0.2);
        ctx.scale(size / 100, size / 100);
        ctx.drawImage(sprites[i % 7], -80, -80, 160, 160);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      // The real calendar assembles underneath the expanding opening.
      if (reveal > 0) {
        const radius = reveal * Math.hypot(w, h) * 0.68;
        const aperture = ctx.createRadialGradient(
          w / 2,
          h / 2,
          Math.max(0, radius * 0.75),
          w / 2,
          h / 2,
          Math.max(1, radius),
        );
        aperture.addColorStop(0, "rgba(0,0,0,1)");
        aperture.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = aperture;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
      canvas.style.opacity = String(
        Math.min(1, t / 0.07) * Math.min(1, (1 - t) / 0.1),
      );
      canvas.dataset.progress = t.toFixed(3);
      if (t >= 0.69 && !revealed) {
        revealed = true;
        onReveal();
      }
      if (t < 1) frame = requestAnimationFrame(draw);
      else finish();
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      vault?.dispose();
      window.removeEventListener("resize", resize);
      document.removeEventListener("keydown", keydown);
      if (!finished && typeof stopSound === "function") stopSound();
    };
  }, [active, onComplete, onReveal, onSound]);
  return active
    ? createPortal(
        <div className="adv-welcome-flight" data-fold-exclude>
          <canvas ref={shaderRef} data-welcome-vault aria-hidden />
          <canvas ref={canvasRef} data-welcome-flight aria-hidden />
          <button
            type="button"
            className="adv-fold-skip"
            onClick={() => skipRef.current()}
          >
            Skip flight <kbd>Esc</kbd>
          </button>
        </div>,
        document.body,
      )
    : null;
}

function drawDecoration(ctx: CanvasRenderingContext2D, kind: number) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const ellipse = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  if (kind === 0) {
    // Santa: velvet coat, mittens, white beard, and a drooping hat.
    ellipse(0, 22, 27, 31, "#b52c36");
    ellipse(-28, 10, 10, 12, "#b52c36");
    ellipse(28, 2, 10, 12, "#b52c36");
    ctx.fillStyle = "#152e28";
    ctx.fillRect(-26, 28, 52, 7);
    ctx.strokeStyle = "#e6be68";
    ctx.lineWidth = 3;
    ctx.strokeRect(-5, 26, 10, 11);
    ellipse(0, -12, 25, 28, "#fff7e8");
    ellipse(0, -23, 18, 15, "#ecc3a4");
    ellipse(-7, -25, 2, 2, "#192c24");
    ellipse(7, -25, 2, 2, "#192c24");
    ellipse(0, -17, 5, 4, "#cf826e");
    ctx.fillStyle = "#b52c36";
    ctx.beginPath();
    ctx.moveTo(-23, -34);
    ctx.quadraticCurveTo(-2, -76, 29, -44);
    ctx.lineTo(21, -34);
    ctx.fill();
    ctx.fillStyle = "#fff7e8";
    ctx.fillRect(-24, -37, 48, 7);
    ellipse(29, -44, 7, 7, "#fff7e8");
  } else if (kind === 1) {
    // Reindeer, with branching antlers and a red nose.
    ellipse(-5, 12, 36, 20, "#9e6e45");
    ellipse(27, -8, 12, 24, "#9e6e45");
    ellipse(34, -26, 19, 12, "#b4875d");
    ellipse(50, -25, 5, 5, "#bb3340");
    ellipse(37, -29, 2, 2, "#152c26");
    ctx.strokeStyle = "#765435";
    ctx.lineWidth = 5;
    for (const x of [-30, -12, 9, 22]) {
      ctx.beginPath();
      ctx.moveTo(x, 22);
      ctx.lineTo(x - 10, 44);
      ctx.lineTo(x + 1, 49);
      ctx.stroke();
    }
    ctx.lineWidth = 3;
    for (const x of [20, 30]) {
      ctx.beginPath();
      ctx.moveTo(x, -34);
      ctx.lineTo(x - 5, -59);
      ctx.moveTo(x - 3, -46);
      ctx.lineTo(x - 14, -51);
      ctx.moveTo(x - 4, -53);
      ctx.lineTo(x + 4, -63);
      ctx.stroke();
    }
  } else if (kind === 2) {
    ellipse(0, 24, 28, 29, "#fffaf0");
    ellipse(0, -13, 21, 23, "#fffaf0");
    ctx.fillStyle = "#203d36";
    ctx.fillRect(-22, -34, 44, 6);
    ctx.fillRect(-13, -51, 26, 19);
    ctx.fillStyle = "#b52c36";
    ctx.fillRect(-22, 5, 44, 8);
    ctx.fillRect(9, 7, 8, 25);
    ellipse(-7, -18, 2, 2, "#203d36");
    ellipse(7, -18, 2, 2, "#203d36");
    ctx.fillStyle = "#d88640";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(21, -7);
    ctx.lineTo(0, -5);
    ctx.fill();
  } else if (kind === 3) {
    ctx.strokeStyle = "#fff8e5";
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(-8, 42);
    ctx.lineTo(-8, -25);
    ctx.arc(9, -25, 17, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = "#b52c36";
    ctx.lineWidth = 9;
    ctx.setLineDash([9, 13]);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (kind === 4) {
    ellipse(0, 5, 29, 33, "#bb3440");
    ellipse(-10, -6, 6, 13, "#e99787");
    ctx.fillStyle = "#d8b565";
    ctx.fillRect(-8, -34, 16, 8);
    ctx.strokeStyle = "#e8cd8c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -40, 7, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.strokeStyle = kind === 5 ? "#fff9eb" : "#e9c675";
    ctx.lineWidth = kind === 5 ? 3 : 5;
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -35);
      ctx.moveTo(-10, -22);
      ctx.lineTo(0, -14);
      ctx.lineTo(10, -22);
      ctx.stroke();
      ctx.restore();
    }
  }
}
