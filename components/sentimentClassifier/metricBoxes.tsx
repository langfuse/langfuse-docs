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
};

const MetricValue = ({
  metric,
  format,
}: {
  metric: EngineMetric;
  format: (value: number) => string;
}) => {
  if (metric.loading && metric.value == null) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground font-normal">
        <Loader size={11} />
        Running
      </span>
    );
  }
  if (metric.value != null) {
    return (
      <span className="tabular-nums text-text-primary font-medium">
        {format(metric.value)}
      </span>
    );
  }
  return <span className="text-muted-foreground font-normal">—</span>;
};

const summaryFor = (
  jev: EngineMetric,
  luna: EngineMetric,
  cheaperOrFaster: "faster" | "cheaper",
) => {
  if (jev.loading || luna.loading) return null;
  const ratio = comparisonRatio(luna.value, jev.value);
  if (ratio == null) return null;
  if (ratio >= 1.05) return `Jev ${formatRatio(ratio)} ${cheaperOrFaster}`;
  if (ratio <= 1 / 1.05)
    return `Luna ${formatRatio(1 / ratio)} ${cheaperOrFaster}`;
  return "About the same";
};

const MetricBox = ({
  title,
  jev,
  luna,
  format,
  cheaperOrFaster,
}: MetricBoxProps) => {
  const summary = summaryFor(jev, luna, cheaperOrFaster);

  return (
    <div className="rounded-[2px] border border-line-structure p-4 space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-text-secondary">TypeSafe Jev</span>
          <MetricValue metric={jev} format={format} />
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-text-secondary">GPT-5.6 Luna</span>
          <MetricValue metric={luna} format={format} />
        </div>
      </div>
      {summary && (
        <p className="text-xs font-medium text-text-primary border-t border-line-structure pt-3">
          {summary}
        </p>
      )}
    </div>
  );
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
  compact?: boolean;
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
  compact = false,
}: CompareMetricBoxesProps) => {
  const latency = {
    jev: {
      value: jevLatencyMs,
      loading: jevLoading,
      error: jevError,
    },
    luna: {
      value: lunaLatencyMs,
      loading: lunaLoading,
      error: lunaError,
    },
  };
  const cost = {
    jev: {
      value: jevUsage?.costUsd ?? null,
      loading: jevLoading,
      error: jevError,
    },
    luna: {
      value: lunaUsage?.costUsd ?? null,
      loading: lunaLoading,
      error: lunaError,
    },
  };

  if (compact) {
    const latencySummary = summaryFor(latency.jev, latency.luna, "faster");
    const costSummary = summaryFor(cost.jev, cost.luna, "cheaper");
    return (
      <div className="rounded-[2px] border border-line-structure px-2.5 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="text-text-secondary">
          <span className="font-medium text-text-primary">Latency</span> Jev{" "}
          <MetricValue metric={latency.jev} format={formatLatencyMs} />
          <span className="text-muted-foreground"> · </span>
          Luna <MetricValue metric={latency.luna} format={formatLatencyMs} />
          {latencySummary && (
            <span className="ml-1.5 font-medium text-text-primary">
              {latencySummary}
            </span>
          )}
        </span>
        <span className="text-text-secondary">
          <span className="font-medium text-text-primary">Cost</span> Jev{" "}
          <MetricValue metric={cost.jev} format={formatCostUsd} />
          <span className="text-muted-foreground"> · </span>
          Luna <MetricValue metric={cost.luna} format={formatCostUsd} />
          {costSummary && (
            <span className="ml-1.5 font-medium text-text-primary">
              {costSummary}
            </span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <MetricBox
        title="Latency"
        cheaperOrFaster="faster"
        format={formatLatencyMs}
        jev={latency.jev}
        luna={latency.luna}
      />
      <MetricBox
        title="Cost"
        cheaperOrFaster="cheaper"
        format={formatCostUsd}
        jev={cost.jev}
        luna={cost.luna}
      />
    </div>
  );
};
