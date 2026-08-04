import { LangfuseClient } from "@langfuse/client";

export const demoProjectLangfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});

export const DEMO_PUBLIC_IMAGE_GENERATION_TRACE_FALLBACK_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces/065031c8732a2ee49a4631de846a0eda?observation=d7e0df7ae717629e";

const READINESS_POLL_DELAYS_MS = [0, 500, 1_000, 2_000, 4_000] as const;

const wait = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs));

const withObservationId = (traceUrl: string, observationId: string) => {
  const url = new URL(traceUrl);
  url.searchParams.set("observation", observationId);
  return url.toString();
};

export const buildDemoTraceRedirectUrl = ({
  traceId,
  observationId,
}: {
  traceId?: string | null;
  observationId?: string | null;
}) => {
  if (!traceId || !observationId) {
    return DEMO_PUBLIC_IMAGE_GENERATION_TRACE_FALLBACK_URL;
  }

  const params = new URLSearchParams({
    traceId,
    observationId,
  });

  return `/api/demo-public-trace?${params.toString()}`;
};

export const getPublicDemoTraceUrl = async (
  traceId?: string | null,
  fallbackUrl = DEMO_PUBLIC_IMAGE_GENERATION_TRACE_FALLBACK_URL,
  observationId?: string | null,
): Promise<string> => {
  if (!traceId) return fallbackUrl;

  let traceUrl: string;
  try {
    traceUrl = await demoProjectLangfuseClient.getTraceUrl(traceId);
  } catch (error) {
    console.warn("Failed to build demo trace URL", error);
    return fallbackUrl;
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

      const publicObservation = observations.data.find(
        (observation) =>
          observation.public &&
          (!observationId || observation.id === observationId),
      );

      if (publicObservation) {
        return withObservationId(traceUrl, publicObservation.id);
      }
    } catch {
      // Continue briefly; ingestion and public trace sharing can lag behind forceFlush.
    }
  }

  return fallbackUrl;
};
