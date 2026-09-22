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

export function formatLatencyMs(latencyMs: number): string {
  if (latencyMs < 1000) return `${Math.round(latencyMs)}ms`;
  if (latencyMs < 10_000) return `${(latencyMs / 1000).toFixed(1)}s`;
  return `${Math.round(latencyMs / 1000)}s`;
}

/** How many times `baseline` is smaller than `comparison`. Null if either side is missing or not positive. */
export function comparisonRatio(
  comparison: number | null | undefined,
  baseline: number | null | undefined,
): number | null {
  if (
    comparison == null ||
    baseline == null ||
    !Number.isFinite(comparison) ||
    !Number.isFinite(baseline) ||
    comparison <= 0 ||
    baseline <= 0
  ) {
    return null;
  }
  return comparison / baseline;
}

export function formatRatio(ratio: number): string {
  if (ratio < 1.05) return "about the same";
  if (ratio < 10) return `${ratio.toFixed(1)}×`;
  return `${Math.round(ratio).toLocaleString("en-US")}×`;
}
