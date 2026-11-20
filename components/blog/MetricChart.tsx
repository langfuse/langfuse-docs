export function MetricChart({
  title,
  value,
  comparison,
  labels,
  series,
}: {
  title: string;
  value: string;
  comparison: string | readonly { label: string; value: string }[];
  labels: readonly string[];
  series: readonly {
    label: string;
    values: readonly number[];
  }[];
}) {
  const maximum = Math.max(1, ...series.flatMap((item) => item.values));
  const grouped = series.length > 1;

  return (
    <div className="flex min-w-0 flex-col border border-line-structure bg-surface-1 p-5">
      <p className="text-sm text-text-secondary">{title}</p>
      <div className="mt-1 flex items-center gap-3">
        <p className="shrink-0 text-3xl font-semibold leading-tight text-text-primary">
          {value}
        </p>
        {typeof comparison !== "string" && (
          <dl className="flex shrink-0 flex-col gap-0.5 border-l border-line-structure pl-3 text-[10px] leading-tight tabular-nums">
            {comparison.map((change) => (
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
        )}
      </div>
      {typeof comparison === "string" && (
        <p className="mt-1 text-sm text-text-tertiary">{comparison}</p>
      )}
      {grouped && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-tertiary">
          {series.map((item, index) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              <span
                aria-hidden="true"
                className={`size-2 ${index === 0 ? "bg-line-cta" : "bg-text-tertiary/30"}`}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
      <ol
        className="mt-auto grid pt-4"
        style={{
          gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
        }}
        aria-label={title}
      >
        {labels.map((label, index) => (
          <li key={label} className="flex min-w-0 flex-col items-center">
            <div className="w-full border-b border-line-structure pt-6">
              <div className="flex h-24 items-end justify-center gap-1">
                {series.map((item, seriesIndex) => {
                  const amount = item.values[index];
                  const height = `${(amount / maximum) * 100}%`;
                  const showValue =
                    !grouped &&
                    (labels.length <= 4 ||
                      index === 0 ||
                      index === labels.length - 1);
                  return (
                    <div
                      key={item.label}
                      className={`relative h-full ${grouped ? "w-2" : "w-6 max-w-[75%]"}`}
                    >
                      <span
                        className={
                          showValue
                            ? "absolute inset-x-0 mb-1 text-center text-xs font-medium tabular-nums text-text-primary"
                            : "sr-only"
                        }
                        style={showValue ? { bottom: height } : undefined}
                      >
                        {grouped
                          ? `${item.label}: ${amount.toLocaleString("en-US")}`
                          : amount}
                      </span>
                      <div
                        aria-hidden="true"
                        title={`${label}, ${item.label}: ${amount.toLocaleString("en-US")}`}
                        className={`absolute inset-x-0 bottom-0 rounded-t ${seriesIndex === 0 ? "bg-line-cta" : "bg-text-tertiary/30"}`}
                        style={{ height }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="mt-2 text-xs text-text-tertiary">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
