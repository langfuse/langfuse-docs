import {
  FORTUNE_50_COMPANIES,
  formatObservationsPerMonth,
} from "@/lib/usage-stats";

export function SelfHostScaleMetrics() {
  return (
    <p>
      Langfuse OSS and Enterprise use the same codebase as Langfuse Cloud.
      Langfuse processes{" "}
      <strong>{formatObservationsPerMonth()} observations per month</strong> and
      is trusted by <strong>{FORTUNE_50_COMPANIES} of the Fortune 50</strong>.
    </p>
  );
}
