import { MetricChart } from "./MetricChart";
import snapshots from "./design-system-progress.json";

// Weekly samples from the internal dashboard, plus its latest snapshot:
// langfuse/langfuse@839b988a7433b0585daac6407743b60607b0f1ce.
const charts = [
  {
    title: "Design-system components",
    description:
      "Exported design-system components, excluding internal components.",
    maximum: 80,
    series: [{ key: "components", label: "Design system", dashed: false }],
  },
  {
    title: "Design-system imports",
    description: "Imported symbols, excluding tests and Storybook stories.",
    maximum: 4000,
    series: [
      { key: "imports", label: "Design system", dashed: false },
      { key: "legacyImports", label: "Legacy UI", dashed: true },
    ],
  },
  {
    title: "Total frontend components",
    description:
      "Total exported frontend components: a proxy for code surface, shown on the same timeline as imports above.",
    maximum: 2000,
    series: [
      {
        key: "totalComponents",
        label: "Total frontend components",
        dashed: true,
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
const ticks = [
  { date: "2026-06-01", label: "Jun" },
  { date: "2026-08-01", label: "Aug" },
  { date: "2026-11-01", label: "Nov" },
];

export function DesignSystemProgress() {
  return (
    <div className="not-prose">
      <div className="grid gap-4 md:grid-cols-3">
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
              changes={changes}
              description={chart.description}
              maximum={chart.maximum}
              dateRange={{
                start: snapshots[0].date,
                end: latestSnapshot.date,
                label: "May 22 to November 17, 2026",
              }}
              ticks={ticks}
              series={chart.series.map((series) => ({
                label: series.label,
                dashed: series.dashed,
                points: snapshots.map((snapshot) => ({
                  date: snapshot.date,
                  value: snapshot[series.key],
                })),
              }))}
            />
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-text-secondary">
        Weekly sampled snapshots, May 22–November 17, 2026. Imports count
        symbols, excluding tests and Storybook stories. Design-system component
        counts exclude internal components; frontend totals include the design
        system. Each chart uses its own vertical scale. Change rates compare the
        latest values with the snapshots nearest 30 and 90 days earlier.
      </p>
    </div>
  );
}
