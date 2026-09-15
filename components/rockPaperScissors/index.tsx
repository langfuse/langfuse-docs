"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { DemoTraceLink } from "@/components/demoTraceLink";
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
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
              Round {roundNumber}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">
                You {score.user}
              </span>
              <span className="mx-1.5 text-text-disabled">:</span>
              <span className="font-semibold text-text-primary">
                {score.model} Model
              </span>
              {score.draws > 0 && (
                <span className="ml-2 text-xs text-text-tertiary">
                  {score.draws} draw{score.draws === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={opponent}
              onValueChange={(value) => resetGame(value as OpponentId)}
              disabled={phase === "thinking"}
            >
              <SelectTrigger
                aria-label="Opponent model"
                className="h-8 w-auto min-w-[168px] rounded-[2px] border-line-structure bg-surface-bg text-xs text-text-primary"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {OPPONENT_IDS.map((id) => (
                  <SelectItem key={id} value={id} className="text-xs">
                    {OPPONENTS[id].label}
                    <span className="ml-1.5 text-text-tertiary">
                      · {OPPONENTS[id].vendor}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => resetGame()}
                disabled={phase === "thinking"}
                title="Start a new game (new session)"
                className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[2px] border border-line-structure px-2.5 text-xs text-text-secondary transition-colors hover:border-line-cta hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcwIcon className="size-3.5" />
                New game
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 mt-5 flex flex-col">
          {phase === "choose-move" && (
            <div className="flex flex-col">
              {error && (
                <div className="mb-4 rounded-[2px] bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <p className="text-sm text-text-secondary">
                Pick your move. {opponentMeta.label} commits after you, using
                only the history of previous rounds.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
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
            <div className="flex flex-col gap-4">
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
                  label={opponentMeta.label}
                  move={result?.modelMove ?? null}
                  revealed={phase === "reveal"}
                  highlight={result?.outcome === "model_won"}
                  thinking={phase === "thinking"}
                />
              </div>

              {phase === "reveal" && result && (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div>
                    <div className="text-lg font-semibold text-text-primary">
                      {result.outcome === "draw"
                        ? "Draw"
                        : result.outcome === "user_won"
                          ? "You win this round"
                          : `${opponentMeta.label} wins this round`}
                    </div>
                    <div className="mt-1 text-xs text-text-tertiary">
                      {result.fallbackReason === "timeout"
                        ? "The model did not commit a move within 6 seconds, so a scripted fallback move was played."
                        : result.fallbackReason === "no_tool_call"
                          ? "The model finished without choosing a move, so a scripted fallback move was played."
                          : result.predictedUserMove
                            ? `It predicted you would play ${result.predictedUserMove}${
                                result.predictionCorrect
                                  ? " and was right."
                                  : ", but you didn't."
                              }`
                            : null}
                    </div>
                    {result.taunt && !result.fallbackReason && (
                      <div className="mt-1.5 text-sm italic text-text-secondary">
                        “{result.taunt}”
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={nextRound}
                      autoFocus
                      className="inline-flex items-center gap-2 rounded-[2px] border border-line-structure bg-text-primary px-4 py-2 text-sm font-medium text-surface-bg shadow-sm transition-opacity hover:opacity-90"
                    >
                      Play next round
                    </button>
                    <DemoTraceLink
                      traceUrl={result.traceUrl}
                      source="rock_paper_scissors"
                    />
                  </div>
                </div>
              )}

              {/* Reasoning panel */}
              <div className="rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a]">
                <div className="flex items-center justify-between border-b border-line-structure px-3 py-2">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
                    {phase === "thinking" && <Loader size={12} />}
                    {phase === "thinking"
                      ? `${opponentMeta.label} is reasoning`
                      : `${opponentMeta.label}'s reasoning`}
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
                  className="max-h-36 min-h-[72px] overflow-y-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-5 text-text-secondary"
                >
                  {reasoning ||
                    (phase === "thinking"
                      ? "…"
                      : "The model did not share its reasoning for this round.")}
                  {phase === "thinking" && (
                    <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-text-tertiary align-middle" />
                  )}
                </pre>
              </div>
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
      Previous rounds (you / model)
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
