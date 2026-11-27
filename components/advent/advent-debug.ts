type Event = { at: number; event: string; details?: Record<string, unknown> };
const events: Event[] = [];
let installed = false;

export const adventDebugEnabled = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(location.search).get("adventDebug") === "1";

export function adventDiagnostics() {
  const device = navigator as Navigator & { deviceMemory?: number };
  return {
    page: location.pathname,
    build: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "unknown",
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    userAgent: navigator.userAgent,
    viewport: [innerWidth, innerHeight, devicePixelRatio],
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: device.deviceMemory,
    systemReducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    scene: { ...document.querySelector<HTMLElement>(".adv-page")?.dataset },
    canvases: Array.from(document.querySelectorAll("canvas")).map((canvas) => ({
      width: canvas.width,
      height: canvas.height,
      ...canvas.dataset,
    })),
    events: [...events],
  };
}

export function logAdvent(event: string, details?: Record<string, unknown>) {
  if (!adventDebugEnabled()) return;
  const entry = { at: Math.round(performance.now()), event, details };
  events.push(entry);
  if (events.length > 100) events.shift();
  console.info("[Advent]", event, details ?? "");
}

export async function copyAdventDiagnostics() {
  try {
    await navigator.clipboard.writeText(
      JSON.stringify(adventDiagnostics(), null, 2),
    );
    return true;
  } catch {
    logAdvent("clipboard.unavailable");
    return false;
  }
}

export function installAdventDebug() {
  if (!adventDebugEnabled() || installed) return;
  installed = true;
  Object.assign(window, {
    __adventDebug: { report: adventDiagnostics, copy: copyAdventDiagnostics },
  });
  const { events: _events, ...environment } = adventDiagnostics();
  logAdvent("environment", environment);
  window.addEventListener("error", (event) =>
    logAdvent("runtime.error", { message: event.message, line: event.lineno }),
  );
  window.addEventListener("unhandledrejection", (event) =>
    logAdvent("runtime.rejection", {
      message: String(event.reason).slice(0, 300),
    }),
  );
  document.addEventListener("visibilitychange", () =>
    logAdvent("page.visibility", { hidden: document.hidden }),
  );
}
