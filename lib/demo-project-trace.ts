import { LangfuseClient } from "@langfuse/client";
import { getActiveTraceId, setActiveTraceAsPublic } from "@langfuse/tracing";

export type DemoTraceLink = {
  traceId?: string;
  traceUrl?: string;
};

type PublicDemoTraceParams = {
  traceId?: string;
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
}: PublicDemoTraceParams): Promise<DemoTraceLink> => {
  return createDemoTraceLink(traceId);
};

export const publishPublicDemoTraceLink = async ({
  traceId = getActiveTraceId(),
}: PublicDemoTraceParams): Promise<DemoTraceLink> => {
  return createDemoTraceLink(traceId);
};

export const makeDemoTracePublic = (trace?: PublishableTrace) => {
  if (trace) {
    trace.setTraceAsPublic();
  }

  setActiveTraceAsPublic();
};
