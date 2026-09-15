import { anthropic, type AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { openai, type OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { streamText, tool, type LanguageModel } from "ai";
import { z } from "zod";
import {
  observe,
  propagateAttributes,
  startObservation,
  startActiveObservation,
  setActiveTraceIO,
  setActiveTraceAsPublic,
  getActiveTraceId,
} from "@langfuse/tracing";
import { trace } from "@opentelemetry/api";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  buildDemoTraceRedirectUrl,
  demoProjectLangfuseClient,
} from "@/lib/demo-public-trace";
import {
  MOVES,
  fallbackMove,
  isMove,
  isOpponentId,
  resolveRound,
  sanitizeHistory,
  tally,
  type Move,
  type OpponentId,
  type RoundOutcome,
  type RoundRecord,
} from "./game";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

export const MODEL_TIME_CAP_MS = 6_000;

type ProviderOptions = NonNullable<
  Parameters<typeof streamText>[0]["providerOptions"]
>;

type Opponent = {
  label: string;
  modelId: string;
  model: () => LanguageModel;
  providerOptions: ProviderOptions;
};

const OPPONENTS: Record<OpponentId, Opponent> = {
  "fable-5-1": {
    label: "Claude Fable 5.1",
    modelId: "claude-fable-5-1",
    model: () => anthropic("claude-fable-5-1"),
    providerOptions: {
      anthropic: {
        thinking: { type: "adaptive", display: "summarized" },
        effort: "low",
      } satisfies AnthropicProviderOptions,
    },
  },
  "gpt-6-astra": {
    label: "GPT-6 Astra",
    modelId: "gpt-6-astra",
    model: () => openai("gpt-6-astra"),
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        reasoningSummary: "auto",
      } satisfies OpenAIResponsesProviderOptions,
    },
  },
};

const playMoveInputSchema = z.object({
  move: z.enum(MOVES).describe("Your move"),
  predicted_user_move: z
    .enum(MOVES)
    .describe("The move you predict the human plays this round"),
  taunt: z
    .string()
    .max(120)
    .describe("One playful line for the human, max 12 words"),
});
type PlayMoveInput = z.infer<typeof playMoveInputSchema>;

const playMoveTool = tool({
  description:
    "Play your move for this round. Call exactly once. Include the move you predict the human will play and a short playful taunt.",
  inputSchema: playMoveInputSchema,
});

export type RoundResultPayload = {
  type: "result";
  round: number;
  userMove: Move;
  modelMove: Move;
  predictedUserMove: Move | null;
  predictionCorrect: boolean | null;
  outcome: RoundOutcome;
  taunt: string | null;
  timedOut: boolean;
  responseTimeMs: number;
  opponent: OpponentId;
  traceId: string | null;
  traceUrl: string;
};

export type StreamChunk =
  | { type: "reasoning"; text: string }
  | RoundResultPayload
  | { type: "error"; message: string };

const encoder = new TextEncoder();
const writeChunk = (
  controller: ReadableStreamDefaultController<Uint8Array>,
  chunk: StreamChunk,
) => controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const extractMoveFromText = (text: string): Move | null => {
  const lower = text.toLowerCase();
  let best: { move: Move; index: number } | null = null;
  for (const move of MOVES) {
    const index = lower.lastIndexOf(move);
    if (index !== -1 && (!best || index > best.index)) {
      best = { move, index };
    }
  }
  return best?.move ?? null;
};

