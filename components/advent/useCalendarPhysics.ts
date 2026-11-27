"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

type Body = {
  el: HTMLElement;
  cx: number;
  cy: number;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  turn: number;
  spin: number;
  rx: number;
  ry: number;
  vrx: number;
  vry: number;
};

/** Spring integration lives outside React so pointer motion never rerenders doors. */
export function useCalendarPhysics(
  root: RefObject<HTMLDivElement | null>,
  active: boolean,
  reduced: boolean,
) {
  const impactRef = useRef<
    (x: number, y: number, power: number, mode: number) => void
  >(() => {});
  useEffect(() => {
    const scene = root.current;
    if (!scene || !active || reduced) return;
    const bodies: Body[] = Array.from(
      scene.querySelectorAll<HTMLElement>("[data-advent-door]"),
    ).map((el: HTMLElement) => ({
      el,
      cx: 0,
      cy: 0,
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      turn: 0,
      spin: 0,
      rx: 0,
      ry: 0,
      vrx: 0,
      vry: 0,
    }));
    const setStyle = (el: HTMLElement, key: string, value: string) => {
      if (el.style.getPropertyValue(key) !== value)
        el.style.setProperty(key, value);
    };
    const board = scene.querySelector<HTMLElement>(".adv-board");
    const pointer = { x: innerWidth / 2, y: innerHeight / 2, live: false };
    let frame = 0,
      last = 0,
      tiltX = 0,
      tiltY = 0;
    const measure = () =>
      bodies.forEach((body) => {
        const rect = body.el.getBoundingClientRect();
        body.w = rect.width;
        body.h = rect.height;
        body.cx = rect.x + rect.width / 2 - body.x;
        body.cy = rect.y + rect.height / 2 - body.y;
      });
    const draw = (now: number) => {
      const dt = Math.min(1 / 30, (now - (last || now - 16)) / 1000);
      last = now;
      const px = pointer.live ? pointer.x / innerWidth - 0.5 : 0;
      const py = pointer.live ? pointer.y / innerHeight - 0.5 : 0;
      tiltX += (-py * 4 - tiltX) * Math.min(1, dt * 6);
      tiltY += (px * 5 - tiltY) * Math.min(1, dt * 6);
      const hidden = board?.style.opacity === "0";
      if (board && !hidden)
        board.style.transform = `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      let moving = Math.abs(tiltX + py * 4) + Math.abs(tiltY - px * 5) > 0.005;
      for (const body of bodies) {
        const dx = (pointer.x - body.cx) / Math.max(80, body.w);
        const dy = (pointer.y - body.cy) / Math.max(80, body.h);
        const near = pointer.live ? Math.max(0, 1 - Math.hypot(dx, dy) / 2) : 0;
        body.vrx += ((-dy * near * 12 - body.rx) * 150 - body.vrx * 19) * dt;
        body.vry += ((dx * near * 12 - body.ry) * 150 - body.vry * 19) * dt;
        body.rx += body.vrx * dt;
        body.ry += body.vry * dt;
        body.vx += (-body.x * 75 - body.vx * 7) * dt;
        body.vy += (-body.y * 75 - body.vy * 7) * dt;
        body.spin += (-body.turn * 70 - body.spin * 8) * dt;
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.turn += body.spin * dt;
        if (!hidden) {
          setStyle(
            body.el,
            "--adv-physics",
            `translate3d(${body.x.toFixed(2)}px,${body.y.toFixed(2)}px,${(near * 14).toFixed(2)}px) rotateX(${body.rx.toFixed(2)}deg) rotateY(${body.ry.toFixed(2)}deg) rotateZ(${body.turn.toFixed(2)}deg)`,
          );
          setStyle(
            body.el,
            "--adv-shine-x",
            `${Math.round(Math.max(0, Math.min(100, 50 + dx * 50)))}%`,
          );
          setStyle(
            body.el,
            "--adv-shine-y",
            `${Math.round(Math.max(0, Math.min(100, 50 + dy * 50)))}%`,
          );
        }
        moving ||=
          Math.abs(body.vx) +
            Math.abs(body.vy) +
            Math.abs(body.spin) +
            Math.abs(body.vrx) +
            Math.abs(body.vry) >
          0.03;
      }
      scene.style.setProperty("--adv-pointer-x", String(px));
      scene.style.setProperty("--adv-pointer-y", String(py));
      frame = moving ? requestAnimationFrame(draw) : 0;
    };
    const wake = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(draw);
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.live = true;
      wake();
    };
    const leave = () => {
      pointer.live = false;
      wake();
    };
    impactRef.current = (x, y, power, mode) => {
      for (const body of bodies) {
        const dx = body.cx - x,
          dy = body.cy - y;
        const distance = Math.max(40, Math.hypot(dx, dy));
        const chaos = power * power;
        const force =
          650 *
          Math.exp(-distance / (150 + chaos * 500)) *
          (0.045 + mode * 0.04 + chaos * 1.4);
        body.vx +=
          (dx / distance + (Math.random() - 0.5) * power * 0.4) * force;
        body.vy +=
          (dy / distance - 0.15 + (Math.random() - 0.5) * power * 0.4) * force;
        body.spin += (dx < 0 ? -1 : 1) * force * (0.035 + power * 0.17);
      }
      wake();
    };
    measure();
    const resize = new ResizeObserver(() => {
      measure();
      wake();
    });
    if (board) resize.observe(board);
    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      if (board) board.style.removeProperty("transform");
      bodies.forEach((b) => b.el.style.removeProperty("--adv-physics"));
      impactRef.current = () => {};
    };
  }, [active, reduced, root]);
  return useCallback(
    (x: number, y: number, power: number, mode: number) =>
      impactRef.current(x, y, power, mode),
    [],
  );
}
