import { LangfuseClient } from "@langfuse/client";

export const demoProjectLangfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});

/** Region-aware path into the shared Langfuse Cloud demo project. */
export const DEMO_PROJECT_PATH = "/cloud/demo";

/** Traces list in the shared demo project. */
export const DEMO_TRACES_PATH = `${DEMO_PROJECT_PATH}/traces`;

export type DemoTraceSource =
  | "qa_chatbot"
  | "image_generator"
  | "voice_agent"
  | "rock_paper_scissors"
  | "sentiment_classifier";

/**
 * Build a link to a specific demo-project trace.
 * Goes through `/cloud` so the reader can pick a region, then lands on
 * `/demo/traces/{traceId}` in Langfuse Cloud.
 */
export const buildDemoTraceUrl = ({
  traceId,
  observationId,
}: {
  traceId?: string | null;
  observationId?: string | null;
} = {}) => {
  if (!traceId) {
    return DEMO_TRACES_PATH;
  }

  const path = `${DEMO_TRACES_PATH}/${traceId}`;
  if (!observationId) {
    return path;
  }

  const params = new URLSearchParams({ observation: observationId });
  return `${path}?${params.toString()}`;
};
