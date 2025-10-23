import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

const euSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  shouldExportSpan,
});

const usSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.US_LANGFUSE_SECRET_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
  shouldExportSpan,
});

const spanProcessors = [euSpanProcessor, usSpanProcessor];

export const flush = async () =>
  Promise.all(spanProcessors.map((p) => p.forceFlush()));

const tracerProvider = new NodeTracerProvider({
  spanProcessors,
});

tracerProvider.register();
