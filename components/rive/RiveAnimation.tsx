"use client";

import { useEffect, useRef, useState } from "react";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  EventType,
  StateMachineInputType,
} from "@rive-app/react-webgl2";
import type { Event, EventCallback, Rive } from "@rive-app/react-webgl2";

type FitOption = "contain" | "cover" | "fill" | "fitWidth" | "fitHeight" | "none" | "scaleDown";

type RiveAnimationProps = {
  src: string;
  /** Artboard name from the Rive file. Defaults to the file's default artboard. */
  artboard?: string;
  /** One or more state machine names, or `"auto"` to use the first available one. */
  stateMachine?: string | string[] | "auto";
  animation?: string;
  fit?: FitOption;
  className?: string;
  /** Visual zoom factor (1 = default, >1 zoom in). */
  zoom?: number;
  autoplay?: boolean;
  /** Called with the list of currently-active state names on every state machine transition. */
  onStateChange?: (states: string[]) => void;
  /**
   * Boolean state machine inputs to sync from React.
   * Prefer a stable object (e.g. `useMemo`) so this does not re-run every parent render.
   * When `stateMachine` is an array, set `stateMachineBooleanInputsOn` to the SM that owns these inputs.
   */
  stateMachineBooleanInputs?: Record<string, boolean>;
  /**
   * State machine name passed to `rive.stateMachineInputs(...)` for `stateMachineBooleanInputs`.
   * Defaults to `stateMachine` when it is a single string; required when inputs live on a different SM than you want to default.
   */
  stateMachineBooleanInputsOn?: string;
  /**
   * View Model boolean paths (slash-separated, e.g. `NestedVm/isLoad`) on `rive.viewModelInstance`.
   * Use this when the Rive editor shows the control under a View Model rather than State Machine inputs.
   */
  viewModelBooleanInputs?: Record<string, boolean>;
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
  stateMachineBooleanInputs,
  stateMachineBooleanInputsOn,
  viewModelBooleanInputs,
}: RiveAnimationProps & { onLoaded?: (smNames: string[]) => void }) {
  const stateMachinesList =
    !stateMachine || stateMachine === "auto"
      ? undefined
      : Array.isArray(stateMachine)
        ? stateMachine
        : [stateMachine];

  const { RiveComponent, rive } = useRive(
    {
      src,
      artboard,
      stateMachines: stateMachinesList,
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

  useEffect(() => {
    if (!rive || !stateMachineBooleanInputs) return;
    const smForInputs =
      stateMachineBooleanInputsOn ??
      (typeof stateMachine === "string" ? stateMachine : undefined);
    if (!smForInputs) return;
    const inputs = rive.stateMachineInputs(smForInputs);
    for (const [name, value] of Object.entries(stateMachineBooleanInputs)) {
      const input = inputs.find((i) => i.name === name);
      if (input?.type === StateMachineInputType.Boolean) {
        input.value = value;
      }
    }
  }, [rive, stateMachine, stateMachineBooleanInputs, stateMachineBooleanInputsOn]);

  useEffect(() => {
    if (!rive || !viewModelBooleanInputs) return;
    const vmi = rive.viewModelInstance;
    if (!vmi) return;
    for (const [path, value] of Object.entries(viewModelBooleanInputs)) {
      const prop = vmi.boolean(path);
      if (prop) prop.value = value;
    }
  }, [rive, viewModelBooleanInputs]);

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

export function RiveAnimation({
  stateMachine,
  stateMachineBooleanInputs,
  stateMachineBooleanInputsOn,
  viewModelBooleanInputs,
  ...props
}: RiveAnimationProps) {
  // null = not yet discovered, "" = no state machines in file
  const [autoSM, setAutoSM] = useState<string | null>(null);

  if (stateMachine === "auto") {
    if (autoSM !== null) {
      // Phase 2: render with discovered name (or no SM if file has none)
      return (
        <RiveInstance
          {...props}
          stateMachine={autoSM || undefined}
          stateMachineBooleanInputs={stateMachineBooleanInputs}
          stateMachineBooleanInputsOn={stateMachineBooleanInputsOn}
          viewModelBooleanInputs={viewModelBooleanInputs}
        />
      );
    }
    // Phase 1: load without SM to discover available names, then re-render
    return (
      <RiveInstance
        {...props}
        stateMachine={undefined}
        stateMachineBooleanInputs={stateMachineBooleanInputs}
        stateMachineBooleanInputsOn={stateMachineBooleanInputsOn}
        viewModelBooleanInputs={viewModelBooleanInputs}
        onLoaded={(names) => setAutoSM(names[0] ?? "")}
      />
    );
  }

  return (
    <RiveInstance
      {...props}
      stateMachine={stateMachine}
      stateMachineBooleanInputs={stateMachineBooleanInputs}
      stateMachineBooleanInputsOn={stateMachineBooleanInputsOn}
      viewModelBooleanInputs={viewModelBooleanInputs}
    />
  );
}
