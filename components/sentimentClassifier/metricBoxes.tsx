"use client";

import { Loader } from "@/components/ai-elements/loader";
import {
  comparisonRatio,
  formatCostUsd,
  formatLatencyMs,
  formatRatio,
} from "./cost";
import type { SentimentUsage } from "./cost";

type EngineMetric = {
  value: number | null;
  loading: boolean;
  error: boolean;
};

type MetricBoxProps = {
  title: string;
  jev: EngineMetric;
  luna: EngineMetric;
  format: (value: number) => string;
  cheaperOrFaster: "faster" | "cheaper";
  jevDetail?: string;
  lunaDetail?: string;
};

const EngineRow = ({
  label,
  metric,
  format,
  detail,
}: {
  label: string;
  metric: EngineMetric;
  format: (value: number) => string;
  detail?: string;
}) => (
  <div className="flex items-baseline justify-between gap-3 text-sm">
    <span className="text-text-secondary">{label}</span>
    <span className="tabular-nums text-text-primary font-medium text-right">
      {metric.loading && metric.value == null ? (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground font-normal">
          <Loader size={12} />
          Running…
        </span>
      ) : metric.error && metric.value == null ? (
        <span className="text-muted-foreground font-normal">—</span>
      ) : metric.value != null ? (
        <>
          {format(metric.value)}
          {detail ? (
            <span className="block text-[11px] font-normal text-muted-foreground">
              {detail}
            </span>
          ) : null}
        </>
      ) : (
        <span className="text-muted-foreground font-normal">—</span>
      )}
    </span>
  </div>
);

const MetricBox = ({
  title,
  jev,
  luna,
  format,
  cheaperOrFaster,
  jevDetail,
  lunaDetail,
}: MetricBoxProps) => {
  const ratio = comparisonRatio(luna.value, jev.value);
  const jevWins = ratio != null && ratio >= 1.05;
  const lunaWins = ratio != null && ratio > 0 && ratio <= 1 / 1.05;

  let summary: string | null = null;
  if (jevWins && ratio)
    summary = `Jev was ${formatRatio(ratio)} ${cheaperOrFaster}`;
  else if (lunaWins && ratio)
    summary = `Luna was ${formatRatio(1 / ratio)} ${cheaperOrFaster}`;
  else if (ratio != null) summary = "About the same";

  return (
    <div className="rounded-[2px] border border-line-structure p-4 space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="space-y-2">
        <EngineRow
          label="TypeSafe Jev"
          metric={jev}
          format={format}
          detail={jevDetail}
        />
        <EngineRow
          label="GPT-5.6 Luna"
          metric={luna}
          format={format}
          detail={lunaDetail}
        />
      </div>
      {summary && (
        <p className="text-xs font-medium text-text-primary border-t border-line-structure pt-3">
          {summary}
        </p>
      )}
    </div>
  );
};

const usageDetail = (usage?: SentimentUsage | null) => {
  if (!usage) return undefined;
  const parts = [`${usage.inputTokens.toLocaleString()} in`];
  if (usage.outputTokens > 0) {
    parts.push(`${usage.outputTokens.toLocaleString()} out`);
  }
  if (usage.reasoningTokens && usage.reasoningTokens > 0) {
    parts.push(`${usage.reasoningTokens.toLocaleString()} reasoning`);
  }
  return parts.join(" · ");
};

type CompareMetricBoxesProps = {
  jevLatencyMs: number | null;
  lunaLatencyMs: number | null;
  jevUsage?: SentimentUsage | null;
  lunaUsage?: SentimentUsage | null;
  jevLoading: boolean;
  lunaLoading: boolean;
  jevError: boolean;
  lunaError: boolean;
};

export const CompareMetricBoxes = ({
  jevLatencyMs,
  lunaLatencyMs,
  jevUsage,
  lunaUsage,
  jevLoading,
  lunaLoading,
  jevError,
  lunaError,
}: CompareMetricBoxesProps) => (
  <div className="grid gap-4 md:grid-cols-2">
    <MetricBox
      title="Latency"
      cheaperOrFaster="faster"
      format={formatLatencyMs}
      jev={{
        value: jevLatencyMs,
        loading: jevLoading,
        error: jevError,
      }}
      luna={{
        value: lunaLatencyMs,
        loading: lunaLoading,
        error: lunaError,
      }}
    />
    <MetricBox
      title="Cost"
      cheaperOrFaster="cheaper"
      format={formatCostUsd}
      jev={{
        value: jevUsage?.costUsd ?? null,
        loading: jevLoading,
        error: jevError,
      }}
      luna={{
        value: lunaUsage?.costUsd ?? null,
        loading: lunaLoading,
        error: lunaError,
      }}
      jevDetail={usageDetail(jevUsage)}
      lunaDetail={usageDetail(lunaUsage)}
    />
  </div>
);
