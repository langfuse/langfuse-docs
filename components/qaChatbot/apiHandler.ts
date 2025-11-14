import {
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
} from "ai";
import {
  observe,
  startActiveObservation,
  updateActiveObservation,
  updateActiveTrace,
  getActiveTraceId,
} from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { LangfuseClient } from "@langfuse/client";
import { chatbotStep } from "./chatbotCore";

export const langfuseClient = new LangfuseClient({
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

  updateActiveObservation({ input: inputText }, { asType: "generation" });

  updateActiveTrace({
    name: "QA-Chatbot",
    sessionId: chatId,
    userId,
    input: inputText,
  });

  const prompt = await tracedGetPrompt("langfuse-docs-assistant-chat", {
    type: "chat",
  });

  // Initialize MCP client using Streamable HTTP transport (works with our MCP server)
  const mcpClient = await startActiveObservation(
    "create-mcp-client",
    async () => {
      const mcpUrl = new URL("https://langfuse.com/api/mcp", req.url);

      return createMCPClient({
        transport: new StreamableHTTPClientTransport(mcpUrl, {
          sessionId: `qa-chatbot-${crypto.randomUUID()}`,
        }) as MCPTransport,
      });
    },
  );

  const result = await chatbotStep(prompt, messages, mcpClient);

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
