import { LangfuseClient } from "@langfuse/client";
import { getActiveTraceId, setActiveTraceAsPublic } from "@langfuse/tracing";

export type DemoTraceLink = {
  traceId?: string;
  traceUrl?: string;
};

type PublicDemoTraceParams = {
  traceId?: string;
  name: string;
  input?: unknown;
  userId?: string;
  sessionId?: string;
  tags?: string[];
};

type PublishPublicDemoTraceParams = PublicDemoTraceParams & {
  readbackAttempts?: number;
  readbackDelayMs?: number;
};

type PublishableTrace = {
  traceId?: string;
  setTraceAsPublic: () => unknown;
};

export const demoProjectLangfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});

export const createDemoTraceLink = async (
  traceId = getActiveTraceId(),
): Promise<DemoTraceLink> => {
  if (!traceId) {
    return {};
  }

  try {
    return {
      traceId,
      traceUrl: await demoProjectLangfuseClient.getTraceUrl(traceId),
    };
  } catch (err) {
    console.warn("Failed to resolve public Langfuse trace URL", err);
    return { traceId };
  }
};

export const createPublicDemoTraceLink = async ({
  traceId = getActiveTraceId(),
  name,
  input,
  userId,
  sessionId,
  tags,
}: PublicDemoTraceParams): Promise<DemoTraceLink> => {
  if (!traceId) {
    return {};
  }

  try {
    await createPublicDemoTraceEvent({
      traceId,
      name,
      input,
      userId,
      sessionId,
      tags,
    });
  } catch (err) {
    console.warn("Failed to create public Langfuse trace", err);
    return { traceId };
  }

  return createDemoTraceLink(traceId);
};

export const publishPublicDemoTraceLink = async ({
  traceId = getActiveTraceId(),
  name,
  userId,
  sessionId,
  tags,
  readbackAttempts = 9,
  readbackDelayMs = 3000,
}: PublishPublicDemoTraceParams): Promise<DemoTraceLink> => {
  if (!traceId) {
    return {};
  }

  try {
    await createPublicDemoTraceEvent({
      traceId,
      name,
      userId,
      sessionId,
      tags,
    });

    const isPublic = await waitForPublicTrace({
      traceId,
      attempts: readbackAttempts,
      delayMs: readbackDelayMs,
    });

    if (!isPublic) {
      return { traceId };
    }

    return createDemoTraceLink(traceId);
  } catch (err) {
    console.warn("Failed to publish public Langfuse trace", err);
    return { traceId };
  }
};

export const makeDemoTracePublic = (trace?: PublishableTrace) => {
  if (trace) {
    trace.setTraceAsPublic();
  }

  setActiveTraceAsPublic();
};

const createPublicDemoTraceEvent = async ({
  traceId,
  name,
  input,
  userId,
  sessionId,
  tags,
}: PublicDemoTraceParams & { traceId: string }) => {
  const timestamp = new Date().toISOString();

  await demoProjectLangfuseClient.api.ingestion.batch({
    batch: [
      {
        id: crypto.randomUUID(),
        type: "trace-create",
        timestamp,
        body: {
          id: traceId,
          timestamp,
          name,
          public: true,
          ...(input !== undefined && { input }),
          ...(userId && { userId }),
          ...(sessionId && { sessionId }),
          ...(tags && { tags }),
        },
      },
    ],
  });
};

const waitForPublicTrace = async ({
  traceId,
  attempts,
  delayMs,
}: {
  traceId: string;
  attempts: number;
  delayMs: number;
}) => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await demoProjectLangfuseClient.api.trace.get(traceId);
      const trace =
        typeof response === "object" && response !== null && "data" in response
          ? response.data
          : response;

      if (isPublicTrace(trace)) {
        return true;
      }
    } catch {
      // Trace ingestion is eventually consistent; retry below.
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
};

const isPublicTrace = (trace: unknown): trace is { public: true } =>
  typeof trace === "object" &&
  trace !== null &&
  "public" in trace &&
  trace.public === true;
