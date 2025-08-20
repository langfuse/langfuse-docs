import { trace, context, propagation } from "@opentelemetry/api";
import {
  BasicTracerProvider,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { LangfuseSpanProcessor, ShouldExportSpan } from "@langfuse/otel";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { W3CTraceContextPropagator } from "@opentelemetry/core";

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

export const spanProcessors: SpanProcessor[] = [
  euSpanProcessor,
  usSpanProcessor,
];

export function register() {
  const traceProvider = new BasicTracerProvider({ spanProcessors });

  trace.setGlobalTracerProvider(traceProvider);

  const contextManager = new AsyncLocalStorageContextManager();
  contextManager.enable();
  context.setGlobalContextManager(contextManager);

  propagation.setGlobalPropagator(new W3CTraceContextPropagator());
}
