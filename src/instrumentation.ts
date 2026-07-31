import { registerTelemetry } from "ai";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const euSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
});

const usSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.US_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
});

const jpSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.JP_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
});

const internalSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.INTERNAL_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_BASE_URL,
});

const spanProcessors = [
  euSpanProcessor,
  usSpanProcessor,
  jpSpanProcessor,
  internalSpanProcessor,
];

export const flush = async () =>
  Promise.all(spanProcessors.map((p) => p.forceFlush()));

const tracerProvider = new NodeTracerProvider({
  spanProcessors,
});

tracerProvider.register();

registerTelemetry(new LangfuseVercelAiSdkIntegration());
