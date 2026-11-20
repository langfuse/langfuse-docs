import { MetricChart } from "./MetricChart";
import stats from "./design-pr-stats.json";

export function DesignPrStats() {
  return (
    <figure className="not-prose py-6">
      <div className="grid gap-3 md:grid-cols-3">
        {stats.metrics.map((metric) => (
          <MetricChart
            key={metric.title}
            title={metric.title}
            value={metric.headline}
            comparison={metric.comparison}
            labels={stats.months}
            series={[{ label: metric.title, values: metric.values }]}
          />
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm leading-relaxed text-text-tertiary">
        {stats.note}
      </figcaption>
    </figure>
  );
}
