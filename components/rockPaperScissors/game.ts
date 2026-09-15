export const MOVES = ["rock", "paper", "scissors"] as const;
export type Move = (typeof MOVES)[number];

export const OPPONENT_IDS = ["fable-5-1", "gpt-6-astra"] as const;
export type OpponentId = (typeof OPPONENT_IDS)[number];

export type RoundOutcome = "user_won" | "model_won" | "draw";

/** Why the server played a scripted move instead of the model's own. */
export type FallbackReason = "timeout" | "no_tool_call";

export type RoundRecord = {
  round: number;
  userMove: Move;
  modelMove: Move;
  predictedUserMove: Move | null;
  outcome: RoundOutcome;
};

export const BEATS: Record<Move, Move> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export const COUNTER: Record<Move, Move> = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

export const isMove = (value: unknown): value is Move =>
  typeof value === "string" && (MOVES as readonly string[]).includes(value);

export const isOpponentId = (value: unknown): value is OpponentId =>
  typeof value === "string" &&
  (OPPONENT_IDS as readonly string[]).includes(value);

export const resolveRound = (userMove: Move, modelMove: Move): RoundOutcome => {
  if (userMove === modelMove) return "draw";
  return BEATS[userMove] === modelMove ? "user_won" : "model_won";
};

/**
 * Deterministic move used when the model does not answer within the time cap.
 * Rotates so the fallback is not trivially exploitable.
 */
export const fallbackMove = (round: number): Move =>
  MOVES[(round * 2) % MOVES.length];

/** Rounds shown to the model as context. */
export const MAX_HISTORY_ROUNDS = 30;
/** Upper bound on rounds accepted from the client per request. */
export const MAX_HISTORY_LENGTH = 1_000;

export const sanitizeHistory = (input: unknown): RoundRecord[] => {
  if (!Array.isArray(input)) return [];
  return input
    .slice(-MAX_HISTORY_LENGTH)
    .filter(
      (item): item is RoundRecord =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as RoundRecord).round === "number" &&
        isMove((item as RoundRecord).userMove) &&
        isMove((item as RoundRecord).modelMove),
    )
    .map((item) => ({
      round: item.round,
      userMove: item.userMove,
      modelMove: item.modelMove,
      predictedUserMove: isMove(item.predictedUserMove)
        ? item.predictedUserMove
        : null,
      outcome: resolveRound(item.userMove, item.modelMove),
    }));
};

export const formatHistory = (history: RoundRecord[]): string => {
  if (history.length === 0) {
    return "No previous rounds. This is round 1.";
  }
  const lines = history.map((r) => {
    const result =
      r.outcome === "draw"
        ? "draw"
        : r.outcome === "user_won"
          ? "human won"
          : "you won";
    const prediction = r.predictedUserMove
      ? ` (you predicted ${r.predictedUserMove})`
      : "";
    return `Round ${r.round}: human played ${r.userMove}, you played ${r.modelMove}${prediction} -> ${result}`;
  });
  return lines.join("\n");
};

export const tally = (history: RoundRecord[]) =>
  history.reduce(
    (acc, r) => {
      if (r.outcome === "user_won") acc.user += 1;
      else if (r.outcome === "model_won") acc.model += 1;
      else acc.draws += 1;
      return acc;
    },
    { user: 0, model: 0, draws: 0 },
  );
