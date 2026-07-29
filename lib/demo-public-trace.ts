import { LangfuseClient } from "@langfuse/client";

export const demoProjectLangfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});

export const DEMO_PUBLIC_TRACE_FALLBACK_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces/da6ce560ef05a1cf2215722e130d1dbc?observation=23d18c604943f460";

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
      const observations =
        await demoProjectLangfuseClient.api.observations.getMany({
          traceId,
          fields: "core,basic",
          limit: 100,
        });

      if (observations.data.some((observation) => observation.public)) {
        return traceUrl;
      }
    } catch {
      // Continue briefly; ingestion and public trace sharing can lag behind forceFlush.
    }
  }

  return DEMO_PUBLIC_TRACE_FALLBACK_URL;
};
