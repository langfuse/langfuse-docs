"use client";

const performanceData = [
  {
    feature: "50 most recent observations",
    old: 2.8,
    new: 0.57,
  },
  {
    feature: "50 most expensive observations",
    old: 30,
    new: 10,
  },
  {
    feature: "LLM cost by model",
    old: 39.67,
    new: 1.5,
  },
  {
    feature: "LLM cost by user",
    old: 330,
    new: 2,
  },
];

export function PerformanceComparison() {
  return (
    <div className="my-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Performance Comparison</h3>
        <p className="text-sm text-muted-foreground">
          Response times for common queries (lower is better)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceData.map((item, index) => {
          const improvement = ((item.old - item.new) / item.old * 100).toFixed(1);
          const speedup = (item.old / item.new).toFixed(1);
          return (
            <div key={index} className="p-6 lg:p-8 border border-border rounded-lg bg-card">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono">
                {speedup}x
              </div>
              <div className="mt-2 text-base font-normal space-y-1">
                <p className="text-sm">{item.feature}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="line-through opacity-60">{item.old}s</span> → <span className="font-semibold">{item.new}s</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
