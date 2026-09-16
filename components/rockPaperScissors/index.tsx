"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
// import { DemoTraceLink } from "@/components/demoTraceLink"; // temporarily disabled
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcwIcon } from "lucide-react";
import {
  MOVES,
  OPPONENT_IDS,
  tally,
  type Move,
  type OpponentId,
  type RoundRecord,
} from "./game";
import type { RoundResultPayload, StreamChunk } from "./apiHandler";

const TIME_CAP_MS = 6_000;
const DEFAULT_OPPONENT: OpponentId = "gpt-6-astra";

const OPPONENTS: Record<OpponentId, { label: string; vendor: string }> = {
  "gpt-6-astra": { label: "GPT-6 Astra", vendor: "OpenAI" },
  "fable-5-1": { label: "Claude Fable 5.1", vendor: "Anthropic" },
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

type Phase = "choose-move" | "thinking" | "reveal";

type RockPaperScissorsProps = HTMLAttributes<HTMLDivElement>;

const newGameId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const RockPaperScissors = ({
  className,
  ...props
}: RockPaperScissorsProps) => {
  const [phase, setPhase] = useState<Phase>("choose-move");
  const [opponent, setOpponent] = useState<OpponentId>(DEFAULT_OPPONENT);
  const [gameId, setGameId] = useState<string>(newGameId);
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
  const opponentMeta = OPPONENTS[opponent];

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

  const resetGame = (nextOpponent: OpponentId = opponent) => {
    setOpponent(nextOpponent);
    setGameId(newGameId());
    setHistory([]);
    setResult(null);
    setReasoning("");
    setError(null);
    setPendingUserMove(null);
    setPhase("choose-move");
  };

  const nextRound = () => {
    setResult(null);
    setReasoning("");
    setError(null);
    setPendingUserMove(null);
    setPhase("choose-move");
  };

  const playMove = async (move: Move) => {
    if (!userId || phase === "thinking") return;

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

  const roundNumber = history.length + (phase === "reveal" ? 0 : 1);

  return (
    <div className={cn("min-h-[440px]", className)} {...props}>
      <div className="relative flex flex-col rounded-[2px] border border-line-structure bg-surface-bg p-5 corner-box-corners">
        {/* Header: picker left, scoreboard center, new game right */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div className="flex justify-start">
            <Select
              value={opponent}
              onValueChange={(value) => resetGame(value as OpponentId)}
              disabled={phase === "thinking"}
            >
              <SelectTrigger
                aria-label="Opponent model"
                className="h-7 w-auto gap-1 rounded-[2px] border-line-structure bg-surface-bg px-2 text-xs text-text-secondary"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {OPPONENT_IDS.map((id) => (
                  <SelectItem key={id} value={id} className="text-xs">
                    {OPPONENTS[id].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-center">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Round {roundNumber}
            </div>
            <div className="mt-1 flex items-baseline justify-center gap-3 text-2xl font-semibold tabular-nums text-text-primary">
              <span>
                <span className="mr-2 text-xs font-medium uppercase tracking-[0.12em] text-text-tertiary">
                  You
                </span>
                {score.user}
              </span>
              <span className="text-text-disabled">:</span>
              <span>
                {score.model}
                <span className="ml-2 text-xs font-medium uppercase tracking-[0.12em] text-text-tertiary">
                  {opponentMeta.label}
                </span>
              </span>
            </div>
            {score.draws > 0 && (
              <div className="mt-0.5 text-xs text-text-tertiary">
                {score.draws} draw{score.draws === 1 ? "" : "s"}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => resetGame()}
                disabled={phase === "thinking"}
                title="New game"
                aria-label="New game"
                className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-[2px] border border-line-structure px-2 text-xs text-text-secondary transition-colors hover:border-line-cta hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcwIcon className="size-3.5" />
                <span className="hidden sm:inline">New game</span>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 mt-6 flex flex-col">
          {phase === "choose-move" && (
            <div className="flex flex-col">
              {error && (
                <div className="mb-4 rounded-[2px] bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {MOVES.map((move) => (
                  <button
                    key={move}
                    type="button"
                    onClick={() => playMove(move)}
                    className="flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-[2px] border border-line-structure bg-surface-bg transition-colors hover:border-line-cta hover:bg-surface-1"
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
            <div className="flex flex-col gap-3">
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
                  label={opponentMeta.label}
                  move={result?.modelMove ?? null}
                  revealed={phase === "reveal"}
                  highlight={result?.outcome === "model_won"}
                  thinking={phase === "thinking"}
                />
              </div>

              {/* Reasoning */}
              <div className="rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a]">
                <div className="flex items-center justify-between border-b border-line-structure px-3 py-1.5">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                    {phase === "thinking" && <Loader size={12} />}
                    Reasoning
                  </div>
                  <div className="font-mono text-[11px] tabular-nums text-text-tertiary">
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
                  className="max-h-32 min-h-[64px] overflow-y-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-5 text-text-secondary"
                >
                  {reasoning ||
                    (phase === "thinking" ? "…" : "No reasoning returned.")}
                  {phase === "thinking" && (
                    <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-text-tertiary align-middle" />
                  )}
                </pre>
              </div>

              {phase === "reveal" && result && (
                <div className="rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a]">
                  <div className="flex items-center justify-between border-b border-line-structure px-3 py-1.5">
                    <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                      Result
                    </div>
                    <div className="font-mono text-[11px] tabular-nums text-text-tertiary">
                      {MOVE_LABEL[result.userMove]} vs{" "}
                      {MOVE_LABEL[result.modelMove]}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-4 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div>
                      <div className="text-base font-semibold text-text-primary">
                        {result.outcome === "draw"
                          ? "Draw"
                          : result.outcome === "user_won"
                            ? "You win this round"
                            : `${opponentMeta.label} wins this round`}
                      </div>
                      <div className="mt-0.5 text-xs text-text-tertiary">
                        {result.fallbackReason === "timeout"
                          ? "Out of time. Fallback move played."
                          : result.fallbackReason === "no_tool_call"
                            ? "No move committed. Fallback move played."
                            : result.predictedUserMove
                              ? `It predicted ${result.predictedUserMove}: ${
                                  result.predictionCorrect ? "correct" : "wrong"
                                }.`
                              : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={nextRound}
                        autoFocus
                        className="inline-flex items-center rounded-[2px] border border-line-structure bg-text-primary px-4 py-2 text-sm font-medium text-surface-bg shadow-sm transition-opacity hover:opacity-90"
                      >
                        New round
                      </button>
                      {/* Temporarily disabled: trace link (traces are not shared publicly right now)
                      <DemoTraceLink
                        traceUrl={result.traceUrl}
                        source="rock_paper_scissors"
                        label="Show trace"
                      />
                      */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="relative z-10 mt-5 text-center text-xs italic text-muted-foreground">
          One trace per round, one session per game.
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
  thinking,
}: {
  label: string;
  move: Move | null;
  revealed: boolean;
  highlight?: boolean;
  thinking?: boolean;
}) => (
  <div
    className={cn(
      "flex min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-[2px] border bg-surface-bg transition-colors",
      highlight ? "border-line-cta bg-surface-1" : "border-line-structure",
    )}
  >
    <span
      className={cn("text-4xl", thinking && "animate-pulse")}
      aria-hidden="true"
    >
      {revealed && move ? MOVE_EMOJI[move] : "❔"}
    </span>
    <span className="text-xs text-text-tertiary">{label}</span>
    <span className="text-sm font-medium text-text-primary">
      {revealed && move ? MOVE_LABEL[move] : "…"}
    </span>
  </div>
);

const HistoryStrip = ({ history }: { history: RoundRecord[] }) => (
  <div className="mt-5">
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
          <span className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            you
          </span>
          <span aria-hidden="true">{MOVE_EMOJI[r.userMove]}</span>
          <span className="text-text-disabled">/</span>
          <span aria-hidden="true">{MOVE_EMOJI[r.modelMove]}</span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            model
          </span>
        </span>
      ))}
    </div>
  </div>
);
