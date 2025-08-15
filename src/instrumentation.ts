import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

export function register() {
const traceProvider = new NodeTracerProvider({
  spanProcessors: [new LangfuseSpanProcessor()]
})

traceProvider.register()
}
