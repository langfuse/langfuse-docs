import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  observe,
  propagateAttributes,
  setActiveTraceIO,
  getActiveTraceId,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  keyPhrases: z.array(z.string()),
});

export type LlmSentimentResult = z.infer<typeof SentimentSchema>;

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
      tags: ["sentiment-classifier", "openai", "gpt-4o-mini"],
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      setActiveTraceIO({ input: text });

      try {
        const result = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: SentimentSchema,
          prompt: `Analyze the sentiment of the following text. Classify it as positive, negative, or neutral. Provide a confidence score between 0 and 1, a brief explanation of your reasoning, and extract the key phrases that influenced your classification.\n\nText: ${text}`,
          telemetry: {
            functionId: "sentiment-classifier-gpt",
          },
        });

        setActiveTraceIO({ output: result.object });

        after(async () => await flush());

        return new Response(
          JSON.stringify({ result: result.object, traceId }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
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
});

export const maxDuration = 30;
