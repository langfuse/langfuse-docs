import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { streamText, UIMessage, stepCountIs } from "ai";
import { createMCPClient } from "@ai-sdk/mcp";
import {
  observe,
  propagateAttributes,
  startActiveObservation,
  updateActiveObservation,
  getActiveTraceId,
} from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { flush } from "@/src/instrumentation";
import { context, trace } from "@opentelemetry/api";
import { after } from "next/server";
import { demoProjectLangfuseClient } from "@/lib/demo-public-trace";

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
      let isMcpClientClosed = false;

      const closeMcpClient = async () => {
        if (isMcpClientClosed) return;
        isMcpClientClosed = true;
        await mcpClient.close();
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
        onFinish: async (result) => {
          await closeMcpClient();

          const latestText = Array.isArray((result as any).content)
            ? [...((result as any).content as Array<any>)]
                .reverse()
                .find((part: any) => part?.type === "text")?.text
            : (result as any).content;

          runWithActiveSpan(() => {
            updateActiveObservation(
              { output: latestText },
              { asType: "generation" },
            );
            activeSpan?.end();
          });
        },
      });

      after(async () => await flush());

      return result.toUIMessageStreamResponse({
        generateMessageId: () => traceId ?? crypto.randomUUID(),
        sendSources: true,
        sendReasoning: true,
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
