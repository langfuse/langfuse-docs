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
  OPENAI_DECISIONS_PRICE_USD_PER_MTOK,
  computeCostDetails,
  computeCostUsd,
  type SentimentUsage,
} from "./cost";
import { parseClassifierIds, type ClassifierDefinition } from "./criteria";
import type { ClassifierAnswer, ClassifierRunResult } from "./types";

export type { ClassifierRunResult as DecisionsSentimentResult };

const DECISIONS_MODEL = "gpt-6-luna";
const DECISIONS_ENDPOINT = "https://api.openai.com/v1/decisions";

type DecisionChoiceOption = {
  value: string;
  description: string;
};

type DecisionChoiceQuestion = {
  type: "choice";
  name: string;
  instructions: string;
  choices: DecisionChoiceOption[];
};

type DecisionChoiceProbability = {
  value: string;
  probability: number;
};

type DecisionChoiceAnswer = {
  type: "choice";
  name: string;
  choice: string;
  confidence: number;
  probabilities: DecisionChoiceProbability[];
};

type DecisionRefusalAnswer = {
  type: "refusal";
  name?: string;
};

type DecisionAnswer =
  | DecisionChoiceAnswer
  | DecisionRefusalAnswer
  | {
      type: string;
      name?: string;
    };

type DecisionsApiResponse = {
  model?: string;
  answers?: DecisionAnswer[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: { message?: string; type?: string };
};

const buildDecisionsRequest = (
  text: string,
  selected: ClassifierDefinition[],
) => ({
  model: DECISIONS_MODEL,
  input: text,
  questions: selected.map(
    (definition): DecisionChoiceQuestion => ({
      type: "choice",
      name: definition.id,
      instructions: definition.instructions,
      choices: Object.entries(definition.criteria).map(
        ([value, description]) => ({
          value,
          description,
        }),
      ),
    }),
  ),
});

const asChoiceAnswer = (
  answer: DecisionAnswer | undefined,
  id: string,
): DecisionChoiceAnswer => {
  if (!answer) {
    throw new Error(
      `OpenAI Decisions API did not return an answer for "${id}".`,
    );
  }
  if (answer.type === "refusal") {
    throw new Error(
      `OpenAI Decisions API refused to answer "${id}"${
        answer.name ? ` (${answer.name})` : ""
      }.`,
    );
  }
  if (
    answer.type !== "choice" ||
    typeof (answer as DecisionChoiceAnswer).choice !== "string" ||
    typeof (answer as DecisionChoiceAnswer).confidence !== "number" ||
    !Array.isArray((answer as DecisionChoiceAnswer).probabilities)
  ) {
    throw new Error(
      `OpenAI Decisions API did not return a choice answer for "${id}".`,
    );
  }
  return answer as DecisionChoiceAnswer;
};

const parseUsage = (usage: DecisionsApiResponse["usage"]): SentimentUsage => {
  const inputTokens = usage?.input_tokens ?? usage?.prompt_tokens ?? 0;
  const outputTokens = usage?.output_tokens ?? usage?.completion_tokens ?? 0;
  return {
    inputTokens,
    outputTokens,
    totalTokens: usage?.total_tokens ?? inputTokens + outputTokens,
    costUsd: computeCostUsd(
      inputTokens,
      outputTokens,
      OPENAI_DECISIONS_PRICE_USD_PER_MTOK,
    ),
  };
};

const createDecision = async (
  request: ReturnType<typeof buildDecisionsRequest>,
  apiKey: string,
): Promise<DecisionsApiResponse> => {
  const res = await fetch(DECISIONS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const responseText = await res.text();
  let data: DecisionsApiResponse;
  try {
    data = responseText
      ? (JSON.parse(responseText) as DecisionsApiResponse)
      : {};
  } catch {
    throw new Error(
      `OpenAI Decisions API returned a non-JSON response (${res.status}).`,
    );
  }

  if (!res.ok) {
    throw new Error(
      data.error?.message ??
        `OpenAI Decisions API request failed (${res.status}).`,
    );
  }

  return data;
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

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return new Response(
      JSON.stringify({
        error:
          "OPENAI_API_KEY is not configured. Add an OpenAI API key to run the Decisions API classifier.",
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

  return propagateAttributes(
    {
      traceName: "Sentiment-Classifier-OpenAI-Decisions",
      tags: ["sentiment-classifier", "openai", "decisions-api", "gpt-6-luna"],
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      const request = buildDecisionsRequest(text, selected);

      setActiveTraceIO({ input: request });
      updateActiveObservation({ input: request }, { asType: "generation" });

      try {
        const response = await createDecision(
          request,
          process.env.OPENAI_API_KEY!,
        );
        const usage = parseUsage(response.usage);
        const answersByName = new Map(
          (response.answers ?? []).map((answer) => [answer.name ?? "", answer]),
        );

        const answers: ClassifierAnswer[] = selected.map((definition) => {
          const answer = asChoiceAnswer(
            answersByName.get(definition.id),
            definition.id,
          );
          const probabilities = Object.fromEntries(
            Object.keys(definition.criteria).map((label) => {
              const match = answer.probabilities.find(
                (item) => item.value === label,
              );
              return [label, match?.probability ?? 0];
            }),
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
          model: response.model ?? DECISIONS_MODEL,
          usage,
          answers,
        };

        setActiveTraceIO({ output: result });
        updateActiveObservation(
          {
            input: request,
            output: result,
            model: result.model,
            metadata: {
              provider: "openai",
              endpoint: "decisions",
              questionType: "choice",
              questionCount: selected.length,
              costUsd: usage.costUsd,
            },
            usageDetails: {
              input: usage.inputTokens,
              output: usage.outputTokens,
              total: usage.totalTokens,
            },
            // Decisions API bills input tokens only (output price is $0).
            costDetails: computeCostDetails(
              usage.inputTokens,
              usage.outputTokens,
              OPENAI_DECISIONS_PRICE_USD_PER_MTOK,
            ),
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
  name: "sentiment-classifier-decisions",
  asType: "generation",
  // Keep the result we set via updateActiveObservation; otherwise observe
  // would capture the HTTP Response object, which serializes to {}.
  captureOutput: false,
});

export const maxDuration = 30;
