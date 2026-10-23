import { comparisonRatio, formatRatio } from "./cost";

export type EngineMetric = {
  id: string;
  label: string;
  value: number | null;
  loading: boolean;
  error: boolean;
};

const BASELINE_ID = "luna";
const DECISION_ENGINE_IDS = ["jev", "decisions"] as const;

/**
 * Phrase comparing one decision engine to Luna.
 * e.g. "TypeSafe Jev 6.6× faster" or "OpenAI Decisions about the same".
 */
export const vsLunaPhrase = (
  engine: EngineMetric,
  luna: EngineMetric,
  cheaperOrFaster: "faster" | "cheaper",
): string | null => {
  const ratio = comparisonRatio(luna.value, engine.value);
  if (ratio == null) return null;

  const slowerOrCostlier =
    cheaperOrFaster === "faster" ? "slower" : "more expensive";

  if (ratio >= 1.05) {
    return `${engine.label} ${formatRatio(ratio)} ${cheaperOrFaster}`;
  }
  if (ratio <= 1 / 1.05) {
    return `${engine.label} ${formatRatio(1 / ratio)} ${slowerOrCostlier}`;
  }
  return `${engine.label} about the same`;
};

/**
 * Summaries vs GPT-5.6 Luna for both decision engines.
 * Returns null while any engine is still loading or errored without a value.
 */
export const summaryLinesVsLuna = (
  engines: EngineMetric[],
  cheaperOrFaster: "faster" | "cheaper",
): string[] | null => {
  if (
    engines.some(
      (engine) =>
        engine.loading ||
        (engine.error && engine.value == null) ||
        engine.value == null ||
        engine.value <= 0,
    )
  ) {
    return null;
  }

  const luna = engines.find((engine) => engine.id === BASELINE_ID);
  if (!luna) return null;

  const lines = DECISION_ENGINE_IDS.map((id) => {
    const engine = engines.find((item) => item.id === id);
    return engine ? vsLunaPhrase(engine, luna, cheaperOrFaster) : null;
  }).filter((line): line is string => Boolean(line));

  return lines.length > 0 ? lines : null;
};

/** Single-line join of {@link summaryLinesVsLuna} (kept for callers that want one string). */
export const summaryFor = (
  engines: EngineMetric[],
  cheaperOrFaster: "faster" | "cheaper",
): string | null => {
  const lines = summaryLinesVsLuna(engines, cheaperOrFaster);
  return lines ? lines.join(" · ") : null;
};
