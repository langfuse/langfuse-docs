import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
  stepCountIs,
} from "ai";
import {
  observe,
  startActiveSpan,
  updateActiveSpan,
  updateActiveTrace,
} from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { LangfuseClient } from "@langfuse/client";
import { getActiveTraceId } from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { trace } from "@opentelemetry/api";

const langfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});
const tracedGetPrompt = observe(
  langfuseClient.prompt.get.bind(langfuseClient.prompt),
  { name: "get-langfuse-prompt" },
);

export const handler = async (req: Request) => {
  const {
    messages,
    chatId,
    userId,
  }: { messages: UIMessage[]; chatId: string; userId: string } =
    await req.json();

  // Set session id and user id on active trace
  const inputText = messages[messages.length - 1].parts.find(
    (part) => part.type === "text",
  )?.text;

  updateActiveSpan({
    input: inputText,
  });

  updateActiveTrace({
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
    experimental_telemetry: { isEnabled: true },
    onFinish: async (result) => {
      await mcpClient.close();

      updateActiveSpan({
        output: result.content,
      });
      updateActiveTrace({
        output: result.content,
      });
      trace.getActiveSpan().end();
    },
  });

  // Schedule flush after request is finished
  after(() => flush());

  return result.toUIMessageStreamResponse({
    generateMessageId: () => getActiveTraceId(),
    sendSources: true,
    sendReasoning: true,
  });
};

export const POST = observe(handler, {
  name: "handle-chatbot-message",
  endOnExit: false, // end after stream has finished
});

export const maxDuration = 30;
