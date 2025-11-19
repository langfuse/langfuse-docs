import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
  stepCountIs,
} from "ai";
import {
  observe,
  startActiveObservation,
  updateActiveObservation,
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

  updateActiveObservation({ input: inputText }, { asType: "generation" });

  updateActiveTrace({
    name: "QA-Chatbot",
    sessionId: chatId,
    userId,
    input: inputText,
  });

  // Get prompt from Langfuse
  const prompt = await tracedGetPrompt("langfuse-docs-assistant-chat", {
    type: "chat",
  });

  const reasoningSummary = prompt.config
    .reasoningSummary as 'low' | 'medium' | 'high' | undefined;
  const textVerbosity = prompt.config
    .textVerbosity as 'low' | 'medium' | 'high' | undefined;
  const reasoningEffort = prompt.config
    .reasoningEffort as 'low' | 'medium' | 'high' | undefined;

  // Convert UI messages format of Vercel AI SDK to: [{ role: "user", content: "text..." }]
  const chatHistory = messages.map((msg) => ({
    role: msg.role,
    content: msg.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(""),
  }));
  
  // Compile the prompt with chat history as a message placeholder
  const compiledPrompt = prompt.compile({}, { chat_history: chatHistory });

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

  // Discover all tools exposed by the MCP server
  const tools = await mcpClient.tools();


  const result = streamText({
    model: openai(String(prompt.config.model)),
    providerOptions: {
      openai: {
        reasoningSummary,
        textVerbosity,
        reasoningEffort,
      } satisfies OpenAIResponsesProviderOptions,
    },
    messages: compiledPrompt,
    tools,
    stopWhen: stepCountIs(10),
    experimental_telemetry: {
      isEnabled: true,
      metadata: { langfusePrompt: prompt.toJSON() },
    },
    onFinish: async (result) => {
      await mcpClient.close();

      const latestText = Array.isArray((result as any).content)
        ? [...((result as any).content as Array<any>)]
            .reverse()
            .find((part: any) => part?.type === "text")?.text
        : (result as any).content;

      updateActiveObservation({ output: latestText }, { asType: "generation" });
      updateActiveTrace({
        output: latestText,
      });
      trace.getActiveSpan().end();
    },
  });

  // Schedule flush after request is finished
  after(async () => await flush());

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
