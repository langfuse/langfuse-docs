/**
 * Smooth cursor-relative spotlight for `.pattern-bg` / `#nd-page`.
 * Uses rAF + exponential smoothing instead of CSS transitions on @property,
 * which feels laggy under fast mousemove and can cause extra layout work.
 */

const SMOOTHING = 0.22;
const EPSILON = 0.06;

export type PatternSpotlightState = {
  tx: number;
  ty: number;
  cx: number;
  cy: number;
  raf: number;
};

export function createPatternSpotlightState(): PatternSpotlightState {
  return { tx: 50, ty: 50, cx: 50, cy: 50, raf: 0 };
}

export function disposePatternSpotlight(state: PatternSpotlightState) {
  if (state.raf) cancelAnimationFrame(state.raf);
  state.raf = 0;
}

export function updatePatternSpotlightTarget(
  getEl: () => HTMLElement | null,
  state: PatternSpotlightState,
  xPct: number,
  yPct: number
) {
  state.tx = xPct;
  state.ty = yPct;
  if (state.raf !== 0) return;

  const tick = () => {
    state.raf = 0;
    const el = getEl();
    if (!el) return;

    const dx = state.tx - state.cx;
    const dy = state.ty - state.cy;
    if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
      state.cx = state.tx;
      state.cy = state.ty;
      el.style.setProperty("--cursor-x", `${state.cx}%`);
      el.style.setProperty("--cursor-y", `${state.cy}%`);
      return;
    }

    state.cx += dx * SMOOTHING;
    state.cy += dy * SMOOTHING;
    el.style.setProperty("--cursor-x", `${state.cx}%`);
    el.style.setProperty("--cursor-y", `${state.cy}%`);
    state.raf = requestAnimationFrame(tick);
  };

  state.raf = requestAnimationFrame(tick);
}
