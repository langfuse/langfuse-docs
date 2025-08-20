import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

const euSpanProcessor = new LangfuseSpanProcessor({
  // uses default credentials
  shouldExportSpan,
});

const usSpanProcessor = new LangfuseSpanProcessor({
  publicKey: process.env["US_LANGFUSE_PUBLIC_KEY"],
  secretKey: process.env["US_LANGFUSE_SECRET_KEY"],
  baseUrl: process.env["US_LANGFUSE_BASE_URL"],
  shouldExportSpan,
});

export function register() {
  const traceProvider = new NodeTracerProvider({
    spanProcessors: [euSpanProcessor, usSpanProcessor],
  });

  traceProvider.register();
}
