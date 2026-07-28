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
}: PublicDemoTraceParams): Promise<DemoTraceLink> => {
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
