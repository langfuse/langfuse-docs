"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type CalendarShatterHandle = {
  prepare: () => void;
  hit: (x: number, y: number) => void;
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
};

/** The real calendar, fractured into textured triangles and pulled back by springs. */
export const CalendarShatter = forwardRef<CalendarShatterHandle>(
  function CalendarShatter(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const snapshot = useRef<{
      image: HTMLCanvasElement;
      rect: DOMRect;
      board: HTMLElement;
    } | null>(null);
    const shards = useRef<Shard[]>([]);
    const frame = useRef(0);
    const capturing = useRef(false);
    const generation = useRef(0);
    const cancel = () => {
      generation.current++;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      if (snapshot.current)
        snapshot.current.board.style.removeProperty("opacity");
      snapshot.current = null;
      shards.current = [];
      const canvas = canvasRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas) delete canvas.dataset.shattering;
    };
    useEffect(() => {
      window.addEventListener("resize", cancel);
      return () => {
        cancel();
        window.removeEventListener("resize", cancel);
      };
    }, []);
    useImperativeHandle(ref, () => ({
      cancel,
      prepare() {
        if (
          capturing.current ||
          frame.current ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const board = document.querySelector<HTMLElement>(".adv-board");
        if (!board) return;
        const version = generation.current;
        capturing.current = true;
        void import("html-to-image")
          .then(({ toCanvas }) =>
            toCanvas(board, {
              pixelRatio: Math.min(1.5, 1400 / board.offsetWidth),
              preferredFontFormat: "woff2",
              style: { transform: "none", opacity: "1" },
            }),
          )
          .then((image) => {
            if (
              version === generation.current &&
              board.isConnected &&
              !frame.current
            )
              snapshot.current = {
                image,
                rect: board.getBoundingClientRect(),
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
      hit(x, y) {
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
            s.vx += ((s.x - x) / distance) * 150;
            s.vy += ((s.y - y) / distance) * 150 - 60;
          }
          return;
        }
        const dpr = Math.min(devicePixelRatio, 1.5);
        canvas.width = innerWidth * dpr;
        canvas.height = innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const { rect, image, board } = capture;
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
              const force = 350 + 450 * Math.exp(-distance / 400);
              shards.current.push({
                x: hx,
                y: hy,
                hx,
                hy,
                points,
                vx: (dx / distance) * force,
                vy: (dy / distance) * force - 160,
                angle: 0,
                spin: (col % 2 ? 1 : -1) * (2 + row * 0.2),
              });
            }
          }
        board.style.opacity = "0";
        canvas.dataset.shattering = "true";
        const start = performance.now();
        let last = start;
        const draw = (now: number) => {
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
              rect.x - s.hx,
              rect.y - s.hy,
              rect.width,
              rect.height,
            );
            ctx.restore();
          }
          canvas.dataset.progress = Math.min(1, age / 2.4).toFixed(3);
          if (age < 2.4) frame.current = requestAnimationFrame(draw);
          else cancel();
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
