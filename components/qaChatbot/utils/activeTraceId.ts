import { context, trace } from "@opentelemetry/api";

export function getActiveTraceId() {
  const span = trace.getSpan(context.active());
  const traceId = span?.spanContext().traceId ?? null;
  console.log("traceId", traceId);
  return traceId;
}
