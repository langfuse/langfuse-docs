import { getGitHubStars } from "@/lib/github-stars";
import { cn } from "@/lib/utils";

function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(value);
}

const stats = [
  { value: "2,300+", label: "Companies" },
  { value: "10B+", label: "Observations / month" },
  {
    value: formatCompact(getGitHubStars()),
    label: "GitHub stars",
  },
  { value: "100+", label: "Integrations" },
] as const;

export function CustomerStatsBar({ className }: { className?: string }) {
  return (
    <div
      className={cn("border-y border-line-structure bg-surface-1", className)}
    >
      <div className="grid grid-cols-2 divide-x divide-y divide-line-structure sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center gap-1.5 px-4 py-6 text-center sm:py-7"
          >
            <p className="m-0 font-analog text-[28px] font-medium leading-none tracking-tight text-text-primary sm:text-[32px]">
              {stat.value}
            </p>
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
