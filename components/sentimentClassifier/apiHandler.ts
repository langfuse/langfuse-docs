import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import {
  observe,
  propagateAttributes,
  setActiveTraceIO,
  getActiveTraceId,
  updateActiveObservation,
} from "@langfuse/tracing";
import { after } from "next/server";
import { context, trace } from "@opentelemetry/api";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";

const SENTIMENT_INSTRUCTIONS = "What is the overall sentiment of this text?";

const SENTIMENT_CRITERIA = {
  positive:
    "The text expresses approval, satisfaction, praise, or other favorable feelings.",
  negative:
    "The text expresses disapproval, frustration, complaint, or other unfavorable feelings.",
  neutral:
    "The text is factual, informational, or does not lean clearly positive or negative.",
} as const;

export type SentimentLabel = keyof typeof SENTIMENT_CRITERIA;

export type SentimentResult = {
  sentiment: SentimentLabel;
  confidence: number;
  probabilities: Record<SentimentLabel, number>;
  model: string;
};

const buildSystemOneRequest = (text: string) => ({
  state: text,
  questions: {
    sentiment: choice(SENTIMENT_INSTRUCTIONS, SENTIMENT_CRITERIA),
  },
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

  return propagateAttributes(
    {
      traceName: "Sentiment-Classifier-Jev",
      tags: ["sentiment-classifier", "typesafe", "jev"],
      userId,
    },
    async () => {
      const traceId = getActiveTraceId();
      const activeSpan = trace.getActiveSpan();
      const runWithActiveSpan = <T>(fn: () => T) =>
        activeSpan
          ? context.with(trace.setSpan(context.active(), activeSpan), fn)
          : fn();

      const request = buildSystemOneRequest(text);

      runWithActiveSpan(() => {
        setActiveTraceIO({ input: request });
        updateActiveObservation({ input: request });
      });

      try {
        const response = await getClient().systemOne(request);

        const answer = response.answers.sentiment;
        const result: SentimentResult = {
          sentiment: answer.choice,
          confidence: answer.confidence,
          probabilities: {
            positive: answer.probabilities.positive,
            negative: answer.probabilities.negative,
            neutral: answer.probabilities.neutral,
          },
          model: response.model,
        };

        runWithActiveSpan(() => {
          setActiveTraceIO({ output: result });
          updateActiveObservation(
            {
              input: request,
              output: result,
              model: response.model,
              metadata: {
                provider: "typesafe",
                questionType: "choice",
              },
              usageDetails: {
                input: response.usage.input_tokens,
                output: response.usage.output_tokens,
                total:
                  response.usage.input_tokens + response.usage.output_tokens,
              },
            },
            { asType: "generation" },
          );
        });

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
  name: "sentiment-classifier-jev",
  asType: "generation",
  // Keep the Jev result we set via updateActiveObservation; otherwise observe
  // would capture the HTTP Response object, which serializes to {}.
  captureOutput: false,
});

export const maxDuration = 30;
