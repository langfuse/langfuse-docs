import { comparisonRatio, formatRatio } from "./cost";

export type EngineMetric = {
  id: string;
  label: string;
  value: number | null;
  loading: boolean;
  error: boolean;
};

/** Winner label when one engine is clearly ahead; null while running or tied. */
export const summaryFor = (
  engines: EngineMetric[],
  cheaperOrFaster: "faster" | "cheaper",
): string | null => {
  if (engines.some((engine) => engine.loading || engine.error)) return null;
  const finished = engines.filter(
    (engine) => engine.value != null && engine.value > 0,
  );
  if (finished.length < 2) return null;

  const sorted = [...finished].sort(
    (a, b) => (a.value as number) - (b.value as number),
  );
  const best = sorted[0];
  const second = sorted[1];
  const ratio = comparisonRatio(second.value, best.value);
  if (ratio == null) return null;
  if (ratio < 1.05) return "About the same";
  return `${best.label} ${formatRatio(ratio)} ${cheaperOrFaster}`;
};
