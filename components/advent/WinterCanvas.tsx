"use client";

import { canvasScale } from "./render-budget";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type WinterCanvasHandle = {
  throwSnowball: (x: number, y: number) => void;
  /** A snowball thrown at the viewer: it grows on the way and splats on the screen. */
  throwBack: (fromX: number, fromY: number, toX: number, toY: number) => void;
  burst: (x: number, y: number) => void;
};

type Snowball = {
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  ex: number;
  ey: number;
  start: number;
  duration: number;
  spin: number;
  incoming: boolean;
  seed: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  color: string;
};

type Splat = {
  x: number;
  y: number;
  start: number;
  seed: number;
  scale: number;
  duration: number;
  color: string;
};

export const SNOWBALL_DURATION = 650;
export const THROW_BACK_DURATION = 700;
const SPLAT_DURATION = 1600;
const SCREEN_SPLAT_DURATION = 2600;
const SPARKLE_COLORS = ["#ffd66b", "#ffffff", "#ff8a7a", "#9be7c4"];

export const WinterCanvas = forwardRef<
  WinterCanvasHandle,
  { active: boolean; slop: number; onImpact?: (x: number, y: number) => void }
>(function WinterCanvas({ active, slop, onImpact }, ref) {
  const slopRef = useRef(slop);
  slopRef.current = slop;
  const impactRef = useRef(onImpact);
  impactRef.current = onImpact;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowballs = useRef<Snowball[]>([]);
  const particles = useRef<Particle[]>([]);
  const splats = useRef<Splat[]>([]);
  const wakeRef = useRef(() => {});

  useImperativeHandle(ref, () => ({
    throwSnowball(x, y) {
      if (!active) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fromRight = x < w / 2;
      const sx = fromRight ? w + 40 : -40;
      const sy = h + 40;
      if (snowballs.current.length >= 12) return;
      snowballs.current.push({
        sx,
        sy,
        cx: (sx + x) / 2,
        cy: Math.min(sy, y) - h * 0.35,
        ex: x,
        ey: y,
        start: performance.now(),
        duration: SNOWBALL_DURATION,
        spin: fromRight ? -1 : 1,
        incoming: false,
        seed: Math.random(),
      });
      wakeRef.current();
    },
    throwBack(fromX, fromY, toX, toY) {
      if (!active) return;
      if (snowballs.current.length >= 12) return;
      snowballs.current.push({
        sx: fromX,
        sy: fromY,
        cx: (fromX + toX) / 2,
        cy: Math.min(fromY, toY) - window.innerHeight * 0.25,
        ex: toX,
        ey: toY,
        start: performance.now(),
        duration: THROW_BACK_DURATION,
        spin: toX < fromX ? -1 : 1,
        incoming: true,
        seed: Math.random(),
      });
      wakeRef.current();
    },
    burst(x, y) {
      if (!active) return;
      for (let i = 0; i < 36 && particles.current.length < 320; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          r: 1.5 + Math.random() * 2.5,
          life: 0,
          maxLife: 50 + Math.random() * 30,
          color:
            SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        });
      }
      wakeRef.current();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!active) return;

    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const dpr = canvasScale(window.innerWidth, window.innerHeight);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Reuse rasterized lighting; no per-projectile gradient/shadow each frame.
    const sprites = Array.from({ length: 9 }, (_, i) => {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 128;
      const paint = sprite.getContext("2d")!;
      const gradient = paint.createRadialGradient(48, 48, 5, 64, 64, 54);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.7, i ? `hsl(${i * 45} 90% 74%)` : "#eef3fa");
      gradient.addColorStop(1, i ? `hsl(${i * 45} 80% 48%)` : "#b9c7da");
      paint.fillStyle = gradient;
      paint.beginPath();
      paint.arc(64, 64, 54, 0, Math.PI * 2);
      paint.fill();
      if (i) {
        paint.font = "38px sans-serif";
        paint.textAlign = "center";
        paint.textBaseline = "middle";
        paint.fillText(["🧠", "✨", "🦄", "🚀"][i % 4], 64, 64);
      } else {
        paint.fillStyle = "#b9c7dacc";
        paint.beginPath();
        paint.arc(80, 75, 8, 0, Math.PI * 2);
        paint.arc(51, 84, 6, 0, Math.PI * 2);
        paint.fill();
      }
      return sprite;
    });
    const drawSplat = (splat: Splat, now: number) => {
      const t = (now - splat.start) / splat.duration;
      const s = splat.scale;
      ctx.globalAlpha = Math.max(0, 1 - t * t) * 0.92;
      ctx.fillStyle = splat.color;
      ctx.beginPath();
      ctx.arc(splat.x, splat.y, 16 * s, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 7; i++) {
        const a = splat.seed + (i / 7) * Math.PI * 2;
        const d = (18 + ((splat.seed * (i + 3)) % 1) * 10) * s;
        ctx.beginPath();
        ctx.arc(
          splat.x + Math.cos(a) * d,
          splat.y + Math.sin(a) * d,
          (4 + (i % 3) * 2) * s,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      if (s > 1) {
        // Slush sliding down the screen.
        for (let i = 0; i < 3; i++) {
          const dx = (i - 1) * 14 * s + Math.sin(splat.seed * 9 + i) * 6;
          const len = (10 + i * 6) * s * Math.min(1, t * 2.2);
          const top = splat.y + 8 * s;
          ctx.beginPath();
          ctx.moveTo(splat.x + dx - 3 * s, top);
          ctx.lineTo(splat.x + dx + 3 * s, top);
          ctx.lineTo(splat.x + dx + 2 * s, top + len);
          ctx.arc(splat.x + dx, top + len, 2 * s, 0, Math.PI);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    let last = 0;
    const loop = (now: number) => {
      const dt = last ? Math.min(3, (now - last) / (1000 / 60)) : 1;
      last = now;
      const power = slopRef.current;
      frame = 0;
      ctx.clearRect(0, 0, width, height);

      splats.current = splats.current.filter((s) => now - s.start < s.duration);
      for (const s of splats.current) drawSplat(s, now);

      snowballs.current = snowballs.current.filter((b) => {
        const raw = (now - b.start) / b.duration;
        const color =
          power > 0.25
            ? `hsl(${Math.floor(b.seed * 8 + 1) * 45} 90% 74%)`
            : "#ffffff";
        if (raw >= 1) {
          impactRef.current?.(b.ex, b.ey);
          if (splats.current.length >= 16) splats.current.shift();
          splats.current.push({
            x: b.ex,
            y: b.ey,
            start: now,
            seed: Math.random(),
            scale: (b.incoming ? 2.6 : 1) * (1 + power * power * 1.2),
            color,
            duration: b.incoming ? SCREEN_SPLAT_DURATION : SPLAT_DURATION,
          });
          const spread = (b.incoming ? 2 : 1) * (1 + power * 0.8);
          for (
            let i = 0;
            i < 22 * spread && particles.current.length < 320;
            i++
          ) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (1.5 + Math.random() * 4.5) * spread;
            particles.current.push({
              x: b.ex,
              y: b.ey,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 1.5,
              r: (1.5 + Math.random() * 3) * spread,
              life: 0,
              maxLife: 35 + Math.random() * 25,
              color,
            });
          }
          return false;
        }
        const t = b.incoming ? raw : 1 - Math.pow(1 - raw, 2);
        const wobble = Math.sin(raw * Math.PI) * power * power;
        const x =
          (1 - t) ** 2 * b.sx +
          2 * (1 - t) * t * b.cx +
          t * t * b.ex +
          Math.sin(raw * (16 + b.seed * 18)) * wobble * 80;
        const y =
          (1 - t) ** 2 * b.sy +
          2 * (1 - t) * t * b.cy +
          t * t * b.ey +
          Math.cos(raw * (12 + b.seed * 12)) * wobble * 55;
        const r =
          (b.incoming ? 6 + 38 * t ** 3 : 34 - 20 * t) *
          (1 + power * power * (0.6 + b.seed));
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(b.spin * raw * Math.PI * (3 + power * 7));
        ctx.drawImage(sprites[0], -r * 1.18, -r * 1.18, r * 2.36, r * 2.36);
        if (power > 0.1) {
          ctx.globalAlpha = Math.min(1, power * 1.5);
          ctx.drawImage(
            sprites[1 + Math.floor(b.seed * 8)],
            -r * 1.18,
            -r * 1.18,
            r * 2.36,
            r * 2.36,
          );
          for (let i = 0; i < Math.floor(power * 4); i++) {
            const a = raw * 15 + i * Math.PI * 0.5;
            ctx.drawImage(
              sprites[1 + ((i + Math.floor(b.seed * 8)) % 8)],
              Math.cos(a) * r * 1.5 - r * 0.3,
              Math.sin(a) * r * 1.5 - r * 0.3,
              r * 0.6,
              r * 0.6,
            );
          }
        }
        ctx.restore();
        return true;
      });

      particles.current = particles.current.filter((p) => {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.18 * dt;
        p.vx *= Math.pow(0.98, dt);
        if (p.life >= p.maxLife) return false;
        ctx.globalAlpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;

      if (
        snowballs.current.length ||
        splats.current.length ||
        particles.current.length
      )
        frame = requestAnimationFrame(loop);
    };
    wakeRef.current = () => {
      if (!frame && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(loop);
      }
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        snowballs.current = [];
        particles.current = [];
        splats.current = [];
        ctx.clearRect(0, 0, width, height);
      }
    };
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      wakeRef.current = () => {};
      snowballs.current = [];
      particles.current = [];
      splats.current = [];
      ctx.clearRect(0, 0, width, height);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
});
