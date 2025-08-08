export const config = {
  runtime: "edge",
};

import { openai } from "@ai-sdk/openai";
import {
  experimental_createMCPClient,
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

const SYSTEM_PROMPT = `You are Langfuse’s AI assistant. Focus exclusively on Langfuse products, documentation, SDKs, and examples. Prefer factual, concise answers with links to the official docs where helpful. Use the available tools (searchLangfuseDocs, getLangfuseOverview) to retrieve accurate, up-to-date information. If you are unsure, state that clearly and suggest relevant docs pages.`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  // Connect to the Langfuse Docs MCP server over SSE
  const mcpClient = await experimental_createMCPClient({
    transport: {
      type: "sse",
      url: "https://langfuse.com/api/mcp",
    },
  });

  const tools = await mcpClient.tools();

  // Generate a streaming response with tool support
  const result = streamText({
    model: openai("gpt-5"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools,
  });

  // Note: Do not close the MCP client early; the tools may be used during streaming
  const response = result.toUIMessageStreamResponse({
    sendReasoning: true,
    onError: (error) => {
      console.error("/api/ai-demo error:", error);
      return "An error occurred.";
    },
  });

  return response;
}