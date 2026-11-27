// Frame caps allow 1ms of rAF timestamp jitter so 60Hz displays do not fall to 20fps.
/** Decorative layers don't need a retina-sized backing store on a large display. */
export function canvasScale(width: number, height: number, pixels = 900_000) {
  return Math.min(
    devicePixelRatio || 1,
    1.25,
    Math.sqrt(pixels / Math.max(1, width * height)),
  );
}

/** Bounded sampling: summarize once, never log or update React on every frame. */
export function frameMonitor() {
  const intervals: number[] = [];
  let last = 0;
  let frames = 0;
  let slow = 0;
  return {
    frame(now: number) {
      frames++;
      const gap = last ? now - last : 0;
      last = now;
      if (!gap) return false;
      if (intervals.length < 600) intervals.push(gap);
      slow = gap > 55 ? slow + 1 : 0;
      // Require sustained pressure; a single capture or dialog mount is not GPU load.
      if (slow >= 8) {
        slow = 0;
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
