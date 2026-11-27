"use client";

import { captureAdvent } from "./capture";
import {
  createFoldRenderer,
  createCanvasFold,
  type FoldRenderer,
} from "./fold-renderer";
import { canvasScale, frameMonitor } from "./render-budget";
import { logAdvent } from "./advent-debug";
import { trackAdvent } from "./analytics";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { getFoldSeconds, FOLD_REVEAL } from "./fold-timing";

export type PageFoldHandle = {
  skip: () => void;
  play: (
    point: { x: number; y: number },
    berlin: boolean,
    onStart: () => void | (() => void),
    onReveal: () => void,
    variant?: number,
    closing?: boolean,
  ) => Promise<boolean>;
};

export const PageFold = forwardRef<PageFoldHandle, { reducedMotion: boolean }>(
  function PageFold({ reducedMotion }, ref) {
    const reducedRef = useRef(reducedMotion);
    reducedRef.current = reducedMotion;
    const [active, setActive] = useState(false);
    const busy = useRef(false);
    const lastSnapshot = useRef<HTMLCanvasElement | null>(null);
    const mounted = useRef(true);
    const cancel = useRef<() => void>(() => {});
    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        cancel.current();
      };
    }, []);
    useEffect(() => {
      if (reducedMotion) cancel.current();
    }, [reducedMotion]);
    useImperativeHandle(
      ref,
      () => ({
        skip: () => cancel.current(),
        async play(
          point,
          berlin,
          onStart,
          onReveal,
          variant = 0,
          closing = false,
        ) {
          if (busy.current) return false;
          const context = {
            transition: closing ? "door_close" : "door_open",
            day: variant,
            berlin,
          };
          if (reducedRef.current) {
            trackAdvent("transition_skipped", {
              ...context,
              reason: "reduced_motion",
            });
            return true;
          }
          busy.current = true;
          let renderer: FoldRenderer | undefined;
          let frame = 0;
          let captureTimer: ReturnType<typeof setTimeout> | undefined;
          let observer: ResizeObserver | undefined;
          let finish = (_value: boolean) => {};
          let cancelled = false,
            disposed = false,
            revealed = false;
          let stopSound: void | (() => void);
          let pageImage: HTMLCanvasElement | null = closing
            ? lastSnapshot.current
            : null;
          let panelImage: HTMLCanvasElement | null = null;
          const monitor = frameMonitor();
          const requested = performance.now();
          let start = requested;
          let outcome = "completed";
          let pixels = 650_000;
          cancel.current = () => {
            cancelled = true;
            outcome = mounted.current ? "skipped" : "unmounted";
            if (typeof stopSound === "function") stopSound();
            finish(mounted.current);
          };
          try {
            const width = innerWidth,
              height = innerHeight;
            const options = {
              x: point.x / width,
              y: point.y / height,
              aspect: width / height,
              berlin,
              variant,
              closing,
            };
            const dialogElement = closing
              ? document.querySelector<HTMLElement>(".adv-dialog")
              : null;
            const rect = dialogElement?.getBoundingClientRect();
            let cardWidth = rect?.width ?? 560,
              cardHeight = rect?.height ?? 600;
            const size = () => {
              const scale = canvasScale(width, height, pixels);
              renderer!.canvas.width = Math.round(width * scale);
              renderer!.canvas.height = Math.round(height * scale);
            };
            const attach = () => {
              const canvas = renderer!.canvas;
              canvas.dataset.foldExclude = "";
              canvas.dataset.pageFold = "";
              canvas.dataset.renderer = renderer!.kind;
              canvas.setAttribute("aria-hidden", "true");
              Object.assign(canvas.style, {
                position: "fixed",
                inset: "0",
                width: "100vw",
                height: "100dvh",
                zIndex: "100",
                pointerEvents: revealed && !closing ? "none" : "auto",
              });
              size();
              if (pageImage) renderer!.texture(pageImage);
              if (panelImage) renderer!.texture(panelImage, true);
              document.body.appendChild(canvas);
            };
            renderer = createFoldRenderer(options);
            attach();
            setActive(true);
            start = performance.now();
            stopSound = onStart();
            trackAdvent("transition_started", {
              ...context,
              renderer: renderer.kind,
              setup_ms: Math.round(start - requested),
              pixels: renderer.canvas.width * renderer.canvas.height,
            });

            // Capture enriches the live effect; it never gates animation or content.
            // Start after the first paint so the gesture gets immediate feedback.
            const capture = async () => {
              const watchdog = setTimeout(() => {
                if (!disposed)
                  logAdvent("capture.pending", {
                    ...context,
                    elapsed_ms: Math.round(performance.now() - start),
                  });
              }, 1800);
              try {
                const update = (image: HTMLCanvasElement, panel = false) => {
                  if (disposed || cancelled) return;
                  if (panel) panelImage = image;
                  else {
                    pageImage = image;
                    if (!closing) lastSnapshot.current = image;
                  }
                  const age =
                    (performance.now() - start) /
                    (getFoldSeconds(berlin, closing) * 1000);
                  // Late images are useful for the return, but must not pop into mid-flight.
                  if (age < (closing ? 0.18 : 0.25))
                    renderer?.texture(image, panel);
                  else
                    logAdvent("capture.late", {
                      ...context,
                      panel,
                      elapsed_ms: Math.round(performance.now() - start),
                    });
                };
                const tasks: Promise<unknown>[] = [];
                if (!pageImage)
                  tasks.push(
                    captureAdvent(
                      document.querySelector<HTMLElement>(".adv-page") ??
                        document.body,
                      {
                        width,
                        height,
                        pixelRatio: canvasScale(width, height, 650_000),
                        style: {
                          transform: `translateY(${-scrollY}px)`,
                          transformOrigin: "top left",
                          margin: "0",
                        },
                        filter: (node) =>
                          ![
                            "SCRIPT",
                            "STYLE",
                            "NEXTJS-PORTAL",
                            "IFRAME",
                          ].includes(node.tagName) &&
                          !node.hasAttribute?.("data-fold-exclude"),
                      },
                    ).then((image) => update(image)),
                  );
                if (dialogElement && rect)
                  tasks.push(
                    captureAdvent(dialogElement, {
                      width: rect.width,
                      height: rect.height,
                      pixelRatio: Math.min(1, 800 / rect.height),
                      style: {
                        position: "relative",
                        top: "0",
                        left: "0",
                        margin: "0",
                        transform: "none",
                        translate: "none",
                        scale: "1",
                        opacity: "1",
                        filter: "none",
                        animation: "none",
                      },
                    }).then((image) => update(image, true)),
                  );
                const results = await Promise.allSettled(tasks);
                for (const result of results)
                  if (result.status === "rejected") {
                    logAdvent("capture.failed", {
                      ...context,
                      error: String(result.reason).slice(0, 300),
                    });
                    if (!disposed) trackAdvent("capture_failed", context);
                  }
              } finally {
                clearTimeout(watchdog);
              }
            };
            const result = await new Promise<boolean>((resolve, reject) => {
              finish = resolve;
              let last = 0,
                measured: HTMLElement | null = null;
              observer = new ResizeObserver(([entry]) => {
                const box = entry.borderBoxSize[0];
                if (box?.inlineSize && box.blockSize) {
                  cardWidth = box.inlineSize;
                  cardHeight = box.blockSize;
                }
              });
              const draw = (now: number) => {
                try {
                  if (last && now - last < 1000 / 30 - 1) {
                    frame = requestAnimationFrame(draw);
                    return;
                  }
                  if (!last)
                    captureTimer = setTimeout(() => {
                      void capture().catch((error) =>
                        logAdvent("capture.failed", {
                          error: String(error).slice(0, 300),
                        }),
                      );
                    }, 0);
                  last = now;
                  if (monitor.frame(now) && pixels > 200_000) {
                    pixels = Math.max(200_000, pixels * 0.7);
                    size();
                    logAdvent("renderer.resolution_reduced", {
                      ...context,
                      pixels,
                    });
                  }
                  const elapsed = Math.min(
                    1,
                    (now - start) / (getFoldSeconds(berlin, closing) * 1000),
                  );
                  const t = closing ? 1 - elapsed : elapsed;
                  if (
                    (closing ? elapsed >= 0.1 : t >= FOLD_REVEAL) &&
                    !revealed
                  ) {
                    revealed = true;
                    onReveal();
                    logAdvent("transition.reveal", context);
                    if (!closing) renderer!.canvas.style.pointerEvents = "none";
                  }
                  const dialog =
                    document.querySelector<HTMLElement>(".adv-dialog");
                  if (!closing && dialog && dialog !== measured) {
                    observer!.disconnect();
                    observer!.observe(dialog);
                    measured = dialog;
                  }
                  const linear = Math.max(
                    0,
                    Math.min(1, (t - FOLD_REVEAL) / (1 - FOLD_REVEAL)),
                  );
                  if (dialog) {
                    dialog.dataset.arriving = "";
                    dialog.dataset.journey = closing
                      ? "closing"
                      : berlin
                        ? "berlin"
                        : "winter";
                    dialog.dataset.folded = "";
                    dialog.style.setProperty(
                      "--adv-arrival",
                      (closing
                        ? Math.max(0, 1 - elapsed / 0.1)
                        : linear * linear * (3 - 2 * linear)
                      ).toFixed(4),
                    );
                  }
                  if (
                    !renderer!.draw(t, cardWidth / height, cardHeight / height)
                  ) {
                    logAdvent("renderer.context_lost", context);
                    renderer!.canvas.remove();
                    renderer!.dispose();
                    renderer = createCanvasFold(options);
                    attach();
                    trackAdvent("renderer_fallback", {
                      ...context,
                      reason: "context_lost",
                      renderer: "canvas",
                    });
                    renderer.draw(t, cardWidth / height, cardHeight / height);
                  }
                  renderer!.canvas.dataset.progress = t.toFixed(2);
                  // Fade procedural material in instead of flashing a replacement page.
                  renderer!.canvas.style.opacity = String(
                    Math.min(1, elapsed / 0.08),
                  );
                  if (elapsed < 1 && !cancelled)
                    frame = requestAnimationFrame(draw);
                  else resolve(mounted.current);
                } catch (error) {
                  reject(error);
                }
              };
              frame = requestAnimationFrame(draw);
            });
            return result;
          } catch (error) {
            outcome = "failed";
            logAdvent("transition.failed", {
              ...context,
              error: String(error).slice(0, 300),
            });
            if (typeof stopSound === "function") stopSound();
            return mounted.current;
          } finally {
            disposed = true;
            clearTimeout(captureTimer);
            cancelAnimationFrame(frame);
            observer?.disconnect();
            trackAdvent("transition_finished", {
              ...context,
              outcome,
              renderer: renderer?.kind ?? "none",
              duration_ms: Math.round(performance.now() - start),
              ...monitor.summary(),
            });
            renderer?.canvas.remove();
            renderer?.dispose();
            const dialog = document.querySelector<HTMLElement>(".adv-dialog");
            if (dialog) {
              delete dialog.dataset.arriving;
              delete dialog.dataset.journey;
              dialog.style.removeProperty("--adv-arrival");
              if (!closing) dialog.focus({ preventScroll: true });
            }
            if (closing) lastSnapshot.current = null;
            busy.current = false;
            cancel.current = () => {};
            if (mounted.current) setActive(false);
          }
        },
      }),
      [],
    );
    useEffect(() => {
      if (!active) return;
      const skip = (event: KeyboardEvent) => {
        if (
          event.key === "Escape" &&
          !event.defaultPrevented &&
          !document.querySelector('.adv-dialog[data-state="open"]')
        ) {
          event.preventDefault();
          cancel.current();
        }
      };
      document.addEventListener("keydown", skip);
      return () => document.removeEventListener("keydown", skip);
    }, [active]);
    return active
      ? createPortal(
          <button
            type="button"
            data-fold-exclude
            className="adv-fold-skip"
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              cancel.current();
            }}
          >
            Skip effect
          </button>,
          document.body,
        )
      : null;
  },
);
