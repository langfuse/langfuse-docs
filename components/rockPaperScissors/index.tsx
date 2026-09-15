"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { DemoTraceLink } from "@/components/demoTraceLink";
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import { RotateCcwIcon, ArrowLeftIcon } from "lucide-react";
import {
  MOVES,
  tally,
  type Move,
  type OpponentId,
  type RoundRecord,
} from "./game";
import type { RoundResultPayload, StreamChunk } from "./apiHandler";

const TIME_CAP_MS = 6_000;

const OPPONENTS: Record<
  OpponentId,
  { label: string; vendor: string; blurb: string }
> = {
  "fable-5-1": {
    label: "Claude Fable 5.1",
    vendor: "Anthropic",
    blurb: "Adaptive thinking, summarized reasoning.",
  },
  "gpt-6-astra": {
    label: "GPT-6 Astra",
    vendor: "OpenAI",
    blurb: "Reasoning model with streamed summaries.",
  },
};

const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const MOVE_LABEL: Record<Move, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

type Phase = "choose-model" | "choose-move" | "thinking" | "reveal";

type RockPaperScissorsProps = HTMLAttributes<HTMLDivElement>;

export const RockPaperScissors = ({
  className,
  ...props
}: RockPaperScissorsProps) => {
  const [phase, setPhase] = useState<Phase>("choose-model");
  const [opponent, setOpponent] = useState<OpponentId | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [history, setHistory] = useState<RoundRecord[]>([]);
  const [pendingUserMove, setPendingUserMove] = useState<Move | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [result, setResult] = useState<RoundResultPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const reasoningRef = useRef<HTMLPreElement>(null);

  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedNanoId({ key: "rps-user-id", prefix: "u-" });
  }, []);

  const score = useMemo(() => tally(history), [history]);

  // Progress timer while the model is thinking.
  useEffect(() => {
    if (phase !== "thinking") return;
    const startedAt = Date.now();
    setElapsedMs(0);
    const interval = window.setInterval(() => {
      setElapsedMs(Math.min(Date.now() - startedAt, TIME_CAP_MS));
    }, 100);
    return () => window.clearInterval(interval);
  }, [phase]);

  // Keep the reasoning panel scrolled to the newest text.
  useEffect(() => {
    const el = reasoningRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [reasoning]);

  const startGame = (id: OpponentId) => {
    setOpponent(id);
    setGameId(crypto.randomUUID());
    setHistory([]);
    setResult(null);
    setReasoning("");
    setError(null);
    setPhase("choose-move");
  };

  const resetToModelSelect = () => {
    setPhase("choose-model");
    setOpponent(null);
    setGameId(null);
    setHistory([]);
    setResult(null);
    setReasoning("");
    setError(null);
  };

  const nextRound = () => {
    setResult(null);
    setReasoning("");
    setError(null);
    setPendingUserMove(null);
    setPhase("choose-move");
  };

  const playMove = async (move: Move) => {
    if (!opponent || !gameId || !userId || phase === "thinking") return;

    setPendingUserMove(move);
    setReasoning("");
    setResult(null);
    setError(null);
    setPhase("thinking");

    try {
      const res = await fetch("/api/rock-paper-scissors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opponent,
          userMove: move,
          gameId,
          userId,
          history,
        }),
      });

      if (!res.ok || !res.body) {
        let message = `Request failed (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalResult: RoundResultPayload | null = null;

      const handleLine = (line: string) => {
        if (!line.trim()) return;
        const chunk = JSON.parse(line) as StreamChunk;
        if (chunk.type === "reasoning") {
          setReasoning((prev) => prev + chunk.text);
        } else if (chunk.type === "result") {
          finalResult = chunk;
        } else if (chunk.type === "error") {
          throw new Error(chunk.message);
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) handleLine(line);
      }
      if (buffer) handleLine(buffer);

      if (!finalResult) {
        throw new Error("The game ended without a result.");
      }

      const round: RoundResultPayload = finalResult;
      setResult(round);
      setHistory((prev) => [
        ...prev,
        {
          round: round.round,
          userMove: round.userMove,
          modelMove: round.modelMove,
          predictedUserMove: round.predictedUserMove,
          outcome: round.outcome,
        },
      ]);
      setPhase("reveal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("choose-move");
    }
  };

  const opponentMeta = opponent ? OPPONENTS[opponent] : null;

  return (
    <div className={cn("h-[62vh] min-h-[520px]", className)} {...props}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2px] border border-line-structure bg-surface-bg p-5 corner-box-corners">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              {phase === "choose-model"
                ? "Pick your opponent"
                : `Round ${history.length + (phase === "reveal" ? 0 : 1)} · vs ${opponentMeta?.label}`}
            </div>
            {phase !== "choose-model" && (
              <div className="mt-1 text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">
                  You {score.user}
                </span>
                <span className="mx-2 text-text-disabled">:</span>
                <span className="font-semibold text-text-primary">
                  {score.model} Model
                </span>
                {score.draws > 0 && (
                  <span className="ml-2 text-xs text-text-tertiary">
                    ({score.draws} draw{score.draws === 1 ? "" : "s"})
                  </span>
                )}
              </div>
            )}
          </div>
          {phase !== "choose-model" && (
            <button
              type="button"
              onClick={resetToModelSelect}
              disabled={phase === "thinking"}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[2px] border border-line-structure px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:border-line-cta hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeftIcon className="size-3.5" />
              New game
            </button>
          )}
        </div>

        {/* Body */}
        <div className="relative z-10 mt-5 flex flex-1 flex-col overflow-y-auto">
          {phase === "choose-model" && (
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              {(Object.keys(OPPONENTS) as OpponentId[]).map((id) => {
                const meta = OPPONENTS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => startGame(id)}
                    className="group flex min-h-[140px] flex-col justify-between rounded-[2px] border border-line-structure bg-surface-bg p-4 text-left transition-colors hover:border-line-cta hover:bg-surface-1"
                  >
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                      {meta.vendor}
                    </div>
                    <div>
                      <div className="text-base font-semibold leading-tight text-text-primary">
                        {meta.label}
                      </div>
                      <div className="mt-2 text-xs leading-5 text-text-tertiary">
                        {meta.blurb}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {phase === "choose-move" && (
            <div className="flex flex-1 flex-col">
              {error && (
                <div className="mb-4 rounded-[2px] bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <p className="text-sm text-text-secondary">
                Pick your move. The model commits after you, using only the
                history of previous rounds.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {MOVES.map((move) => (
                  <button
                    key={move}
                    type="button"
                    onClick={() => playMove(move)}
                    className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[2px] border border-line-structure bg-surface-bg transition-colors hover:border-line-cta hover:bg-surface-1"
                  >
                    <span className="text-4xl" aria-hidden="true">
                      {MOVE_EMOJI[move]}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {MOVE_LABEL[move]}
                    </span>
                  </button>
                ))}
              </div>
              {history.length > 0 && <HistoryStrip history={history} />}
            </div>
          )}

          {(phase === "thinking" || phase === "reveal") && (
            <div className="flex flex-1 flex-col gap-4">
              {/* Reasoning panel */}
              <div className="rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a]">
                <div className="flex items-center justify-between border-b border-line-structure px-3 py-2">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                    {phase === "thinking" && <Loader size={12} />}
                    {opponentMeta?.label} is reasoning
                  </div>
                  <div className="font-mono text-[11px] text-text-tertiary">
                    {phase === "thinking"
                      ? `${(elapsedMs / 1000).toFixed(1)}s / 6.0s`
                      : result
                        ? `${(result.responseTimeMs / 1000).toFixed(1)}s`
                        : null}
                  </div>
                </div>
                {phase === "thinking" && (
                  <div className="h-0.5 w-full bg-line-structure/40">
                    <div
                      className="h-full bg-line-cta transition-[width] duration-100"
                      style={{
                        width: `${Math.min((elapsedMs / TIME_CAP_MS) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
                <pre
                  ref={reasoningRef}
                  className="max-h-40 min-h-[88px] overflow-y-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-5 text-text-secondary"
                >
                  {reasoning ||
                    (phase === "thinking"
                      ? "…"
                      : "The model did not return a reasoning summary for this round.")}
                  {phase === "thinking" && (
                    <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-text-tertiary align-middle" />
                  )}
                </pre>
              </div>

              {/* Reveal */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <MoveCard
                  label="You"
                  move={pendingUserMove}
                  revealed
                  highlight={result?.outcome === "user_won"}
                />
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
                  vs
                </div>
                <MoveCard
                  label={opponentMeta?.label ?? "Model"}
                  move={result?.modelMove ?? null}
                  revealed={phase === "reveal"}
                  highlight={result?.outcome === "model_won"}
                />
              </div>

              {phase === "reveal" && result && (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-text-primary">
                      {result.outcome === "draw"
                        ? "Draw"
                        : result.outcome === "user_won"
                          ? "You win this round"
                          : `${opponentMeta?.label} wins this round`}
                    </div>
                    <div className="mt-1 text-xs text-text-tertiary">
                      {result.timedOut
                        ? "The model ran out of time, so a fallback move was played."
                        : result.predictedUserMove
                          ? `It predicted you would play ${result.predictedUserMove}${
                              result.predictionCorrect
                                ? " and was right."
                                : ", but you didn't."
                            }`
                          : null}
                    </div>
                    {result.taunt && !result.timedOut && (
                      <div className="mt-2 text-sm italic text-text-secondary">
                        “{result.taunt}”
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={nextRound}
                      className="inline-flex items-center gap-2 rounded-[2px] border border-line-structure bg-text-primary px-4 py-2 text-sm font-medium text-surface-bg shadow-sm transition-opacity hover:opacity-90"
                    >
                      <RotateCcwIcon className="size-4" />
                      Play next round
                    </button>
                    <DemoTraceLink
                      traceUrl={result.traceUrl}
                      source="rock_paper_scissors"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="relative z-10 mt-4 text-center text-xs italic text-muted-foreground">
          Each round is one trace, each game is one session in the public
          example project. Scores track who won, whether the model predicted
          your move, and response time.
        </p>
      </div>
    </div>
  );
};

const MoveCard = ({
  label,
  move,
  revealed,
  highlight,
}: {
  label: string;
  move: Move | null;
  revealed: boolean;
  highlight?: boolean;
}) => (
  <div
    className={cn(
      "flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[2px] border bg-surface-bg transition-colors",
      highlight ? "border-line-cta bg-surface-1" : "border-line-structure",
    )}
  >
    <span className="text-4xl" aria-hidden="true">
      {revealed && move ? MOVE_EMOJI[move] : "❔"}
    </span>
    <span className="text-xs text-text-tertiary">{label}</span>
    <span className="text-sm font-medium text-text-primary">
      {revealed && move ? MOVE_LABEL[move] : "…"}
    </span>
  </div>
);

const HistoryStrip = ({ history }: { history: RoundRecord[] }) => (
  <div className="mt-6">
    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
      Previous rounds
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      {history.map((r) => (
        <span
          key={r.round}
          title={`Round ${r.round}: you ${r.userMove}, model ${r.modelMove}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 font-mono text-xs",
            r.outcome === "user_won"
              ? "border-line-cta text-text-primary"
              : r.outcome === "model_won"
                ? "border-line-structure text-text-tertiary"
                : "border-line-structure text-text-secondary",
          )}
        >
          <span aria-hidden="true">{MOVE_EMOJI[r.userMove]}</span>
          <span className="text-text-disabled">/</span>
          <span aria-hidden="true">{MOVE_EMOJI[r.modelMove]}</span>
        </span>
      ))}
    </div>
  </div>
);
