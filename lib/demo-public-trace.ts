import { LangfuseClient } from "@langfuse/client";

export const demoProjectLangfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});

export const DEMO_PUBLIC_TRACE_FALLBACK_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces/c6dd4487746b4e155f9395da828a2752?observation=300576dc5b33a15e&timestamp=2026-07-27T09:30:37.092Z&traceId=c6dd4487746b4e155f9395da828a2752";

const READINESS_POLL_DELAYS_MS = [0, 250, 500, 1_000] as const;

const wait = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

export const getPublicDemoTraceUrl = async (
  traceId?: string | null,
): Promise<string> => {
  if (!traceId) return DEMO_PUBLIC_TRACE_FALLBACK_URL;

  let traceUrl: string;
  try {
    traceUrl = await demoProjectLangfuseClient.getTraceUrl(traceId);
  } catch (error) {
    console.warn("Failed to build demo trace URL", error);
    return DEMO_PUBLIC_TRACE_FALLBACK_URL;
  }

  for (const delayMs of READINESS_POLL_DELAYS_MS) {
    if (delayMs > 0) {
      await wait(delayMs);
    }

    try {
      await demoProjectLangfuseClient.api.trace.get(traceId, {
        fields: "core",
      });
      return traceUrl;
    } catch {
      // Continue briefly; ingestion can lag behind forceFlush.
    }
  }

  return DEMO_PUBLIC_TRACE_FALLBACK_URL;
};
