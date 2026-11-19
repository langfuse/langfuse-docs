import stats from "./design-pr-stats.json";

export function DesignPrStats() {
  return (
    <figure className="not-prose py-6">
      <figcaption className="mb-4 text-sm text-primary/60">
        {stats.caption}
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {stats.metrics.map((metric) => {
          const max = Math.max(...metric.values);
          return (
            <div
              key={metric.title}
              className="border border-line-structure bg-surface-bg p-5"
            >
              <p className="text-sm text-text-secondary">{metric.title}</p>
              <p className="mt-1 text-3xl font-semibold leading-tight text-text-primary">
                {metric.headline}
              </p>
              <p className="mt-1 text-sm text-text-tertiary">
                {metric.comparison}
              </p>
              <ol className="mt-4 grid grid-cols-4">
                {metric.values.map((value, index) => {
                  const height = `${(value / max) * 100}%`;
                  return (
                    <li
                      key={stats.months[index]}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full border-b border-line-structure pt-6">
                        <div className="relative h-24">
                          <span
                            className="absolute inset-x-0 mb-1 text-center text-xs font-medium tabular-nums text-text-primary"
                            style={{ bottom: height }}
                          >
                            {value}
                          </span>
                          <div
                            aria-hidden="true"
                            className="absolute bottom-0 left-1/2 w-6 -translate-x-1/2 rounded-t bg-line-cta"
                            style={{ height }}
                          />
                        </div>
                      </div>
                      <span className="mt-2 text-xs text-text-tertiary">
                        {stats.months[index]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
        {stats.note}
      </p>
    </figure>
  );
}
