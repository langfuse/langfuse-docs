import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

const euSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
  shouldExportSpan,
  exportMode: "immediate",
});

const usSpanProcessor = new LangfuseSpanProcessor({
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.US_LANGFUSE_SECRET_KEY,
  shouldExportSpan,
  exportMode: "immediate",
});

export const spanProcessors = [euSpanProcessor, usSpanProcessor];

const tracerProvider = new NodeTracerProvider({
  spanProcessors,
});

tracerProvider.register();
