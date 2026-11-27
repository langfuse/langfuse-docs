// Frame caps allow 1ms of rAF timestamp jitter so 60Hz displays do not fall to 20fps.
/** Hardware hints select a conservative starting budget, never disable animation. */
export function renderPixels(maximum: number) {
  const device = navigator as Navigator & { deviceMemory?: number };
  const constrained =
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4);
  return Math.min(maximum, constrained ? 360_000 : maximum);
}
/** Decorative layers don't need a retina-sized backing store on a large display. */
export function canvasScale(width: number, height: number, pixels = 900_000) {
  return Math.min(
    devicePixelRatio || 1,
    1.25,
    Math.sqrt(renderPixels(pixels) / Math.max(1, width * height)),
  );
}

/** Bounded sampling: summarize once, never log or update React on every frame. */
export function frameMonitor() {
  const intervals: number[] = [];
  let last = 0;
  let frames = 0;
  const recent: boolean[] = [];
  return {
    frame(now: number) {
      frames++;
      const gap = last ? now - last : 0;
      last = now;
      if (!gap) return false;
      if (intervals.length < 600) intervals.push(gap);
      recent.push(gap > 50);
      if (recent.length > 12) recent.shift();
      // Repeated missed frames matter even when good frames appear between them.
      // One capture/dialog stall cannot trigger this downgrade.
      if (recent.length === 12 && recent.filter(Boolean).length >= 8) {
        recent.length = 0;
        return true;
      }
      return false;
    },
    summary() {
      const sorted = [...intervals].sort((a, b) => a - b);
      return {
        frames,
        frame_p95_ms: Math.round(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
        slow_frames: intervals.filter((value) => value > 55).length,
      };
    },
  };
}
