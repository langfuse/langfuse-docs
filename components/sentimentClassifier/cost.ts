/** Published list prices used to estimate demo USD cost from token usage. */
export const JEV_PRICE_USD_PER_MTOK = {
  input: 0.042,
  output: 0,
} as const;

/** GPT-5.6 Luna list price (reasoning tokens bill as output). */
export const LUNA_PRICE_USD_PER_MTOK = {
  input: 0.2,
  output: 1.2,
} as const;

export type SentimentUsage = {
  inputTokens: number;
  outputTokens: number;
  reasoningTokens?: number;
  totalTokens: number;
  /** Estimated USD from published list prices × token usage. */
  costUsd: number;
};

export function computeCostUsd(
  inputTokens: number,
  outputTokens: number,
  price: { input: number; output: number },
): number {
  return (
    (inputTokens / 1e6) * price.input + (outputTokens / 1e6) * price.output
  );
}

export function formatCostUsd(costUsd: number): string {
  if (costUsd <= 0) return "$0";
  if (costUsd < 0.000001) return "<$0.000001";
  if (costUsd < 0.01) return `$${costUsd.toFixed(6)}`;
  return `$${costUsd.toFixed(4)}`;
}
