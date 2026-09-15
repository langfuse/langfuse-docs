import { registerTelemetry } from "ai";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { trace } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { createGenAiSpanRenamingTracer } from "./rename-gen-ai-spans";

const realtimeIngestionHeaders = {
  "x-langfuse-ingestion-version": "4",
};

const euSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  additionalHeaders: realtimeIngestionHeaders,
});

const usSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.US_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
  additionalHeaders: realtimeIngestionHeaders,
});

const jpSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.JP_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
  additionalHeaders: realtimeIngestionHeaders,
});

const internalSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.INTERNAL_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_BASE_URL,
  additionalHeaders: realtimeIngestionHeaders,
});

const spanProcessors = [
  euSpanProcessor,
  usSpanProcessor,
  jpSpanProcessor,
  internalSpanProcessor,
];

export const flush = async () => {
  const results = await Promise.allSettled(
    spanProcessors.map((p) => p.forceFlush()),
  );

  if (results.some((result) => result.status === "rejected")) {
    console.warn("Failed to flush one or more Langfuse span processors");
  }
};

const tracerProvider = new NodeTracerProvider({
  spanProcessors,
});

tracerProvider.register();

registerTelemetry(
  new LangfuseVercelAiSdkIntegration({
    tracer: createGenAiSpanRenamingTracer(trace.getTracer("gen_ai")),
  }),
);
