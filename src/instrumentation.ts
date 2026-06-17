import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const spanProcessors = [
  new LangfuseSpanProcessor({
    publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
    baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  }),
  new LangfuseSpanProcessor({
    publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.US_LANGFUSE_SECRET_KEY,
    baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
  }),
  new LangfuseSpanProcessor({
    publicKey: process.env.NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.JP_LANGFUSE_SECRET_KEY,
    baseUrl: process.env.NEXT_PUBLIC_JP_LANGFUSE_BASE_URL,
  }),
  new LangfuseSpanProcessor({
    publicKey: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.INTERNAL_LANGFUSE_SECRET_KEY,
    baseUrl: process.env.NEXT_PUBLIC_INTERNAL_LANGFUSE_BASE_URL,
  }),
];

export const flush = async () =>
  Promise.all(spanProcessors.map((p) => p.forceFlush()));

const tracerProvider = new NodeTracerProvider({
  spanProcessors,
});

tracerProvider.register();
