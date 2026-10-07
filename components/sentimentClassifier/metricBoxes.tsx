"use client";

import { Loader } from "@/components/ai-elements/loader";
import { formatCostUsd, formatLatencyMs } from "./cost";
import type { SentimentUsage } from "./cost";
import { summaryFor, type EngineMetric } from "./compareMetrics";

export type { EngineMetric } from "./compareMetrics";
export { summaryFor } from "./compareMetrics";

type MetricBoxProps = {
  title: string;
  engines: EngineMetric[];
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
  if (metric.error && metric.value == null) {
    return (
      <span className="text-muted-foreground font-normal">Incomplete</span>
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

const MetricBox = ({
  title,
  engines,
  format,
  cheaperOrFaster,
}: MetricBoxProps) => {
  const summary = summaryFor(engines, cheaperOrFaster);

  return (
    <div className="rounded-[2px] border border-line-structure p-4 space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="space-y-2 text-sm">
        {engines.map((engine) => (
          <div
            key={engine.id}
            className="flex items-baseline justify-between gap-3"
          >
            <span className="text-text-secondary">{engine.label}</span>
            <MetricValue metric={engine} format={format} />
          </div>
        ))}
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
  decisionsLatencyMs: number | null;
  lunaLatencyMs: number | null;
  jevUsage?: SentimentUsage | null;
  decisionsUsage?: SentimentUsage | null;
  lunaUsage?: SentimentUsage | null;
  jevLoading: boolean;
  decisionsLoading: boolean;
  lunaLoading: boolean;
  jevError: boolean;
  decisionsError: boolean;
  lunaError: boolean;
  compact?: boolean;
};

export const CompareMetricBoxes = ({
  jevLatencyMs,
  decisionsLatencyMs,
  lunaLatencyMs,
  jevUsage,
  decisionsUsage,
  lunaUsage,
  jevLoading,
  decisionsLoading,
  lunaLoading,
  jevError,
  decisionsError,
  lunaError,
  compact = false,
}: CompareMetricBoxesProps) => {
  const latency: EngineMetric[] = [
    {
      id: "jev",
      label: "TypeSafe Jev",
      value: jevLatencyMs,
      loading: jevLoading,
      error: jevError,
    },
    {
      id: "decisions",
      label: "OpenAI Decisions",
      value: decisionsLatencyMs,
      loading: decisionsLoading,
      error: decisionsError,
    },
    {
      id: "luna",
      label: "GPT-5.6 Luna",
      value: lunaLatencyMs,
      loading: lunaLoading,
      error: lunaError,
    },
  ];
  const cost: EngineMetric[] = [
    {
      id: "jev",
      label: "TypeSafe Jev",
      value: jevUsage?.costUsd ?? null,
      loading: jevLoading,
      error: jevError,
    },
    {
      id: "decisions",
      label: "OpenAI Decisions",
      value: decisionsUsage?.costUsd ?? null,
      loading: decisionsLoading,
      error: decisionsError,
    },
    {
      id: "luna",
      label: "GPT-5.6 Luna",
      value: lunaUsage?.costUsd ?? null,
      loading: lunaLoading,
      error: lunaError,
    },
  ];

  if (compact) {
    const latencySummary = summaryFor(latency, "faster");
    const costSummary = summaryFor(cost, "cheaper");
    return (
      <div className="rounded-[2px] border border-line-structure px-2.5 py-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="text-text-secondary">
          <span className="font-medium text-text-primary">Latency</span>{" "}
          {latency.map((engine, index) => (
            <span key={engine.id}>
              {index > 0 && <span className="text-muted-foreground"> · </span>}
              {engine.id === "jev"
                ? "Jev"
                : engine.id === "decisions"
                  ? "Decisions"
                  : "Luna"}{" "}
              <MetricValue metric={engine} format={formatLatencyMs} />
            </span>
          ))}
          {latencySummary && (
            <span className="ml-1.5 font-medium text-text-primary">
              {latencySummary}
            </span>
          )}
        </span>
        <span className="text-text-secondary">
          <span className="font-medium text-text-primary">Cost</span>{" "}
          {cost.map((engine, index) => (
            <span key={engine.id}>
              {index > 0 && <span className="text-muted-foreground"> · </span>}
              {engine.id === "jev"
                ? "Jev"
                : engine.id === "decisions"
                  ? "Decisions"
                  : "Luna"}{" "}
              <MetricValue metric={engine} format={formatCostUsd} />
            </span>
          ))}
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
        engines={latency}
      />
      <MetricBox
        title="Cost"
        cheaperOrFaster="cheaper"
        format={formatCostUsd}
        engines={cost}
      />
    </div>
  );
};
