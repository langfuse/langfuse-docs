import { getGitHubStars } from "@/lib/github-stars";
import {
  DOCKER_PULLS,
  FORTUNE_50_COMPANIES,
  FORTUNE_500_COMPANIES,
  formatCompanyCount,
  formatSdkInstallsPerMonth,
} from "./home/Usage";
import {
  formatIntegrations,
  formatObservationsPerMonth,
} from "@/lib/usage-stats";

export const CredibilitySentence = ({
  bold = true,
  className = "mt-6",
  style = "paragraph",
  extended = false,
}: {
  bold?: boolean;
  className?: string;
  style?: "paragraph" | "list";
  /** List style only: also show observations per month and integrations. */
  extended?: boolean;
}) => {
  const Metric = bold ? "strong" : "span";
  const metricClassName = bold ? "font-semibold" : "";

  if (style === "list") {
    return (
      <div className={className}>
        <p>Langfuse is the most widely adopted LLM Engineering platform:</p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>
            Used by{" "}
            <Metric className={metricClassName}>{formatCompanyCount()}</Metric>{" "}
            companies
          </li>
          {extended && (
            <li>
              <Metric className={metricClassName}>
                {formatObservationsPerMonth()}
              </Metric>{" "}
              observations per month
            </li>
          )}
          <li>
            <Metric className={metricClassName}>
              {getGitHubStars().toLocaleString()}
            </Metric>{" "}
            GitHub stars
          </li>
          <li>
            <Metric className={metricClassName}>
              {formatSdkInstallsPerMonth()}
            </Metric>{" "}
            SDK installs per month
          </li>
          <li>
            <Metric className={metricClassName}>
              {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+
            </Metric>{" "}
            Docker pulls
          </li>
          {extended && (
            <li>
              <Metric className={metricClassName}>
                {formatIntegrations()}
              </Metric>{" "}
              integrations
            </li>
          )}
          <li>
            Trusted by <strong>{FORTUNE_50_COMPANIES} of the Fortune 50</strong>{" "}
            and <strong>{FORTUNE_500_COMPANIES} of the Fortune 500</strong>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <p className={className}>
      Langfuse is the most widely adopted LLM Engineering platform, used by{" "}
      <Metric className={metricClassName}>
        {formatCompanyCount()} companies
      </Metric>
      , with{" "}
      <Metric className={metricClassName}>
        {getGitHubStars().toLocaleString()} GitHub stars
      </Metric>
      ,{" "}
      <Metric className={metricClassName}>
        {formatSdkInstallsPerMonth()} SDK installs per month
      </Metric>
      , and{" "}
      <Metric className={metricClassName}>
        {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
      </Metric>
      . Trusted by <strong>{FORTUNE_50_COMPANIES} of the Fortune 50</strong> and{" "}
      <strong>{FORTUNE_500_COMPANIES} of the Fortune 500</strong> companies.
    </p>
  );
};
