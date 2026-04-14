"use client";

import { useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit, Alignment, EventType } from "@rive-app/react-webgl2";
import type { Event, EventCallback, Rive } from "@rive-app/react-webgl2";

type FitOption = "contain" | "cover" | "fill" | "fitWidth" | "fitHeight" | "none" | "scaleDown";

type RiveAnimationProps = {
  src: string;
  /** Artboard name from the Rive file. Defaults to the file's default artboard. */
  artboard?: string;
  /** Exact state machine name, or `"auto"` to use the first available one. */
  stateMachine?: string | "auto";
  animation?: string;
  fit?: FitOption;
  className?: string;
  /** Visual zoom factor (1 = default, >1 zoom in). */
  zoom?: number;
  autoplay?: boolean;
  /** Called with the list of currently-active state names on every state machine transition. */
  onStateChange?: (states: string[]) => void;
};

const FIT_MAP: Record<FitOption, Fit> = {
  contain: Fit.Contain,
  cover: Fit.Cover,
  fill: Fit.Fill,
  fitWidth: Fit.FitWidth,
  fitHeight: Fit.FitHeight,
  none: Fit.None,
  scaleDown: Fit.ScaleDown,
};

// ── Internal component with a fixed, known config ─────────────────────────────

function RiveInstance({
  src,
  artboard,
  stateMachine,
  animation,
  fit = "contain",
  className,
  zoom = 1,
  autoplay = true,
  onLoaded,
  onStateChange,
}: RiveAnimationProps & { onLoaded?: (smNames: string[]) => void }) {
  const { RiveComponent, rive } = useRive(
    {
      src,
      artboard,
      stateMachines: stateMachine ? [stateMachine] : undefined,
      animations: animation ? [animation] : undefined,
      automaticallyHandleEvents: true,
      layout: new Layout({
        fit: FIT_MAP[fit as FitOption],
        alignment: Alignment.Center,
      }),
      autoplay,
      autoBind: true,
      /**
       * Pointer/hover only work after `setupRiveListeners` runs with at least one
       * playing state machine that `runtime.hasListeners` recognizes. Re-run after
       * layout/resize so hit-testing matches the canvas (see Rive web runtime).
       */
      onRiveReady: (instance: Rive) => {
        instance.resizeToCanvas();
        instance.setupRiveListeners();
      },
    },
    {
      shouldResizeCanvasToContainer: true,
      /** Crisp rendering on retina / high-DPI displays (runtime caps DPR at 3). */
      useDevicePixelRatio: true,
      /** Avoid pausing the renderer when scrolled; can interfere with input in some layouts. */
      shouldUseIntersectionObserver: false,
      /** Offscreen GL can occasionally desync hit-testing; disable for interactive scenes. */
      useOffscreenRenderer: false,
    }
  );

  useEffect(() => {
    if (!rive) return;
    if (process.env.NODE_ENV === "development") {
      // Diagnose why canvas listeners may be missing (internal runtime API).
      const internal = rive as unknown as {
        runtime?: { hasListeners?: (sm: unknown) => boolean };
        animator?: { stateMachines?: Array<{ name: string; playing: boolean; instance: unknown }> };
      };
      const sms = internal.animator?.stateMachines ?? [];
      for (const sm of sms) {
        const hl = internal.runtime?.hasListeners?.(sm.instance);
      }
    }
    onLoaded?.(rive.stateMachineNames ?? []);
  }, [rive, onLoaded]);

  useEffect(() => {
    if (!rive) return;
    rive.resizeToCanvas();
    rive.setupRiveListeners();
  }, [rive, fit]);

  // Use a ref to avoid re-subscribing the Rive listener on every parent render.
  const onStateChangeRef = useRef(onStateChange);
  useEffect(() => { onStateChangeRef.current = onStateChange; });

  useEffect(() => {
    if (!rive) return;
    const handler: EventCallback = (e: Event) => {
      const states = e.data;
      if (Array.isArray(states)) {
        onStateChangeRef.current?.(states as string[]);
      }
    };
    rive.on(EventType.StateChange, handler);
    return () => { rive.off(EventType.StateChange, handler); };
  }, [rive]);

  return (
    <div
      className="overflow-hidden w-full h-full will-change-transform"
      style={{
        transform: `translateZ(0) scale(${zoom})`,
        transformOrigin: "center center",
      }}
    >
      <RiveComponent
        className={className}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      />
    </div>
  );
}

// ── Public component — handles "auto" state machine detection ─────────────────

export function RiveAnimation({ stateMachine, ...props }: RiveAnimationProps) {
  // null = not yet discovered, "" = no state machines in file
  const [autoSM, setAutoSM] = useState<string | null>(null);

  if (stateMachine === "auto") {
    if (autoSM !== null) {
      // Phase 2: render with discovered name (or no SM if file has none)
      return <RiveInstance {...props} stateMachine={autoSM || undefined} />;
    }
    // Phase 1: load without SM to discover available names, then re-render
    return (
      <RiveInstance
        {...props}
        stateMachine={undefined}
        onLoaded={(names) => setAutoSM(names[0] ?? "")}
      />
    );
  }

  return <RiveInstance {...props} stateMachine={stateMachine} />;
}
