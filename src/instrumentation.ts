import { registerTelemetry } from "ai";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import {
  NodeTracerProvider,
  type Span,
  type SpanProcessor,
} from "@opentelemetry/sdk-trace-node";

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

/**
 * The AI SDK's OpenTelemetry integration names spans after the OTel GenAI
 * semantic conventions: `invoke_agent gpt-5`, `chat gpt-5`, `step 1`, ...
 * Model names and step counters in observation names break Langfuse filters,
 * dashboards, and evaluators as soon as a model is swapped, so rename them to
 * stable, low-cardinality names before the Langfuse processors export them.
 * The model stays available as a separate attribute on the generation.
 */
class AiSdkObservationNameProcessor implements SpanProcessor {
  onStart(span: Span): void {
    const { attributes } = span;
    const operation = attributes["gen_ai.operation.name"];
    if (typeof operation !== "string") return;

    const model = attributes["gen_ai.request.model"];
    const functionId = attributes["gen_ai.agent.name"];

    switch (operation) {
      case "invoke_agent":
        // Outer streamText / generateText span: use the functionId passed via
        // `telemetry: { functionId }`, which describes the step in the app.
        span.updateName(
          typeof functionId === "string" && functionId.length > 0
            ? functionId
            : "invoke-agent",
        );
        break;
      case "chat":
      case "embeddings":
      case "rerank":
        // `chat <model>` -> `chat`
        if (
          typeof model === "string" &&
          span.name === `${operation} ${model}`
        ) {
          span.updateName(operation);
        }
        break;
      case "agent_step":
        // `step 3` -> `step`; the order is visible from the timeline.
        if (/^step \d+$/.test(span.name)) span.updateName("step");
        break;
      default:
        break;
    }
  }

  onEnd(): void {}

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}

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
  // The renaming processor must run before the exporters see the span.
  spanProcessors: [new AiSdkObservationNameProcessor(), ...spanProcessors],
});

tracerProvider.register();

registerTelemetry(new LangfuseVercelAiSdkIntegration());
