import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
  stepCountIs,
} from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Initialize MCP client using Streamable HTTP transport (works with our MCP server)
  const mcpUrl = new URL("https://langfuse.com/api/mcp", req.url);
  const mcpClient = await createMCPClient({
    transport: new StreamableHTTPClientTransport(mcpUrl, {
      sessionId: `qa-chatbot-${crypto.randomUUID()}`,
    }) as MCPTransport,
  });

  // Discover all tools exposed by the MCP server
  const tools = await mcpClient.tools();

  const result = streamText({
    model: openai("gpt-5-mini"),
    providerOptions: {
      openai: {
        reasoningSummary: "detailed",
        textVerbosity: "low",
        reasoningEffort: "low",
      } satisfies OpenAIResponsesProviderOptions,
    },
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
    onFinish: async () => {
      await mcpClient.close();
    },
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
