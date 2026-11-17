import { getGitHubStars } from "@/lib/github-stars";
import {
  FORTUNE_50_COMPANIES,
  FORTUNE_500_COMPANIES,
  formatCompanyCount,
  formatDockerPulls,
  formatIntegrations,
  formatObservationsPerMonth,
  formatSdkInstallsPerMonth,
} from "@/lib/usage-stats";
import { cn } from "@/lib/utils";

/** Headline adoption metrics for /adoption. Mirrored in lib/markdown-component-renderers.js. */
export function getAdoptionStats() {
  return [
    { value: formatCompanyCount(), label: "Companies" },
    { value: formatObservationsPerMonth(), label: "Observations / month" },
    { value: formatSdkInstallsPerMonth(), label: "SDK installs / month" },
    { value: formatDockerPulls(), label: "Docker pulls" },
    { value: String(FORTUNE_50_COMPANIES), label: "Of the Fortune 50" },
    { value: String(FORTUNE_500_COMPANIES), label: "Of the Fortune 500" },
    {
      value: getGitHubStars().toLocaleString("en-US"),
      label: "GitHub stars",
    },
    { value: formatIntegrations(), label: "Integrations" },
  ];
}

export function AdoptionStatsBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "not-prose grid grid-cols-2 gap-px overflow-hidden border border-line-structure bg-line-structure sm:grid-cols-4",
        className,
      )}
    >
      {getAdoptionStats().map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-1.5 bg-surface-1 px-4 py-6 text-center sm:py-7"
        >
          <p className="m-0 font-analog text-[28px] font-medium leading-none tracking-tight text-text-primary sm:text-[32px]">
            {stat.value}
          </p>
          <p className="m-0 font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] text-text-tertiary">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
