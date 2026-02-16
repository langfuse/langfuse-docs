import { getGitHubStars } from "@/lib/github-stars";
import {
  DOCKER_PULLS,
  FORTUNE_50_COMPANIES,
  FORTUNE_500_COMPANIES,
  SDK_INSTALLS_PER_MONTH,
} from "./home/Usage";

export const CredibilitySentence = ({
  bold = true,
  className = "mt-6",
  style = "paragraph",
}: {
  bold?: boolean;
  className?: string;
  style?: "paragraph" | "list";
}) => {
  const Metric = bold ? "strong" : "span";
  const metricClassName = bold ? "font-semibold" : "";

  if (style === "list") {
    return (
      <div className={className}>
        <p>Langfuse is the most widely adopted LLM Engineering platform:</p>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>
            <Metric className={metricClassName}>
              {getGitHubStars().toLocaleString()}
            </Metric>{" "}
            GitHub stars
          </li>
          <li>
            <Metric className={metricClassName}>
              {(SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(1)}M+
            </Metric>{" "}
            SDK installs per month
          </li>
          <li>
            <Metric className={metricClassName}>
              {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+
            </Metric>{" "}
            Docker pulls
          </li>
          <li>
            Trusted by{" "}
            <strong>{FORTUNE_50_COMPANIES} of the Fortune 50</strong> and{" "}
            <strong>{FORTUNE_500_COMPANIES} of the Fortune 500</strong>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <p className={className}>
      Langfuse is the most widely adopted LLM Engineering platform with{" "}
      <Metric className={metricClassName}>
        {getGitHubStars().toLocaleString()} GitHub stars
      </Metric>
      ,{" "}
      <Metric className={metricClassName}>
        {(SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(1)}M+ SDK installs per
        month
      </Metric>
      , and{" "}
      <Metric className={metricClassName}>
        {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
      </Metric>
      . Trusted by{" "}
      <strong>{FORTUNE_50_COMPANIES} of the Fortune 50</strong> and{" "}
      <strong>{FORTUNE_500_COMPANIES} of the Fortune 500</strong> companies.
    </p>
  );
};
