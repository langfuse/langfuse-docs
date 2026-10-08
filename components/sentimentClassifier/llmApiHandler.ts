import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  observe,
  propagateAttributes,
  setActiveTraceIO,
  startActiveObservation,
  getActiveTraceId,
  updateActiveObservation,
} from "@langfuse/tracing";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  LUNA_PRICE_USD_PER_MTOK,
  addUsage,
  computeCostDetails,
  computeCostUsd,
  emptyUsage,
  type SentimentUsage,
} from "./cost";
import {
  llmSystemPrompt,
  parseClassifierIds,
  type ClassifierDefinition,
} from "./criteria";
import type { ClassifierAnswer, ClassifierRunResult } from "./types";

export type { ClassifierRunResult as LlmSentimentResult };

const LLM_MODEL = "gpt-5.6-luna";
const LLM_REASONING_EFFORT = "high" as const;

const schemaFor = (definition: ClassifierDefinition) => {
  const labels = Object.keys(definition.criteria) as [string, ...string[]];
  return z.object({
    value: z.enum(labels),
    confidence: z.number().min(0).max(1),
    explanation: z.string(),
    keyPhrases: z.array(z.string()),
  });
};

const classifyOne = (definition: ClassifierDefinition, text: string) => {
  const prompt = `Classify the following text:\n\n${text}`;
  const system = llmSystemPrompt(definition);

  return startActiveObservation(
    "classify-text",
    async (generation) => {
      generation.update({
        input: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        model: LLM_MODEL,
        modelParameters: { reasoningEffort: LLM_REASONING_EFFORT },
        metadata: { task: definition.id },
      });

      // Telemetry stays off so this generation is the only record of the call.
      // The AI SDK span would not receive the custom Luna cost split below.
      const result = await generateObject({
        model: openai(LLM_MODEL),
        schema: schemaFor(definition),
        system,
        prompt,
        providerOptions: {
          openai: {
            reasoningEffort: LLM_REASONING_EFFORT,
          },
        },
        telemetry: {
          isEnabled: false,
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

      const answer: ClassifierAnswer = {
        id: definition.id,
        name: definition.name,
        value: result.object.value,
        confidence: result.object.confidence,
        explanation: result.object.explanation,
        keyPhrases: result.object.keyPhrases,
      };

      generation.update({
        output: result.object,
        usageDetails: {
          input: inputTokens,
          output: outputTokens,
          ...(reasoningTokens ? { reasoning: reasoningTokens } : {}),
          total: usage.totalTokens,
        },
        costDetails: computeCostDetails(
          inputTokens,
          outputTokens,
          LUNA_PRICE_USD_PER_MTOK,
        ),
      });

      return { answer, usage };
    },
    { asType: "generation" },
  );
};

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 60, windowMs: 60_000 });
  if (!success) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();
  const { text, userId }: { text: string; userId: string } = body;

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

  let selected: ClassifierDefinition[];
  try {
    selected = parseClassifierIds(body.tasks);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Invalid tasks.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (selected.length > 1) {
    return new Response(
      JSON.stringify({
        error: "Send one classification per request.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
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
      const input = {
        tasks: selected.map((definition) => definition.id),
        text,
      };

      setActiveTraceIO({ input });
      updateActiveObservation({ input }, { asType: "agent" });

      try {
        const runs = await Promise.all(
          selected.map((definition) => classifyOne(definition, text)),
        );

        const usage = runs.reduce(
          (total, run) => addUsage(total, run.usage),
          emptyUsage(),
        );
        const answers = runs.map((run) => run.answer);

        const payload: ClassifierRunResult = {
          model: LLM_MODEL,
          usage,
          answers,
        };

        setActiveTraceIO({ output: payload });
        updateActiveObservation(
          {
            output: payload,
            metadata: {
              reasoningEffort: LLM_REASONING_EFFORT,
              costUsd: usage.costUsd,
            },
          },
          { asType: "agent" },
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
  name: "sentiment-classifier",
  asType: "agent",
  // Keep the result we set via updateActiveObservation; otherwise observe
  // would capture the HTTP Response object, which serializes to {}.
  captureOutput: false,
});

// Luna + high reasoning can take longer than gpt-4o-mini.
export const maxDuration = 90;
