import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
  stepCountIs,
} from "ai";
import { observe, startActiveSpan } from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { LangfuseClient } from "@langfuse/client";
import { getActiveTraceId } from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";

const langfuseClient = new LangfuseClient({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY,
});
const tracedGetPrompt = observe(
  langfuseClient.prompt.get.bind(langfuseClient.prompt)
);

export const POST = async (req: Request) => {
  return startActiveSpan(
    "handle-chatbot-message",
    async (span) => {
      const {
        messages,
        chatId,
        userId,
      }: { messages: UIMessage[]; chatId: string; userId: string } =
        await req.json();

      // Set session id and user id on active trace
      const inputText = messages[messages.length - 1].parts.find(
        (part) => part.type === "text"
      )?.text;
      span
        .update({
          input: inputText,
        })
        .updateTrace({
          name: "QA-Chatbot",
          sessionId: chatId,
          userId,
          input: inputText,
        });

      // Get prompt from Langfuse
      const prompt = await tracedGetPrompt("langfuse-docs-assistant-text");

      // Initialize MCP client using Streamable HTTP transport (works with our MCP server)
      const mcpClient = await startActiveSpan("create-mcp-client", async () => {
        const mcpUrl = new URL("https://langfuse.com/api/mcp", req.url);

        return createMCPClient({
          transport: new StreamableHTTPClientTransport(mcpUrl, {
            sessionId: `qa-chatbot-${crypto.randomUUID()}`,
          }) as MCPTransport,
        });
      });

      // Discover all tools exposed by the MCP server
      const tools = await mcpClient.tools();

      const result = streamText({
        model: openai("gpt-5-nano"),
        providerOptions: {
          openai: {
            reasoningSummary: "detailed",
            textVerbosity: "low",
            reasoningEffort: "low",
          } satisfies OpenAIResponsesProviderOptions,
        },
        system: prompt.prompt,
        messages: convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(10),
        onFinish: async (result) => {
          span
            .update({
              output: result.content,
            })
            .updateTrace({
              output: result.content,
            })
            .end();

          await mcpClient.close();
        },
        experimental_telemetry: { isEnabled: true },
      });

      // Schedule flush after request is finished
      after(() => flush());

      return result.toUIMessageStreamResponse({
        generateMessageId: () => getActiveTraceId(),
        sendSources: true,
        sendReasoning: true,
      });
    },
    { endOnExit: false }
  );
};

export const maxDuration = 30;
