import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
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
  JEV_PRICE_USD_PER_MTOK,
  computeCostUsd,
  type SentimentUsage,
} from "./cost";
import { parseClassifierIds, type ClassifierDefinition } from "./criteria";
import type { ClassifierAnswer, ClassifierRunResult } from "./types";

export type { ClassifierRunResult as SentimentResult };

const buildSystemOneRequest = (
  text: string,
  selected: ClassifierDefinition[],
) => ({
  state: text,
  questions: Object.fromEntries(
    selected.map((definition) => [
      definition.id,
      choice(definition.instructions, definition.criteria),
    ]),
  ),
});

let _client: TypeSafeClient | null = null;
const getClient = () => {
  if (_client) return _client;
  if (!process.env.TYPESAFE_API_KEY?.trim()) {
    throw new Error(
      "TYPESAFE_API_KEY is not configured. Add a TypeSafe API key to run the sentiment classifier.",
    );
  }
  _client = new TypeSafeClient({ defaultModel: "jev-latest" });
  return _client;
};

type ChoiceAnswer = {
  choice: string;
  confidence: number;
  probabilities: Record<string, number>;
};

const asChoiceAnswer = (value: unknown, id: string): ChoiceAnswer => {
  if (
    !value ||
    typeof value !== "object" ||
    typeof (value as ChoiceAnswer).choice !== "string" ||
    typeof (value as ChoiceAnswer).confidence !== "number" ||
    typeof (value as ChoiceAnswer).probabilities !== "object"
  ) {
    throw new Error(`Jev did not return a choice answer for "${id}".`);
  }
  return value as ChoiceAnswer;
};

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 15, windowMs: 60_000 });
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

  return propagateAttributes(
    {
      traceName: "Sentiment-Classifier-Jev",
      tags: ["sentiment-classifier", "typesafe", "jev"],
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      const request = buildSystemOneRequest(text, selected);

      setActiveTraceIO({ input: request });
      updateActiveObservation({ input: request }, { asType: "generation" });

      try {
        const response = await getClient().systemOne(request);
        const inputTokens = response.usage.input_tokens;
        const outputTokens = response.usage.output_tokens;
        const usage: SentimentUsage = {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          costUsd: computeCostUsd(
            inputTokens,
            outputTokens,
            JEV_PRICE_USD_PER_MTOK,
          ),
        };

        const answers: ClassifierAnswer[] = selected.map((definition) => {
          const answer = asChoiceAnswer(
            response.answers[definition.id],
            definition.id,
          );
          const probabilities = Object.fromEntries(
            Object.keys(definition.criteria).map((label) => [
              label,
              answer.probabilities[label] ?? 0,
            ]),
          );
          return {
            id: definition.id,
            name: definition.name,
            value: answer.choice,
            confidence: answer.confidence,
            probabilities,
          };
        });

        const result: ClassifierRunResult = {
          model: response.model,
          usage,
          answers,
        };

        setActiveTraceIO({ output: result });
        updateActiveObservation(
          {
            input: request,
            output: result,
            model: response.model,
            metadata: {
              provider: "typesafe",
              questionType: "choice",
              questionCount: selected.length,
              costUsd: usage.costUsd,
            },
            usageDetails: {
              input: inputTokens,
              output: outputTokens,
              total: usage.totalTokens,
            },
            costDetails: {
              total: usage.costUsd,
            },
          },
          { asType: "generation" },
        );

        after(async () => await flush());

        return new Response(JSON.stringify({ result, traceId }), {
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
  asType: "generation",
  // Keep the result we set via updateActiveObservation; otherwise observe
  // would capture the HTTP Response object, which serializes to {}.
  captureOutput: false,
});

export const maxDuration = 30;
