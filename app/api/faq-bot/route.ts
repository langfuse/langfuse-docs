import { openai } from "@ai-sdk/openai";
import { createMCPClient } from "@ai-sdk/mcp";
import { LangfuseClient } from "@langfuse/client";
import { stepCountIs, streamText } from "ai";
import {
  getActiveTraceId,
  observe,
  propagateAttributes,
  setActiveTraceIO,
  startActiveObservation,
} from "@langfuse/tracing";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { after } from "next/server";
import { context, ROOT_CONTEXT } from "@opentelemetry/api";
import { z } from "zod";
import { flush } from "@/src/instrumentation";

export const runtime = "nodejs";
export const maxDuration = 60;

// Use the same EU prompt project as the example chatbot.
const langfuseClient = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});
const getFaqPrompt = observe(
  () =>
    langfuseClient.prompt.get("langfuse-docs-faq", {
      type: "chat",
      label: "production",
      fetchTimeoutMs: 5_000,
    }),
  { name: "get-faq-prompt" },
);
const promptConfigSchema = z.object({
  model: z.string().min(1),
  reasoningEffort: z.enum(["low", "medium", "high"]),
  textVerbosity: z.enum(["low", "medium", "high"]),
  maxOutputTokens: z.number().int().positive().max(4096),
});

const bodySchema = z.object({
  question: z.string().trim().min(1).max(500),
});
const unavailable =
  "I couldn’t get an answer right now. Please try a new question in a moment.";

export async function POST(req: Request) {
  // Bound the body even when a caller omits Content-Length.
  let body: unknown;
  try {
    const reader = req.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return Response.json(
          { error: "Question is too long." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return Response.json({ error: "Invalid question." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Enter a question of up to 500 characters." },
      { status: 400 },
    );
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: unavailable }, { status: 503 });
  }

  const { question } = parsed.data;
  const abortSignal = AbortSignal.any([
    req.signal,
    AbortSignal.timeout(50_000),
  ]);
  // Give each FAQ question its own root, independent of Next.js request spans.
  return context.with(ROOT_CONTEXT, () =>
    startActiveObservation(
      "FAQ-bot",
      async (observation) =>
        propagateAttributes(
          {
            traceName: "FAQ-bot",
            tags: ["faq-bot"],
          },
          async () => {
            observation.update({ input: question });
            setActiveTraceIO({ input: question });
            let client: Awaited<ReturnType<typeof createMCPClient>> | undefined;
            let finished = false;
            let resolveFinished!: () => void;
            const completion = new Promise<void>((resolve) => {
              resolveFinished = resolve;
            });
            // after() keeps the serverless request alive until streaming and export finish.
            after(async () => {
              await completion;
              await flush();
            });
            async function finish(output: string, failed = false) {
              if (finished) return;
              finished = true;
              try {
                observation.update({
                  output,
                  ...(failed
                    ? { level: "ERROR" as const, statusMessage: output }
                    : {}),
                });
                setActiveTraceIO({ output });
                await client?.close();
              } catch {
                console.warn("FAQ-bot: MCP cleanup failed");
              } finally {
                observation.end();
                resolveFinished();
              }
            }

            try {
              const prompt = await getFaqPrompt();
              const config = promptConfigSchema.parse(prompt.config);
              const compiledPrompt = prompt.compile({ question });
              const instructions = compiledPrompt
                .filter((message) => message.role === "system")
                .map((message) => message.content)
                .join("\n\n");
              const messages = compiledPrompt.filter(
                (message) => message.role !== "system",
              );
              client = await createMCPClient({
                transport: new StreamableHTTPClientTransport(
                  new URL("https://langfuse.com/api/mcp"),
                  {
                    sessionId: `faq-bot-${crypto.randomUUID()}`,
                    requestInit: { signal: abortSignal },
                  },
                ),
              });
              const availableTools = await client.tools();
              // Never expose the MCP's submitFeedback tool to this public Q&A endpoint.
              const tools = {
                searchLangfuseDocs: availableTools.searchLangfuseDocs,
                getLangfuseDocsPage: availableTools.getLangfuseDocsPage,
              };
              if (!tools.searchLangfuseDocs || !tools.getLangfuseDocsPage) {
                throw new Error("Documentation tools unavailable");
              }
              const result = streamText({
                model: openai(config.model),
                instructions,
                messages,
                tools,
                // Always retrieve docs first; reserve the last step for the answer.
                prepareStep: ({ stepNumber }) => ({
                  toolChoice:
                    stepNumber === 0
                      ? {
                          type: "tool" as const,
                          toolName: "searchLangfuseDocs",
                        }
                      : stepNumber >= 3
                        ? ("none" as const)
                        : ("auto" as const),
                }),
                stopWhen: stepCountIs(4),
                maxOutputTokens: config.maxOutputTokens,
                maxRetries: 1,
                abortSignal,
                providerOptions: {
                  openai: {
                    reasoningEffort: config.reasoningEffort,
                    textVerbosity: config.textVerbosity,
                  },
                },
                runtimeContext: { langfusePrompt: prompt },
                telemetry: {
                  functionId: "faq-answer",
                  includeRuntimeContext: { langfusePrompt: true },
                },
                onFinish: async ({ text }) => {
                  await finish(
                    text || "No answer was generated.",
                    !text.trim(),
                  );
                },
                onError: async ({ error }) => {
                  console.warn(
                    "FAQ-bot: model request failed",
                    error instanceof Error ? error.name : "UnknownError",
                  );
                  await finish(unavailable, true);
                },
                onAbort: async () => {
                  await finish("Answer cancelled or timed out.", true);
                },
              });
              return result.toUIMessageStreamResponse({
                generateMessageId: () => getActiveTraceId(),
                sendSources: false,
                sendReasoning: false,
                onError: () => unavailable,
              });
            } catch {
              await finish(unavailable, true);
              return Response.json({ error: unavailable }, { status: 502 });
            }
          },
        ),
      { asType: "agent", endOnExit: false },
    ),
  );
}