const handler = async (req: Request) => {
  const { success } = rateLimit(req, { limit: 30, windowMs: 60_000 });
  if (!success) {
    return json({ error: "Rate limit exceeded. Please try again later." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const { opponent, userMove, gameId, userId } = body;
  if (!isOpponentId(opponent)) {
    return json({ error: "Unknown opponent." }, 400);
  }
  if (!isMove(userMove)) {
    return json({ error: "Move must be rock, paper, or scissors." }, 400);
  }
  if (typeof gameId !== "string" || gameId.length === 0 || gameId.length > 64) {
    return json({ error: "gameId is required." }, 400);
  }
  if (typeof userId !== "string" || userId.length === 0 || userId.length > 64) {
    return json({ error: "userId is required." }, 400);
  }

  const history: RoundRecord[] = sanitizeHistory(body.history);
  const round = history.length + 1;
  const scoreBefore = tally(history);
  const config = OPPONENTS[opponent];

  return propagateAttributes(
    {
      traceName: "rps-round",
      sessionId: gameId,
      userId,
      tags: ["rock-paper-scissors", `model:${opponent}`],
      metadata: {
        round: String(round),
        opponent,
        opponentModel: config.modelId,
        scoreBefore: `${scoreBefore.user}-${scoreBefore.model}`,
      },
    },
    async () => {
      const traceId = getActiveTraceId() ?? null;
      const rootSpan = trace.getActiveSpan();
      const rootObservationId = rootSpan?.spanContext().spanId ?? null;

      setActiveTraceIO({
        input: { round, userMove, opponent, history },
      });

      // The human commits first. The model never sees this value.
      startObservation(
        "user-picked",
        { input: { move: userMove }, metadata: { round } },
        { asType: "event" },
      );

      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const startedAt = Date.now();
          let modelMove: Move | null = null;
          let predictedUserMove: Move | null = null;
          let taunt: string | null = null;
          let timedOut = false;
          let reasoningText = "";
          let plainText = "";

          try {
            const result = streamText({
              model: config.model(),
              system: SYSTEM_PROMPT,
              prompt: buildUserPrompt({ round, history }),
              tools: { play_move: playMoveTool },
              toolChoice: "auto",
              maxOutputTokens: 1_500,
              providerOptions: config.providerOptions,
              abortSignal: AbortSignal.timeout(MODEL_TIME_CAP_MS),
              telemetry: {
                functionId: "rps-model-turn",
              },
              onError: () => {
                // Handled via fullStream below; keep AI SDK from logging noisily.
              },
            });

            for await (const part of result.fullStream) {
              switch (part.type) {
                case "reasoning-delta":
                  reasoningText += part.text;
                  writeChunk(controller, {
                    type: "reasoning",
                    text: part.text,
                  });
                  break;
                case "text-delta":
                  plainText += part.text;
                  break;
                case "tool-call": {
                  if (part.toolName === "play_move") {
                    const input = part.input as Partial<PlayMoveInput>;
                    if (isMove(input.move)) modelMove = input.move;
                    if (isMove(input.predicted_user_move)) {
                      predictedUserMove = input.predicted_user_move;
                    }
                    taunt = input.taunt?.trim() || null;
                  }
                  break;
                }
                case "abort":
                  timedOut = true;
                  break;
                case "error":
                  if (
                    part.error instanceof Error &&
                    (part.error.name === "AbortError" ||
                      part.error.name === "TimeoutError")
                  ) {
                    timedOut = true;
                  } else {
                    throw part.error;
                  }
                  break;
                default:
                  break;
              }
            }
          } catch (err) {
            if (
              err instanceof Error &&
              (err.name === "AbortError" || err.name === "TimeoutError")
            ) {
              timedOut = true;
            } else {
              console.error("rps model turn failed", err);
              writeChunk(controller, {
                type: "error",
                message:
                  err instanceof Error ? err.message : "Model call failed.",
              });
              controller.close();
              rootSpan?.end();
              after(async () => await flush());
              return;
            }
          }

          const responseTimeMs = Date.now() - startedAt;

          if (!modelMove && plainText) {
            modelMove = extractMoveFromText(plainText);
          }
          if (!modelMove) {
            modelMove = fallbackMove(round);
            startObservation(
              "fallback-move",
              {
                input: {
                  reason: timedOut
                    ? `model did not answer within ${MODEL_TIME_CAP_MS}ms`
                    : "model did not call play_move",
                },
                output: { move: modelMove },
                level: "WARNING",
              },
              { asType: "event" },
            );
          }

          const outcome = await startActiveObservation(
            "resolve-round",
            async (span) => {
              const resolved = resolveRound(userMove, modelMove as Move);
              span.update({
                input: { userMove, modelMove },
                output: { outcome: resolved },
              });
              startObservation(
                resolved === "draw"
                  ? "draw"
                  : resolved === "user_won"
                    ? "user-won"
                    : "model-won",
                {
                  input: { userMove, modelMove },
                  output: { outcome: resolved },
                },
                { asType: "event" },
              );
              return resolved;
            },
          );

          const predictionCorrect =
            predictedUserMove === null ? null : predictedUserMove === userMove;

          if (traceId) {
            const scores: Array<{
              name: string;
              value: number | string;
              dataType: "NUMERIC" | "BOOLEAN" | "CATEGORICAL";
              comment?: string;
            }> = [
              {
                name: "round_outcome",
                value: outcome,
                dataType: "CATEGORICAL",
              },
              {
                name: "timed_out",
                value: timedOut ? 1 : 0,
                dataType: "BOOLEAN",
              },
              {
                name: "response_time_ms",
                value: responseTimeMs,
                dataType: "NUMERIC",
              },
            ];
            if (predictionCorrect !== null) {
              scores.push({
                name: "prediction_correct",
                value: predictionCorrect ? 1 : 0,
                dataType: "BOOLEAN",
                comment: `predicted ${predictedUserMove}, human played ${userMove}`,
              });
            }
            for (const score of scores) {
              demoProjectLangfuseClient.score.create({ traceId, ...score });
            }
          }

          setActiveTraceIO({
            output: {
              round,
              userMove,
              modelMove,
              predictedUserMove,
              outcome,
              taunt,
              timedOut,
              responseTimeMs,
              reasoningSummary: reasoningText || undefined,
            },
          });
          setActiveTraceAsPublic();
          rootSpan?.end();

          const traceUrl = buildDemoTraceRedirectUrl({
            traceId,
            observationId: rootObservationId,
          });

          writeChunk(controller, {
            type: "result",
            round,
            userMove,
            modelMove,
            predictedUserMove,
            predictionCorrect,
            outcome,
            taunt,
            timedOut,
            responseTimeMs,
            opponent,
            traceId,
            traceUrl,
          });
          controller.close();

          after(async () => {
            await Promise.allSettled([
              flush(),
              demoProjectLangfuseClient.flush(),
            ]);
          });
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    },
  );
};

export const POST = observe(handler, {
  name: "rps-round",
  endOnExit: false, // ended once the stream has finished
});

export const maxDuration = 30;
