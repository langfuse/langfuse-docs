import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { propagateAttributes, startActiveObservation } from "@langfuse/tracing";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  createPublicDemoTraceLink,
  makeDemoTracePublic,
  publishPublicDemoTraceLink,
} from "@/lib/demo-project-trace";

const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  keyPhrases: z.array(z.string()),
});

const langfuseAiTelemetry = new LangfuseVercelAiSdkIntegration();

export type SentimentResult = z.infer<typeof SentimentSchema>;

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

  return startActiveObservation(
    "sentiment-classifier",
    async (rootObservation) => {
      try {
        return await propagateAttributes(
          {
            traceName: "Sentiment-Classifier",
            tags: ["sentiment-classifier"],
            userId,
          },
          async () => {
            rootObservation.update({ input: text });
            rootObservation.setTraceIO({ input: text });
            makeDemoTracePublic(rootObservation);
            await createPublicDemoTraceLink({
              traceId: rootObservation.traceId,
              name: "Sentiment-Classifier",
              input: text,
              userId,
              tags: ["sentiment-classifier"],
            });

            const result = await generateObject({
              model: openai("gpt-4o-mini"),
              schema: SentimentSchema,
              prompt: `Analyze the sentiment of the following text. Classify it as positive, negative, or neutral. Provide a confidence score between 0 and 1, a brief explanation of your reasoning, and extract the key phrases that influenced your classification.\n\nText: ${text}`,
              experimental_telemetry: {
                isEnabled: true,
                functionId: "sentiment-classifier",
                integrations: [langfuseAiTelemetry],
              },
            });

            rootObservation.update({ output: result.object });
            rootObservation.setTraceIO({ output: result.object });
            makeDemoTracePublic(rootObservation);
            rootObservation.end();

            let traceUrl: string | undefined;
            try {
              await flush();
              const publishedTraceLink = await publishPublicDemoTraceLink({
                traceId: rootObservation.traceId,
                name: "Sentiment-Classifier",
                userId,
                tags: ["sentiment-classifier"],
              });
              traceUrl = publishedTraceLink.traceUrl;
            } catch (err) {
              console.warn("Failed to flush public Langfuse trace", err);
            }

            return new Response(
              JSON.stringify({
                result: result.object,
                traceId: rootObservation.traceId,
                traceUrl,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          },
        );
      } catch (err) {
        rootObservation.update({
          level: "ERROR",
          statusMessage: err instanceof Error ? err.message : String(err),
        });
        rootObservation.end();

        try {
          await flush();
        } catch (flushErr) {
          console.warn("Failed to flush errored Langfuse trace", flushErr);
        }

        return new Response(
          JSON.stringify({
            error:
              err instanceof Error ? err.message : "Failed to classify text",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
    },
    {
      endOnExit: false,
    },
  );
};

export const POST = handler;

export const maxDuration = 60;
