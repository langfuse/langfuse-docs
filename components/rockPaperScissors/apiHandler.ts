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
import { context, trace } from "@opentelemetry/api";
import { after } from "next/server";
import { flush } from "@/src/instrumentation";
import { rateLimit } from "@/lib/rateLimit";
import {
  buildDemoTraceRedirectUrl,
  demoProjectLangfuseClient,
} from "@/lib/demo-public-trace";
import {
  MAX_HISTORY_ROUNDS,
  MOVES,
  fallbackMove,
  isMove,
  isOpponentId,
  resolveRound,
  sanitizeHistory,
  tally,
  type FallbackReason,
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
        reasoningSummary: "detailed",
      } satisfies OpenAIResponsesProviderOptions,
    },
  },
};

const playMoveInputSchema = z.object({
  move: z.enum(MOVES).describe("Your move"),
  predicted_user_move: z
    .enum(MOVES)
    .describe("The move you predict the human plays this round"),
});
type PlayMoveInput = z.infer<typeof playMoveInputSchema>;

const playMoveTool = tool({
  description:
    "Play your move for this round. Call exactly once. Include the move you predict the human will play.",
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
  /** Set when the server played a scripted move instead of the model. */
  fallbackReason: FallbackReason | null;
  /** True when the model did not commit a move within the time cap. */
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

const GENERIC_ERROR_MESSAGE =
  "The model did not respond. Please try again in a moment.";

const encoder = new TextEncoder();

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const isAbortError = (err: unknown) =>
  err instanceof Error &&
  (err.name === "AbortError" || err.name === "TimeoutError");

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

  // The full history drives the round counter and the score; only the most
  // recent rounds are shown to the model.
  const fullHistory: RoundRecord[] = sanitizeHistory(body.history);
  const round = fullHistory.length + 1;
  const history = fullHistory.slice(-MAX_HISTORY_ROUNDS);
  const scoreBefore = tally(fullHistory);
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
      // Captured so the streaming body keeps running inside this trace even
      // after the Response has been returned to Next.js.
      const traceContext = context.active();

      setActiveTraceIO({
        input: { round, userMove, opponent, history },
      });

      // The human commits first. The model never sees this value.
      startObservation(
        "user-picked",
        { input: { move: userMove }, metadata: { round } },
        { asType: "event" },
      );

      // Aborted when the visitor disconnects or the time cap is hit.
      const abortController = new AbortController();
      const timeout = setTimeout(
        () =>
          abortController.abort(new DOMException("Time cap", "TimeoutError")),
        MODEL_TIME_CAP_MS,
      );
      const onRequestAbort = () =>
        abortController.abort(new DOMException("Client left", "AbortError"));
      req.signal.addEventListener("abort", onRequestAbort, { once: true });

      const finalize = async () => {
        clearTimeout(timeout);
        req.signal.removeEventListener("abort", onRequestAbort);
        rootSpan?.end();
        await Promise.allSettled([flush(), demoProjectLangfuseClient.flush()]);
      };

      const run = async (
        controller: ReadableStreamDefaultController<Uint8Array>,
      ) => {
        let closed = false;
        const write = (chunk: StreamChunk) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
          } catch {
            closed = true; // client went away
          }
        };
        const close = () => {
          if (closed) return;
          closed = true;
          try {
            controller.close();
          } catch {
            // already closed by cancellation
          }
        };

        const startedAt = Date.now();
        let modelMove: Move | null = null;
        let predictedUserMove: Move | null = null;
        let aborted = false;
        let reasoningText = "";
        let plainText = "";
        let sawReasoningSummary = false;

        try {
          try {
            const result = streamText({
              model: config.model(),
              system: SYSTEM_PROMPT,
              prompt: buildUserPrompt({ round, history }),
              tools: { play_move: playMoveTool },
              toolChoice: "auto",
              maxOutputTokens: 1_500,
              providerOptions: config.providerOptions,
              abortSignal: abortController.signal,
              telemetry: {
                functionId: "rps-model-turn",
              },
              onError: () => {
                // Surfaced through fullStream below.
              },
            });

            for await (const part of result.fullStream) {
              switch (part.type) {
                case "reasoning-delta":
                  sawReasoningSummary = true;
                  reasoningText += part.text;
                  write({ type: "reasoning", text: part.text });
                  break;
                case "text-delta": {
                  // Providers often return an empty reasoning summary at low
                  // effort, so the model also narrates its thinking as plain
                  // text before calling the tool. Stream that too.
                  const separator =
                    plainText.length === 0 &&
                    sawReasoningSummary &&
                    !reasoningText.endsWith("\n")
                      ? "\n\n"
                      : "";
                  plainText += part.text;
                  write({ type: "reasoning", text: separator + part.text });
                  break;
                }
                case "tool-call": {
                  if (part.toolName === "play_move" && modelMove === null) {
                    const input = part.input as Partial<PlayMoveInput>;
                    if (isMove(input.move)) modelMove = input.move;
                    if (isMove(input.predicted_user_move)) {
                      predictedUserMove = input.predicted_user_move;
                    }
                  }
                  break;
                }
                case "abort":
                  aborted = true;
                  break;
                case "error":
                  if (isAbortError(part.error)) {
                    aborted = true;
                  } else {
                    throw part.error;
                  }
                  break;
                default:
                  break;
              }
            }
          } catch (err) {
            if (isAbortError(err)) {
              aborted = true;
            } else {
              console.error("rps model turn failed", err);
              write({ type: "error", message: GENERIC_ERROR_MESSAGE });
              close();
              return;
            }
          }

          if (req.signal.aborted) {
            // Visitor left mid-round. Nothing to resolve or score.
            close();
            return;
          }

          const responseTimeMs = Date.now() - startedAt;

          // A completed play_move call always wins over a late abort. Only
          // when the model never committed a move do we play the scripted
          // fallback. Free text is never parsed for a move: the model's prose
          // names the predicted human move as well as its own.
          let fallbackReason: FallbackReason | null = null;
          if (modelMove === null) {
            fallbackReason = aborted ? "timeout" : "no_tool_call";
            modelMove = fallbackMove(round);
            predictedUserMove = null;
            startObservation(
              "fallback-move",
              {
                input: {
                  reason:
                    fallbackReason === "timeout"
                      ? `model did not commit a move within ${MODEL_TIME_CAP_MS}ms`
                      : "model finished without calling play_move",
                },
                output: { move: modelMove },
                level: "WARNING",
              },
              { asType: "event" },
            );
          }
          const timedOut = fallbackReason === "timeout";
          const committedMove: Move = modelMove;

          const outcome = await startActiveObservation(
            "resolve-round",
            async (span) => {
              const resolved = resolveRound(userMove, committedMove);
              span.update({
                input: { userMove, modelMove: committedMove },
                output: { outcome: resolved },
              });
              startObservation(
                resolved === "draw"
                  ? "draw"
                  : resolved === "user_won"
                    ? "user-won"
                    : "model-won",
                {
                  input: { userMove, modelMove: committedMove },
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
              modelMove: committedMove,
              predictedUserMove,
              outcome,
              fallbackReason,
              timedOut,
              responseTimeMs,
              reasoningSummary: reasoningText || undefined,
              visibleReasoning: plainText || undefined,
            },
          });
          setActiveTraceAsPublic();

          write({
            type: "result",
            round,
            userMove,
            modelMove: committedMove,
            predictedUserMove,
            predictionCorrect,
            outcome,
            fallbackReason,
            timedOut,
            responseTimeMs,
            opponent,
            traceId,
            traceUrl: buildDemoTraceRedirectUrl({
              traceId,
              observationId: rootObservationId,
            }),
          });
          close();
        } finally {
          after(finalize);
        }
      };

      const stream = new ReadableStream<Uint8Array>({
        start: (controller) =>
          context.with(traceContext, () => run(controller)),
        cancel: () => {
          abortController.abort(new DOMException("Client left", "AbortError"));
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
