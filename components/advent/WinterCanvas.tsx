"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type WinterCanvasHandle = {
  throwSnowball: (x: number, y: number) => void;
  /** A snowball thrown at the viewer: it grows on the way and splats on the screen. */
  throwBack: (fromX: number, fromY: number, toX: number, toY: number) => void;
  burst: (x: number, y: number) => void;
};

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
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
};

export const SNOWBALL_DURATION = 650;
export const THROW_BACK_DURATION = 700;
const SPLAT_DURATION = 1600;
const SCREEN_SPLAT_DURATION = 2600;
const SPARKLE_COLORS = ["#ffd66b", "#ffffff", "#ff8a7a", "#9be7c4"];

export const WinterCanvas = forwardRef<WinterCanvasHandle, { snow: boolean }>(
  function WinterCanvas({ snow }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const snowballs = useRef<Snowball[]>([]);
    const particles = useRef<Particle[]>([]);
    const splats = useRef<Splat[]>([]);
    const snowRef = useRef(snow);
    snowRef.current = snow;

    useImperativeHandle(ref, () => ({
      throwSnowball(x, y) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const fromRight = x < w / 2;
        const sx = fromRight ? w + 40 : -40;
        const sy = h + 40;
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
        });
      },
      throwBack(fromX, fromY, toX, toY) {
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
        });
      },
      burst(x, y) {
        for (let i = 0; i < 36; i++) {
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
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      let width = 0;
      let height = 0;
      let flakes: Flake[] = [];
      let frame = 0;

      const makeFlake = (y?: number): Flake => ({
        x: Math.random() * width,
        y: y ?? Math.random() * height,
        r: 0.8 + Math.random() * 2.4,
        speed: 0.3 + Math.random() * 0.9,
        drift: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.round(Math.min(140, (width * height) / 12000));
        flakes = Array.from({ length: count }, () => makeFlake());
      };
      resize();
      window.addEventListener("resize", resize);

      const drawSplat = (splat: Splat, now: number) => {
        const t = (now - splat.start) / splat.duration;
        const s = splat.scale;
        ctx.globalAlpha = Math.max(0, 1 - t * t) * 0.92;
        ctx.fillStyle = "#ffffff";
        if (s > 1) {
          ctx.shadowColor = "rgba(20, 30, 50, 0.25)";
          ctx.shadowBlur = 10;
        }
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

      const loop = (now: number) => {
        ctx.clearRect(0, 0, width, height);

        if (snowRef.current) {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "rgba(110, 130, 160, 0.55)";
          ctx.lineWidth = 0.8;
          for (const f of flakes) {
            f.y += f.speed;
            f.x += Math.sin(now / 1600 + f.phase) * f.drift * 0.4;
            if (f.y > height + 5) Object.assign(f, makeFlake(-5));
            ctx.globalAlpha = 0.55 + f.r / 8;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }

        splats.current = splats.current.filter(
          (s) => now - s.start < s.duration,
        );
        for (const s of splats.current) drawSplat(s, now);

        snowballs.current = snowballs.current.filter((b) => {
          const raw = (now - b.start) / b.duration;
          if (raw >= 1) {
            splats.current.push({
              x: b.ex,
              y: b.ey,
              start: now,
              seed: Math.random(),
              scale: b.incoming ? 2.6 : 1,
              duration: b.incoming ? SCREEN_SPLAT_DURATION : SPLAT_DURATION,
            });
            const spread = b.incoming ? 2 : 1;
            for (let i = 0; i < 22 * spread; i++) {
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
                color: "#ffffff",
              });
            }
            return false;
          }
          const t = b.incoming ? raw : 1 - Math.pow(1 - raw, 2);
          const x =
            (1 - t) * (1 - t) * b.sx + 2 * (1 - t) * t * b.cx + t * t * b.ex;
          const y =
            (1 - t) * (1 - t) * b.sy + 2 * (1 - t) * t * b.cy + t * t * b.ey;
          const r = b.incoming ? 6 + 38 * t * t * t : 34 - 20 * t;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(b.spin * raw * Math.PI * 3);
          const gradient = ctx.createRadialGradient(
            -r * 0.35,
            -r * 0.35,
            r * 0.1,
            0,
            0,
            r,
          );
          gradient.addColorStop(0, "#ffffff");
          gradient.addColorStop(0.7, "#eef3fa");
          gradient.addColorStop(1, "#b9c7da");
          ctx.fillStyle = gradient;
          ctx.shadowColor = "rgba(20, 30, 50, 0.35)";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(185, 199, 218, 0.8)";
          ctx.beginPath();
          ctx.arc(r * 0.3, r * 0.2, r * 0.18, 0, Math.PI * 2);
          ctx.arc(-r * 0.25, r * 0.4, r * 0.12, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return true;
        });

        particles.current = particles.current.filter((p) => {
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.vx *= 0.98;
          if (p.life >= p.maxLife) return false;
          ctx.globalAlpha = 1 - p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
        ctx.globalAlpha = 1;

        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
      />
    );
  },
);
