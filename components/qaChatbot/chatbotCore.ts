import { openai, OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  experimental_createMCPClient as createMCPClient,
  stepCountIs,
} from "ai";
import {
  updateActiveObservation,
  updateActiveTrace,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { trace } from "@opentelemetry/api";
import { langfuseClient } from "./apiHandler";

// Type declarations
export type Prompt = Awaited<ReturnType<typeof langfuseClient.prompt.get>>;
export type MCPClient = Awaited<ReturnType<typeof createMCPClient>>;

export interface PromptConfig {
  model?: string;
  reasoningSummary?: 'low' | 'medium' | 'high';
  textVerbosity?: 'low' | 'medium' | 'high';
  reasoningEffort?: 'low' | 'medium' | 'high';
  [key: string]: unknown; // Allow other properties
}

export const getProcessedPrompt = (prompt: Prompt, messages: UIMessage[]) => {
  const promptConfig = prompt.config as PromptConfig;

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
  return { compiledPrompt, promptConfig };
}

export const chatbotStep = async (prompt: Prompt, messages: UIMessage[], mcpClient: MCPClient) => {
  const { compiledPrompt, promptConfig } = getProcessedPrompt(prompt, messages);

  // Discover all tools exposed by the MCP server
  const tools = await mcpClient.tools();

  const result = streamText({
    model: openai(String(promptConfig.model)),
    providerOptions: {
      openai: {
        reasoningSummary: promptConfig.reasoningSummary,
        textVerbosity: promptConfig.textVerbosity,
        reasoningEffort: promptConfig.reasoningEffort,
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
    }
  });
  
  // Schedule flush after request is finished
  after(async () => await flush());

  return result;
}

