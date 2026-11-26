"use client";

import { captureAdvent } from "./capture";
import { canvasScale } from "./render-budget";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type CalendarShatterHandle = {
  prepare: () => void;
  hit: (x: number, y: number, power: number) => void;
  cancel: () => void;
};
type Shard = {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  points: [number, number][];
  crop: [number, number, number, number];
};

/** The real calendar, fractured into textured triangles and pulled back by springs. */
export const CalendarShatter = forwardRef<CalendarShatterHandle>(
  function CalendarShatter(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const snapshot = useRef<{
      image: HTMLCanvasElement;
      mode: number;
      board: HTMLElement;
    } | null>(null);
    const shards = useRef<Shard[]>([]);
    const frame = useRef(0);
    const capturing = useRef(false);
    const generation = useRef(0);
    const stop = () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      if (snapshot.current)
        snapshot.current.board.style.removeProperty("opacity");
      shards.current = [];
      const canvas = canvasRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas) delete canvas.dataset.shattering;
    };
    const cancel = () => {
      generation.current++;
      stop();
      snapshot.current = null;
    };
    useEffect(() => {
      const visibility = () => {
        if (document.hidden) cancel();
      };
      document.addEventListener("visibilitychange", visibility);
      window.addEventListener("resize", cancel);
      return () => {
        cancel();
        window.removeEventListener("resize", cancel);
        document.removeEventListener("visibilitychange", visibility);
      };
    }, []);
    useImperativeHandle(ref, () => ({
      cancel,
      prepare() {
        const mode = Number(
          document
            .querySelector<HTMLElement>(".adv-page")
            ?.style.getPropertyValue("--adv-scene") || 0,
        );
        if (snapshot.current && Math.abs(snapshot.current.mode - mode) > 0.01)
          cancel();
        // The theme is morphing: wait for a stable image instead of recapturing every throw.
        if (mode > 0.001 && mode < 0.999) return;
        if (
          snapshot.current ||
          capturing.current ||
          frame.current ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const board = document.querySelector<HTMLElement>(".adv-board");
        if (!board) return;
        const version = generation.current;
        capturing.current = true;
        void captureAdvent(board, {
          pixelRatio: canvasScale(
            board.offsetWidth,
            board.offsetHeight,
            650_000,
          ),
          style: { transform: "none", opacity: "1" },
        })
          .then((image) => {
            if (
              version === generation.current &&
              board.isConnected &&
              !frame.current
            )
              snapshot.current = {
                image,
                mode,
                board,
              };
          })
          .catch(() => {
            /* DOM springs still react when capture is unavailable. */
          })
          .finally(() => {
            capturing.current = false;
          });
      },
      hit(x, y, power) {
        const capture = snapshot.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (
          !capture ||
          !canvas ||
          !ctx ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        if (frame.current) {
          for (const s of shards.current) {
            const distance = Math.max(20, Math.hypot(s.x - x, s.y - y));
            s.vx += ((s.x - x) / distance) * (50 + power * 100);
            s.vy += ((s.y - y) / distance) * (50 + power * 100) - power * 60;
          }
          return;
        }
        const dpr = canvasScale(innerWidth, innerHeight);
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const { image, board } = capture;
        const rect = board.getBoundingClientRect();
        shards.current = [];
        for (let row = 0; row < 6; row++)
          for (let col = 0; col < 8; col++) {
            const x0 = rect.x + (col / 8) * rect.width,
              x1 = rect.x + ((col + 1) / 8) * rect.width;
            const y0 = rect.y + (row / 6) * rect.height,
              y1 = rect.y + ((row + 1) / 6) * rect.height;
            const triangles: [number, number][][] = [
              [
                [x0, y0],
                [x1, y0],
                [x0, y1],
              ],
              [
                [x1, y0],
                [x1, y1],
                [x0, y1],
              ],
            ];
            for (const points of triangles) {
              const hx = points.reduce((sum, p) => sum + p[0], 0) / 3,
                hy = points.reduce((sum, p) => sum + p[1], 0) / 3;
              const dx = hx - x,
                dy = hy - y,
                distance = Math.max(30, Math.hypot(dx, dy));
              const force =
                (100 + 700 * power) * Math.exp(-distance / (250 + power * 400));
              shards.current.push({
                x: hx,
                y: hy,
                hx,
                hy,
                points,
                crop: [x0, y0, x1 - x0, y1 - y0],
                vx: (dx / distance) * force,
                vy: (dy / distance) * force - 160 * power,
                angle: 0,
                spin: (col % 2 ? 1 : -1) * (0.5 + power * 1.5 + row * 0.2),
              });
            }
          }
        board.style.opacity = "0";
        canvas.dataset.shattering = "true";
        const start = performance.now();
        let last = start;
        const draw = (now: number) => {
          if (now - last < 1000 / 30) {
            frame.current = requestAnimationFrame(draw);
            return;
          }
          const age = (now - start) / 1000;
          const dt = Math.min(0.033, (now - last) / 1000);
          last = now;
          ctx.clearRect(0, 0, innerWidth, innerHeight);
          for (const s of shards.current) {
            if (age < 0.48) {
              s.vy += 480 * dt;
              s.vx *= Math.exp(-dt * 0.8);
            } else {
              s.vx += ((s.hx - s.x) * 75 - s.vx * 14) * dt;
              s.vy += ((s.hy - s.y) * 75 - s.vy * 14) * dt;
              s.spin += (-s.angle * 65 - s.spin * 14) * dt;
            }
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.angle += s.spin * dt;
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(s.angle);
            ctx.beginPath();
            s.points.forEach(([px, py], i) =>
              i
                ? ctx.lineTo(px - s.hx, py - s.hy)
                : ctx.moveTo(px - s.hx, py - s.hy),
            );
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(
              image,
              ((s.crop[0] - rect.x) / rect.width) * image.width,
              ((s.crop[1] - rect.y) / rect.height) * image.height,
              (s.crop[2] / rect.width) * image.width,
              (s.crop[3] / rect.height) * image.height,
              s.crop[0] - s.hx,
              s.crop[1] - s.hy,
              s.crop[2],
              s.crop[3],
            );
            ctx.restore();
          }
          canvas.dataset.progress = Math.min(1, age / 2.4).toFixed(3);
          if (age < 2.4) frame.current = requestAnimationFrame(draw);
          else stop();
        };
        frame.current = requestAnimationFrame(draw);
      },
    }));
    return (
      <canvas
        ref={canvasRef}
        className="adv-shatter-canvas"
        aria-hidden
        data-fold-exclude
      />
    );
  },
);
