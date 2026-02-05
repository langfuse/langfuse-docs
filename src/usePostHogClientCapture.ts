import { type CaptureResult, type CaptureOptions } from "posthog-js";
import { usePostHog } from "posthog-js/react";

// Event definitions: maps event names to their required properties
// This preserves existing PostHog event structure while adding type safety
interface EventDefinitions {
  copy_page: { type: "copy" | "chatgpt" | "claude" | "mcp" };
}

type EventName = keyof EventDefinitions;

export const usePostHogClientCapture = () => {
  const posthog = usePostHog();

  // Type-safe wrapper that enforces correct event names and properties
  function capture<E extends EventName>(
    eventName: E,
    properties: EventDefinitions[E],
    options?: CaptureOptions
  ): CaptureResult | void {
    return posthog.capture(eventName, properties, options);
  }

  return capture;
};
