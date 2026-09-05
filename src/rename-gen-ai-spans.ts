import type { Context, Span, SpanOptions, Tracer } from "@opentelemetry/api";

/**
 * AI SDK GenAI OTel names spans as `<operation> <modelId>` (e.g. `invoke_agent gpt-5`,
 * `chat gpt-5`). Keep observation names model-agnostic so evaluators/dashboards stay
 * stable when the model changes — the model is already a separate generation attribute.
 */
export function renameGenAiSpan(name: string): string {
  if (name.startsWith("invoke_agent ")) {
    return "invoke agent";
  }
  if (name.startsWith("chat ")) {
    return "chat completion";
  }
  return name;
}

export function createGenAiSpanRenamingTracer(delegate: Tracer): Tracer {
  return {
    startSpan(name: string, options?: SpanOptions, context?: Context): Span {
      return delegate.startSpan(renameGenAiSpan(name), options, context);
    },
    startActiveSpan(name: string, ...args: unknown[]) {
      return (
        delegate.startActiveSpan as (
          name: string,
          ...rest: unknown[]
        ) => unknown
      )(renameGenAiSpan(name), ...args);
    },
  } as Tracer;
}
