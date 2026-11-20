import { MetricChart } from "./MetricChart";
import snapshots from "./design-system-progress.json";

// Weekly samples from the internal dashboard, plus its latest snapshot:
// langfuse/langfuse@839b988a7433b0585daac6407743b60607b0f1ce.
const charts = [
  {
    title: "Design components",
    series: [{ key: "components", label: "Design system" }],
  },
  {
    title: "Design imports",
    series: [
      { key: "imports", label: "Design system" },
      { key: "legacyImports", label: "Legacy UI" },
    ],
  },
  {
    title: "Frontend components",
    series: [
      {
        key: "totalComponents",
        label: "Total frontend components",
      },
    ],
  },
] as const;

const latestSnapshot = snapshots[snapshots.length - 1];
const comparisons = [30, 90].map((days) => {
  const comparisonDate =
    Date.parse(latestSnapshot.date) - days * 24 * 60 * 60 * 1000;
  const snapshot = snapshots.reduce((nearest, candidate) =>
    Math.abs(Date.parse(candidate.date) - comparisonDate) <
    Math.abs(Date.parse(nearest.date) - comparisonDate)
      ? candidate
      : nearest,
  );
  return { days, snapshot };
});
const monthlySnapshots = snapshots.filter(
  (snapshot, index) =>
    snapshot.date.slice(0, 7) !== snapshots[index + 1]?.date.slice(0, 7),
);
const chartSnapshots = monthlySnapshots.filter((_, index) => index % 2 === 0);
const labels = chartSnapshots.map((snapshot) =>
  new Date(snapshot.date).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  }),
);

export function DesignSystemProgress() {
  return (
    <figure className="not-prose py-6">
      <div className="grid gap-3 md:grid-cols-3">
        {charts.map((chart) => {
          const metric = chart.series[0].key;
          const changes = comparisons.map(({ days, snapshot }) => {
            if (snapshot[metric] === 0) {
              return { label: `${days}d`, value: "N/A" };
            }
            const changeRate = latestSnapshot[metric] / snapshot[metric] - 1;
            const change = changeRate.toLocaleString("en-US", {
              style: "percent",
              maximumFractionDigits: Math.abs(changeRate) >= 1 ? 0 : 1,
              signDisplay: "exceptZero",
            });
            return { label: `${days}d`, value: change };
          });

          return (
            <MetricChart
              key={chart.title}
              title={chart.title}
              value={latestSnapshot[metric].toLocaleString("en-US")}
              comparison={changes}
              labels={labels}
              series={chart.series.map((series) => ({
                label: series.label,
                values: chartSnapshots.map((snapshot) => snapshot[series.key]),
              }))}
            />
          );
        })}
      </div>
      <figcaption className="mt-3 text-center text-sm leading-relaxed text-text-tertiary">
        Last available snapshot every second month, May–November 2026 (through
        November 17), from weekly samples. Imports count symbols, excluding
        tests and Storybook stories. Design-system component counts exclude
        internal components; frontend totals include the design system. Each
        chart uses its own vertical scale. Change rates compare the latest
        values with the snapshots nearest 30 and 90 days earlier.
      </figcaption>
    </figure>
  );
}
