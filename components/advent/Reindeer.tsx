"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type ReindeerHandle = {
  /** Returns true when a snowball landing at this viewport point hits the team. */
  hit: (x: number, y: number) => boolean;
};

type Flight = {
  dir: 1 | -1;
  x: number;
  y: number;
  baseY: number;
  w: number;
  h: number;
  speed: number;
  phase: number;
  age: number;
  rot: number;
  fall: { vx: number; vy: number; vr: number } | null;
};

const VIEW_W = 210;
const VIEW_H = 66;
const GRAVITY = 900;
const HIT_PADDING = 18;

function Deer({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M50 12L46 2M48 7L42 5M54 11L58 1M56 6L62 4"
        stroke="#6b4426"
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      <g className="adv-reindeer-legs-back">
        <path
          d="M15 31L5 40M19 33L9 43"
          stroke="#6b4426"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>
      <g className="adv-reindeer-legs-front">
        <path
          d="M36 31L49 37M32 33L45 41"
          stroke="#6b4426"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>
      <circle cx={9} cy={24} r={3} fill="#f6efe3" />
      <ellipse cx={26} cy={28} rx={17} ry={8.5} fill="#9a6337" />
      <ellipse cx={27} cy={31.5} rx={11} ry={3.5} fill="#c08a5a" />
      <path d="M35 24Q44 20 46 12L53 14Q49 25 40 31Z" fill="#9a6337" />
      <ellipse
        cx={46.5}
        cy={9}
        rx={3.4}
        ry={1.6}
        transform="rotate(-30 46.5 9)"
        fill="#7a4a26"
      />
      <ellipse
        cx={52}
        cy={13}
        rx={7}
        ry={5}
        transform="rotate(15 52 13)"
        fill="#9a6337"
      />
      <ellipse cx={58} cy={15.5} rx={3.6} ry={3} fill="#c08a5a" />
      <circle cx={61} cy={15} r={1.8} fill="#3b2416" />
      <circle cx={53} cy={11.5} r={1.1} fill="#1e140c" />
      <path d="M30 20V36" stroke="var(--adv-red)" strokeWidth={3} />
      <circle cx={30} cy={37.5} r={2.4} fill="var(--adv-gold)" />
    </g>
  );
}

/** A reindeer team that crosses the page now and then, and falls when hit. */
export const ReindeerFlight = forwardRef<ReindeerHandle, { active: boolean }>(
  function ReindeerFlight({ active }, ref) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const flight = useRef<Flight | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        hit(x, y) {
          const f = flight.current;
          const parent = nodeRef.current?.parentElement;
          if (!f || f.fall || !parent) return false;
          const origin = parent.getBoundingClientRect();
          const px = x - origin.left;
          const py = y - origin.top;
          if (
            px < f.x - HIT_PADDING ||
            px > f.x + f.w + HIT_PADDING ||
            py < f.y - HIT_PADDING ||
            py > f.y + f.h + HIT_PADDING
          ) {
            return false;
          }
          f.fall = {
            vx: f.dir * f.speed * 0.35,
            vy: -160,
            vr: f.dir * (240 + Math.random() * 120),
          };
          if (nodeRef.current) nodeRef.current.dataset.state = "falling";
          return true;
        },
      }),
      [],
    );

    useEffect(() => {
      const node = nodeRef.current;
      const parent = node?.parentElement;
      if (!active || !node || !parent) return;
      let timer: ReturnType<typeof setTimeout>;
      let frame = 0;
      let last = 0;

      const loop = (now: number) => {
        const f = flight.current;
        if (!f) return;
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
        last = now;
        const bounds = { w: parent.clientWidth, h: parent.clientHeight };
        let done: boolean;
        if (f.fall) {
          f.fall.vy += GRAVITY * dt;
          f.x += f.fall.vx * dt;
          f.y += f.fall.vy * dt;
          f.rot += f.fall.vr * dt;
          done = f.y > bounds.h + f.h;
        } else {
          f.age += dt;
          f.x += f.dir * f.speed * dt;
          f.y = f.baseY + Math.sin(f.age * 1.6 + f.phase) * f.h * 0.18;
          f.rot = Math.cos(f.age * 1.6 + f.phase) * 3 * f.dir;
          done = f.dir === 1 ? f.x > bounds.w : f.x < -f.w;
        }
        node.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) rotate(${f.rot}deg)`;
        if (done) {
          const wasHit = Boolean(f.fall);
          flight.current = null;
          node.dataset.state = "idle";
          timer = setTimeout(
            spawn,
            (wasHit ? 4000 : 7000) + Math.random() * 5000,
          );
          return;
        }
        frame = requestAnimationFrame(loop);
      };

      const spawn = () => {
        const w = parent.clientWidth < 640 ? 140 : VIEW_W;
        const h = (w * VIEW_H) / VIEW_W;
        const dir = Math.random() < 0.5 ? 1 : -1;
        const baseY = parent.clientHeight * (0.12 + Math.random() * 0.22);
        flight.current = {
          dir,
          x: dir === 1 ? -w : parent.clientWidth,
          y: baseY,
          baseY,
          w,
          h,
          // Slow enough to aim at: about 20 seconds across a desktop screen.
          speed:
            (parent.clientWidth + w) / (parent.clientWidth < 640 ? 13 : 20),
          phase: Math.random() * Math.PI * 2,
          age: 0,
          rot: 0,
          fall: null,
        };
        node.style.width = `${w}px`;
        node.dataset.dir = String(dir);
        node.dataset.state = "flying";
        last = 0;
        frame = requestAnimationFrame(loop);
      };

      timer = setTimeout(spawn, 2500);
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
        flight.current = null;
        node.dataset.state = "idle";
      };
    }, [active]);

    return (
      <div
        ref={nodeRef}
        className="adv-reindeer"
        data-state="idle"
        data-dir="1"
        aria-hidden
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="adv-reindeer-team"
          overflow="visible"
        >
          <path
            d="M60 30Q80 22 100 26M128 24Q148 18 170 26"
            stroke="#3b2416"
            strokeWidth={1}
            fill="none"
          />
          <path
            d="M2 56Q0 62 8 62H54Q60 62 58 56M14 52V61M44 52V61"
            stroke="var(--adv-gold)"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
          <rect x={12} y={19} width={14} height={13} rx={1.5} fill="#1f5c3f" />
          <path d="M19 19V32M12 25H26" stroke="#f2c14e" strokeWidth={2} />
          <rect x={28} y={23} width={10} height={9} rx={1.5} fill="#f2c14e" />
          <path
            d="M4 30H48Q58 30 60 22Q65 30 58 40Q54 52 40 52H12Q4 52 4 44Z"
            fill="var(--adv-red)"
          />
          <path
            d="M6 36H50"
            stroke="var(--adv-gold)"
            strokeWidth={1.5}
            opacity={0.8}
          />
          <Deer x={70} />
          <Deer x={140} />
        </svg>
      </div>
    );
  },
);
