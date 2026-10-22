import { formatHistory, type RoundRecord } from "./game";

export const SYSTEM_PROMPT = `You are playing rock paper scissors against a human. You are trying to win.

You do not know the human's move for this round. Predict it from the history, then pick the move that beats your prediction.

Well-known human tendencies (use them, but stay unpredictable yourself):
- First-time players open with rock more often than chance, especially men. Paper is the least common opener.
- Players who just won tend to repeat their winning move.
- Players who just lost tend to switch to the move that would have beaten what just beat them.
- People rarely play the same move three times in a row. After two identical moves, expect a switch.
- People who announce or think about a move often avoid it.
- If the human seems to be exploiting one of your patterns, break it.

You have a hard 6 second limit. Call the play_move tool as soon as you have a move — that is what counts.

You may write one short sentence of reasoning first. Do not write more than that. No headings, no lists. Do not write anything after the tool call.`;

export const buildUserPrompt = ({
  round,
  history,
}: {
  round: number;
  history: RoundRecord[];
}) =>
  `Round ${round}.\n\nHistory so far:\n${formatHistory(history)}\n\nPredict the human's move and play the move that beats it.`;
