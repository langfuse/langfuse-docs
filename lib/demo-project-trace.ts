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
  output?: unknown;
  userId?: string;
  sessionId?: string;
  tags?: string[];
};

const DEMO_TRACE_READINESS_TIMEOUT_MS = 10_000;
const DEMO_TRACE_READINESS_POLL_INTERVAL_MS = 500;

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

  return { traceId };
};

export const publishPublicDemoTraceLink = async ({
  traceId = getActiveTraceId(),
  name,
  input,
  output,
  userId,
  sessionId,
  tags,
}: PublicDemoTraceParams): Promise<DemoTraceLink> => {
  if (!traceId) {
    return {};
  }

  try {
    if (input !== undefined || output !== undefined) {
      await createPublicDemoTraceEvent({
        traceId,
        name,
        input,
        output,
        userId,
        sessionId,
        tags,
      });
    }

    await waitForPublicDemoTrace({
      traceId,
      requireOutput: output !== undefined,
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
  output,
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
          ...(output !== undefined && { output }),
          ...(userId && { userId }),
          ...(sessionId && { sessionId }),
          ...(tags && { tags }),
        },
      },
    ],
  });
};

const waitForPublicDemoTrace = async ({
  traceId,
  requireOutput,
}: {
  traceId: string;
  requireOutput: boolean;
}) => {
  const deadline = Date.now() + DEMO_TRACE_READINESS_TIMEOUT_MS;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const trace = await demoProjectLangfuseClient.api.trace.get(traceId, {
        fields: "core,io,observations",
      });
      const hasObservations =
        Array.isArray(trace.observations) && trace.observations.length > 0;
      const hasOutput = !requireOutput || trace.output !== undefined;

      if (trace.public && hasObservations && hasOutput) {
        return;
      }
    } catch (err) {
      lastError = err;
    }

    await wait(DEMO_TRACE_READINESS_POLL_INTERVAL_MS);
  }

  throw new Error(
    `Timed out waiting for public Langfuse trace ${traceId} to be ready`,
    { cause: lastError },
  );
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
