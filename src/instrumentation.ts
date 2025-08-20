import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

const euSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
  shouldExportSpan,
});

const usSpanProcessor = new LangfuseSpanProcessor({
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.US_LANGFUSE_SECRET_KEY,
  shouldExportSpan,
});

export function register() {
  const traceProvider = new NodeTracerProvider({
    spanProcessors: [euSpanProcessor, usSpanProcessor],
  });

  traceProvider.register();
}
