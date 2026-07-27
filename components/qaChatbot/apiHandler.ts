import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  createUIMessageStreamResponse,
  streamText,
  stepCountIs,
  type UIMessage,
} from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  observe,
  propagateAttributes,
  startActiveObservation,
} from "@langfuse/tracing";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { flush } from "@/src/instrumentation";
import {
  createPublicDemoTraceLink,
  demoProjectLangfuseClient,
  makeDemoTracePublic,
  publishPublicDemoTraceLink,
} from "@/lib/demo-project-trace";

const langfuseAiTelemetry = new LangfuseVercelAiSdkIntegration();

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

  return startActiveObservation(
    "handle-chatbot-message",
    async (rootObservation) => {
      try {
        return await propagateAttributes(
          {
            traceName: "QA-Chatbot",
            tags: ["qa-chatbot"],
            sessionId: chatId,
            userId,
          },
          async () => {
            rootObservation.update({ input: inputText });
            rootObservation.setTraceIO({ input: inputText });
            makeDemoTracePublic(rootObservation);
            await createPublicDemoTraceLink({
              traceId: rootObservation.traceId,
              name: "QA-Chatbot",
              input: inputText,
              userId,
              sessionId: chatId,
              tags: ["qa-chatbot"],
            });
            let traceEnded = false;
            let publishedTraceUrl: string | undefined;

            const finishPublicTrace = async ({
              output,
              error,
            }: {
              output?: unknown;
              error?: unknown;
            } = {}) => {
              if (traceEnded) return;

              if (error) {
                rootObservation.update({
                  level: "ERROR",
                  statusMessage:
                    error instanceof Error ? error.message : String(error),
                });
              } else {
                rootObservation.update({ output });
                rootObservation.setTraceIO({ output });
              }

              makeDemoTracePublic(rootObservation);
              rootObservation.end();
              traceEnded = true;

              try {
                await flush();
                const publishedTraceLink = await publishPublicDemoTraceLink({
                  traceId: rootObservation.traceId,
                  name: "QA-Chatbot",
                  userId,
                  sessionId: chatId,
                  tags: ["qa-chatbot"],
                });
                publishedTraceUrl = publishedTraceLink.traceUrl;
              } catch (err) {
                console.warn("Failed to flush public Langfuse trace", err);
              }
            };

            const prompt = await tracedGetPrompt(
              "langfuse-docs-assistant-chat",
              {
                type: "chat",
              },
            );

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

            const compiledPrompt = prompt.compile(
              {},
              { chat_history: chatHistory },
            );
            const langfusePrompt = prompt.toJSON();
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

            const closeMcpClient = async () => {
              await mcpClient.close().catch((err) => {
                console.warn("Failed to close QA chatbot MCP client", err);
              });
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
                langfusePrompt,
              },
              experimental_telemetry: {
                isEnabled: true,
                functionId: "qa-chatbot",
                includeRuntimeContext: {
                  langfusePrompt: true,
                },
                integrations: [langfuseAiTelemetry],
              },
              onError: async ({ error }) => {
                await closeMcpClient();
                await finishPublicTrace({ error });
              },
            });

            let outputText = "";
            const publicTraceStream = result
              .toUIMessageStream({
                generateMessageId: () => rootObservation.traceId,
                sendSources: true,
                sendReasoning: true,
              })
              .pipeThrough(
                new TransformStream<any, any>({
                  async transform(chunk, controller) {
                    if (chunk.type === "text-delta") {
                      outputText += chunk.delta;
                    }

                    if (chunk.type === "finish") {
                      await closeMcpClient();
                      await finishPublicTrace({ output: outputText });

                      if (publishedTraceUrl) {
                        controller.enqueue({
                          type: "message-metadata",
                          messageMetadata: { traceUrl: publishedTraceUrl },
                        });
                      }
                    }

                    controller.enqueue(chunk);
                  },
                  async flush() {
                    if (!traceEnded) {
                      await closeMcpClient();
                      await finishPublicTrace({ output: outputText });
                    }
                  },
                }),
              );

            return createUIMessageStreamResponse({
              stream: publicTraceStream,
            });
          },
        );
      } catch (err) {
        rootObservation.update({
          level: "ERROR",
          statusMessage: err instanceof Error ? err.message : String(err),
        });
        rootObservation.end();

        try {
          await flush();
        } catch (flushErr) {
          console.warn("Failed to flush errored Langfuse trace", flushErr);
        }

        throw err;
      }
    },
    {
      asType: "agent",
      endOnExit: false,
    },
  );
};

export const POST = handler;

export const maxDuration = 120;
