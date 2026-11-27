import posthog from "posthog-js";
import { logAdvent } from "./advent-debug";

type Properties = Record<string, string | number | boolean | null | undefined>;

/** Use the site's existing client and consent policy; never initialize another one. */
function context() {
  const scene = document.querySelector<HTMLElement>(".adv-page");
  return {
    schema_version: 1,
    mode: scene?.dataset.mode,
    motion: scene?.dataset.motion,
    stage: scene?.dataset.experience,
    slop: Number(scene?.dataset.slop ?? 0),
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    debug: new URLSearchParams(location.search).get("adventDebug") === "1",
  };
}

export function trackAdvent(action: string, properties: Properties = {}) {
  const payload = { ...context(), ...properties };
  logAdvent(`action.${action}`, payload);
  // Instrumentation must never interrupt a gesture or a transition.
  try {
    if (posthog.__loaded) posthog.capture(`advent:${action}`, payload);
  } catch {
    logAdvent("analytics.unavailable");
  }
}

/** Collapse continuous controls to their final value and rapid play to counts. */
export function createAdventInteractionBatch() {
  const pending = new Map<string, Properties>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    pending.forEach((properties, action) => trackAdvent(action, properties));
    pending.clear();
  };
  return {
    record(action: string, properties: Properties, count = false) {
      const previous = pending.get(action);
      pending.set(action, {
        ...context(),
        ...properties,
        ...(count ? { count: Number(previous?.count ?? 0) + 1 } : {}),
      });
      // A fixed window also bounds event volume during a long slider drag.
      timer ??= setTimeout(flush, 2000);
    },
    flush,
  };
}
