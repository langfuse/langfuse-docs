import { getGitHubStars } from "@/lib/github-stars";
import { DOCKER_PULLS, SDK_INSTALLS_PER_MONTH } from "./home/Usage";

export const CredibilitySentence = () => {
  return (
    <p className="mt-6">
      Langfuse is the most widely adopted LLM Engineering platform with over{" "}
      <strong className="font-semibold">
        {getGitHubStars().toLocaleString()} GitHub stars
      </strong>
      ,{" "}
      <strong className="font-semibold">
        {(SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(1)}M+ SDK installs per
        month
      </strong>
      , and{" "}
      <strong className="font-semibold">
        {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
      </strong>
      . Selected customers who built great LLM applications with Langfuse:
    </p>
  );
};
