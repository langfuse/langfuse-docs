import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  observe,
  propagateAttributes,
  setActiveTraceIO,
  getActiveTraceId,
  updateActiveObservation,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  LUNA_PRICE_USD_PER_MTOK,
  computeCostUsd,
  type SentimentUsage,
} from "./cost";

const LLM_MODEL = "gpt-5.6-luna";
const LLM_REASONING_EFFORT = "high" as const;

const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  keyPhrases: z.array(z.string()),
});

export type LlmSentimentResult = z.infer<typeof SentimentSchema> & {
  model: string;
  usage: SentimentUsage;
};

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 15, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const { text, userId }: { text: string; userId: string } = await req.json();

  if (!text || text.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Text is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return new Response(
      JSON.stringify({
        error:
          "OPENAI_API_KEY is not configured. Add an OpenAI API key to run the GPT sentiment classifier.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return propagateAttributes(
    {
      traceName: "Sentiment-Classifier-GPT",
      tags: [
        "sentiment-classifier",
        "openai",
        "gpt-5.6-luna",
        "reasoning-high",
      ],
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      setActiveTraceIO({ input: text });

      try {
        const result = await generateObject({
          model: openai(LLM_MODEL),
          schema: SentimentSchema,
          prompt: `Analyze the sentiment of the following text. Classify it as positive, negative, or neutral. Provide a confidence score between 0 and 1, a brief explanation of your reasoning, and extract the key phrases that influenced your classification.\n\nText: ${text}`,
          providerOptions: {
            openai: {
              reasoningEffort: LLM_REASONING_EFFORT,
            },
          },
          telemetry: {
            functionId: "sentiment-classifier-gpt",
          },
        });

        const inputTokens = result.usage.inputTokens ?? 0;
        const outputTokens = result.usage.outputTokens ?? 0;
        const reasoningTokens =
          result.usage.outputTokenDetails?.reasoningTokens ?? 0;
        const usage: SentimentUsage = {
          inputTokens,
          outputTokens,
          reasoningTokens,
          totalTokens: inputTokens + outputTokens,
          costUsd: computeCostUsd(
            inputTokens,
            outputTokens,
            LUNA_PRICE_USD_PER_MTOK,
          ),
        };

        const payload: LlmSentimentResult = {
          ...result.object,
          model: LLM_MODEL,
          usage,
        };

        setActiveTraceIO({ output: payload });
        updateActiveObservation(
          {
            input: text,
            output: payload,
            model: LLM_MODEL,
            metadata: {
              reasoningEffort: LLM_REASONING_EFFORT,
              costUsd: usage.costUsd,
            },
            usageDetails: {
              input: inputTokens,
              output: outputTokens,
              ...(reasoningTokens > 0 ? { reasoning: reasoningTokens } : {}),
              total: usage.totalTokens,
            },
            costDetails: {
              total: usage.costUsd,
            },
          },
          { asType: "generation" },
        );

        after(async () => await flush());

        return new Response(JSON.stringify({ result: payload, traceId }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        after(async () => await flush());

        return new Response(
          JSON.stringify({
            error:
              err instanceof Error ? err.message : "Failed to classify text",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    },
  );
};

export const POST = observe(handler, {
  name: "sentiment-classifier-gpt",
  asType: "generation",
  // Keep the GPT result we set via updateActiveObservation; otherwise observe
  // would capture the HTTP Response object, which serializes to {}.
  captureOutput: false,
});

// Luna + high reasoning can take longer than gpt-4o-mini.
export const maxDuration = 90;
