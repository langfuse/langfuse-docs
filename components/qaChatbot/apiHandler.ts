import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
  stepCountIs,
} from "ai";
import { observe, startActiveSpan, updateActiveTrace } from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { LangfuseClient } from "@langfuse/client";
import { getActiveTraceId } from "./utils/activeTraceId";

const langfuseClient = new LangfuseClient();
const tracedGetPrompt = observe(
  (name: string) => langfuseClient.prompt.get(name),
  {
    name: "get-prompt",
  }
);

const handler = async (req: Request) => {
  const {
    messages,
    chatId,
    userId,
  }: { messages: UIMessage[]; chatId: string; userId: string } =
    await req.json();

  // Set session id and user id on active trace
  updateActiveTrace({
    sessionId: chatId,
    userId,
    input: messages[messages.length - 1].parts.find(
      (part) => part.type === "text"
    )?.text,
  });

  // Get prompt from Langfuse
  const prompt = (
    await tracedGetPrompt("langfuse-docs-assistant-text")
  ).compile();

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
    system: prompt,
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
    onFinish: async (result) => {
      await mcpClient.close();
      updateActiveTrace({
        output: result,
      });
    },
    experimental_telemetry: { isEnabled: true },
  });

  return result.toUIMessageStreamResponse({
    generateMessageId: () => getActiveTraceId(),
    sendSources: true,
    sendReasoning: true,
  });
};

// Instrument handler with Langfuse tracing
export const POST = observe(handler);

export const maxDuration = 30;
