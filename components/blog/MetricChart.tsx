export function MetricChart({
  title,
  value,
  changes,
  description,
  maximum,
  dateRange,
  ticks,
  series,
}: {
  title: string;
  value: string;
  changes: readonly { label: string; value: string }[];
  description: string;
  maximum: number;
  dateRange: { start: string; end: string; label: string };
  ticks: readonly { date: string; label: string }[];
  series: readonly {
    label: string;
    dashed: boolean;
    points: readonly { date: string; value: number }[];
  }[];
}) {
  const start = Date.parse(dateRange.start);
  const duration = Date.parse(dateRange.end) - start;

  return (
    <figure className="not-prose m-0 flex min-w-0 flex-col overflow-hidden rounded-lg border border-line-structure bg-surface-1 p-4 text-text-primary">
      <figcaption className="pb-3">
        <p className="text-xs font-medium">{title}</p>
        <div className="mt-2 flex items-center gap-3">
          <p className="shrink-0 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <dl className="flex shrink-0 flex-col gap-0.5 border-l border-line-structure pl-3 text-[10px] leading-tight tabular-nums">
            {changes.map((change) => (
              <div
                key={change.label}
                className="flex flex-nowrap items-baseline justify-between gap-2 whitespace-nowrap"
              >
                <dt className="shrink-0 text-text-tertiary">{change.label}</dt>
                <dd className="m-0 shrink-0 text-right font-medium text-text-secondary">
                  {change.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </figcaption>
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] leading-none text-text-secondary">
          {series.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                className={`w-3 shrink-0 border-t-2 ${item.dashed ? "border-dashed border-text-tertiary" : "border-text-primary"}`}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
      <svg
        viewBox="0 0 300 200"
        role="img"
        aria-label={`${title}, ${dateRange.label}`}
        className="mt-auto block h-auto w-full pt-1 font-mono"
      >
        <title>{title}</title>
        <desc>
          {description}{" "}
          {series
            .map(
              (item) =>
                `${item.label}: ${item.points[0]?.value} to ${item.points[item.points.length - 1]?.value}.`,
            )
            .join(" ")}
        </desc>
        {[0, 1, 2].map((tick) => {
          const y = 164 - tick * 70;
          return (
            <g key={tick}>
              <line
                x1="26"
                x2="288"
                y1={y}
                y2={y}
                className="stroke-line-structure"
              />
              <text
                x="20"
                y={y + 4}
                textAnchor="end"
                fontSize={13}
                className="fill-text-secondary"
              >
                {((maximum * tick) / 2).toLocaleString("en-US", {
                  notation: "compact",
                })}
              </text>
            </g>
          );
        })}
        {ticks.map((tick) => (
          <text
            key={tick.date}
            x={26 + ((Date.parse(tick.date) - start) / duration) * 262}
            y="188"
            textAnchor="middle"
            fontSize={13}
            className="fill-text-secondary"
          >
            {tick.label}
          </text>
        ))}
        {series.map((item) => {
          const points = item.points.map((point) => ({
            ...point,
            x: 26 + ((Date.parse(point.date) - start) / duration) * 262,
            y: 164 - (point.value / maximum) * 140,
          }));
          return (
            <g key={item.label}>
              <path
                d={points
                  .map((point, index) =>
                    index === 0
                      ? `M ${point.x} ${point.y}`
                      : `H ${point.x} V ${point.y}`,
                  )
                  .join(" ")}
                fill="none"
                strokeWidth="2.5"
                strokeDasharray={item.dashed ? "6 4" : undefined}
                className={
                  item.dashed ? "stroke-text-tertiary" : "stroke-text-primary"
                }
              />
              {points.map((point) => (
                <circle
                  key={point.date}
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  className={
                    item.dashed ? "fill-text-tertiary" : "fill-text-primary"
                  }
                >
                  <title>{`${point.date}: ${point.value.toLocaleString("en-US")} ${item.label}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
