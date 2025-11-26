import { getGitHubStars } from "@/lib/github-stars";
import { DOCKER_PULLS, SDK_INSTALLS_PER_MONTH } from "./home/Usage";

export const CredibilitySentence = ({
  bold = true,
  className = "mt-6",
}: {
  bold?: boolean;
  className?: string;
}) => {
  const Metric = bold ? "strong" : "span";
  const metricClassName = bold ? "font-semibold" : "";

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
      .
    </p>
  );
};
