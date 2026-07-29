import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
  stepCountIs,
} from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  observe,
  propagateAttributes,
  startActiveObservation,
  updateActiveObservation,
  setActiveTraceAsPublic,
  getActiveTraceId,
} from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { flush } from "@/src/instrumentation";
import { context, trace } from "@opentelemetry/api";
import {
  buildDemoTraceRedirectUrl,
  DEMO_PUBLIC_TRACE_FALLBACK_URL,
  demoProjectLangfuseClient,
} from "@/lib/demo-public-trace";

const tracedGetPrompt = observe(
  demoProjectLangfuseClient.prompt.get.bind(demoProjectLangfuseClient.prompt),
  { name: "get-langfuse-prompt" },
);

export const handler = async (req: Request) => {
  const {
    messages,
    chatId,
    userId,
  }: { messages: UIMessage[]; chatId: string; userId: string } =
    await req.json();

  const inputText = messages[messages.length - 1].parts.find(
    (part) => part.type === "text",
  )?.text;

  return propagateAttributes(
    {
      traceName: "QA-Chatbot",
      tags: ["qa-chatbot"],
      sessionId: chatId,
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      const activeSpan = trace.getActiveSpan();
      const runWithActiveSpan = <T>(fn: () => T) =>
        activeSpan
          ? context.with(trace.setSpan(context.active(), activeSpan), fn)
          : fn();

      runWithActiveSpan(() => {
        updateActiveObservation({ input: inputText }, { asType: "generation" });
      });

      const prompt = await tracedGetPrompt("langfuse-docs-assistant-chat", {
        type: "chat",
      });

      const reasoningSummary = prompt.config.reasoningSummary as
        | "low"
        | "medium"
        | "high"
        | undefined;
      const textVerbosity = prompt.config.textVerbosity as
        | "low"
        | "medium"
        | "high"
        | undefined;
      const reasoningEffort = prompt.config.reasoningEffort as
        | "low"
        | "medium"
        | "high"
        | undefined;

      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(""),
      }));

      const compiledPrompt = prompt.compile({}, { chat_history: chatHistory });
      const systemPrompt = compiledPrompt
        .filter((message) => message.role === "system")
        .map((message) => message.content)
        .join("\n\n");
      const modelMessages = compiledPrompt.filter(
        (message) => message.role !== "system",
      );

      const mcpClient = await startActiveObservation(
        "create-mcp-client",
        async () => {
          const mcpUrl = new URL("https://langfuse.com/api/mcp", req.url);

          return createMCPClient({
            transport: new StreamableHTTPClientTransport(mcpUrl, {
              sessionId: `qa-chatbot-${crypto.randomUUID()}`,
            }),
          });
        },
      );

      const tools = await mcpClient.tools();
      let publishedTraceUrl: string | undefined;
      let assistantText = "";
      let currentText = "";
      let isTraceFinalized = false;
      let isMcpClientClosed = false;

      const closeMcpClient = async () => {
        if (isMcpClientClosed) return;
        isMcpClientClosed = true;
        await mcpClient.close();
      };

      const finalizeTrace = async (publishTrace: boolean) => {
        if (isTraceFinalized) return;
        isTraceFinalized = true;

        runWithActiveSpan(() => {
          updateActiveObservation(
            { output: assistantText || currentText },
            { asType: "generation" },
          );
          if (publishTrace) {
            setActiveTraceAsPublic();
          }
          activeSpan?.end();
        });

        try {
          await flush();
          if (publishTrace) {
            publishedTraceUrl = buildDemoTraceRedirectUrl({
              traceId,
              observationId: activeSpan?.spanContext().spanId,
            });
          }
        } catch (error) {
          console.warn(
            publishTrace
              ? "Failed to publish demo trace link"
              : "Failed to flush demo trace",
            error,
          );
          if (publishTrace) {
            publishedTraceUrl = DEMO_PUBLIC_TRACE_FALLBACK_URL;
          }
        }
      };

      const result = streamText({
        model: openai(String(prompt.config.model)),
        providerOptions: {
          openai: {
            reasoningSummary,
            textVerbosity,
            reasoningEffort,
          } satisfies OpenAIResponsesProviderOptions,
        },
        instructions: systemPrompt || undefined,
        messages: modelMessages,
        tools: tools as Parameters<typeof streamText>[0]["tools"],
        stopWhen: stepCountIs(10),
        runtimeContext: {
          langfusePrompt: prompt,
        },
        telemetry: {
          functionId: "qa-chatbot",
          includeRuntimeContext: {
            langfusePrompt: true,
          },
        },
      });

      const uiMessageStream = toUIMessageStream({
        stream: result.stream,
        generateMessageId: () => traceId ?? crypto.randomUUID(),
        sendSources: true,
        sendReasoning: true,
      });

      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          async execute({ writer }) {
            const reader = uiMessageStream.getReader();
            let streamCompleted = false;

            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (value.type === "text-start") {
                  currentText = "";
                }

                if (value.type === "text-delta") {
                  currentText += value.delta;
                }

                if (value.type === "text-end") {
                  if (currentText) {
                    assistantText = currentText;
                  }
                  currentText = "";
                }

                writer.write(value);
              }

              streamCompleted = true;
            } finally {
              await finalizeTrace(streamCompleted);
              try {
                if (streamCompleted) {
                  writer.write({
                    type: "message-metadata",
                    messageMetadata: {
                      traceUrl:
                        publishedTraceUrl ?? DEMO_PUBLIC_TRACE_FALLBACK_URL,
                    },
                  });
                }
              } finally {
                reader.releaseLock();
                await closeMcpClient();
              }
            }
          },
        }),
      });
    },
  );
};

export const POST = observe(handler, {
  name: "handle-chatbot-message",
  endOnExit: false, // end after stream has finished
  asType: "agent",
});

export const maxDuration = 30;
