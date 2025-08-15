import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  serviceName: "langfuse-docs",
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();
