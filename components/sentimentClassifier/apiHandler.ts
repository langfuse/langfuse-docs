import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  observe,
  updateActiveTrace,
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

export type SentimentResult = z.infer<typeof SentimentSchema>;

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 15, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { text, userId }: { text: string; userId: string } = await req.json();

  if (!text || text.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "Text is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const traceId = getActiveTraceId();

  updateActiveTrace({
    name: "Sentiment-Classifier",
    userId,
    input: text,
  });

  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: SentimentSchema,
      prompt: `Analyze the sentiment of the following text. Classify it as positive, negative, or neutral. Provide a confidence score between 0 and 1, a brief explanation of your reasoning, and extract the key phrases that influenced your classification.\n\nText: ${text}`,
      experimental_telemetry: {
        isEnabled: true,
      },
    });

    updateActiveTrace({
      output: result.object,
    });

    after(async () => await flush());

    return new Response(
      JSON.stringify({ result: result.object, traceId }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    after(async () => await flush());

    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Failed to classify text",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST = observe(handler, {
  name: "sentiment-classifier",
});

export const maxDuration = 30;
