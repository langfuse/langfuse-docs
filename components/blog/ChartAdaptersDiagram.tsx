export function ChartAdaptersDiagram() {
  return (
    <figure className="not-prose min-w-0">
      <p className="mb-4 text-xs text-text-secondary">
        Public components: choose the chart you need
      </p>
      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        {(["BarChart", "GroupedBarChart", "StackedBarChart"] as const).map(
          (name) => (
            <div
              key={name}
              className="min-w-0 rounded-lg border border-text-code-blue bg-surface-1 p-3"
            >
              <p className="mb-3 break-words font-mono text-xs text-text-code-blue">
                {name}
              </p>
              <svg
                viewBox="0 0 180 120"
                role="img"
                aria-label={`Simplified ${name} preview`}
                className="block h-auto w-full"
              >
                <path
                  d="M14 8v96h154"
                  fill="none"
                  stroke="var(--line-structure)"
                />
                {[42, 86, 130].map((x, index) => (
                  <g key={x}>
                    <rect
                      x={x - 12}
                      y={104 - [46, 72, 58][index]}
                      width={name === "GroupedBarChart" ? 12 : 24}
                      height={[46, 72, 58][index]}
                      rx="2"
                      fill="var(--text-code-blue)"
                      fillOpacity="0.8"
                    />
                    {name === "GroupedBarChart" && (
                      <rect
                        x={x + 3}
                        y={104 - [66, 45, 80][index]}
                        width="12"
                        height={[66, 45, 80][index]}
                        rx="2"
                        fill="var(--text-code-orange)"
                        fillOpacity="0.8"
                      />
                    )}
                    {name === "StackedBarChart" && (
                      <rect
                        x={x - 12}
                        y={104 - [46, 72, 58][index]}
                        width="24"
                        height={[18, 28, 22][index]}
                        rx="2"
                        fill="var(--text-code-orange)"
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
          ),
        )}
      </div>
      <div
        aria-hidden="true"
        className="flex justify-center py-3 text-text-tertiary"
      >
        ↓
      </div>
      <div className="rounded-lg border border-dashed border-text-code-orange bg-surface-2 p-4 text-center">
        <p className="font-mono text-sm text-text-code-orange">
          BarChartCore (internal)
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          BarChartCore supports all three display modes.
        </p>
      </div>
    </figure>
  );
}
