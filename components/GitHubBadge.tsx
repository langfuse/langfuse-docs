import { getGitHubStars } from "@/lib/github-stars";
import IconGithub from "./icons/github";

export const GithubMenuBadge = () => (
  <a
    href="https://github.com/langfuse/langfuse"
    className="group h-8 flex shrink-0 flex-row items-center rounded border border-primary/10 overflow-hidden transition-opacity"
    target="_blank"
    rel="nofollow noreferrer"
    title="GitHub Repository"
  >
    <div className="py-1 px-1 block bg-primary/10">
      <IconGithub className="group-hover:opacity-80 opacity-100 h-6 w-6" />
    </div>
    <div className="py-1 text-center text-sm group-hover:opacity-80 opacity-100 w-10">
      <StarCount />
    </div>
  </a>
);

export const StarCount = () => {
  const stars = getGitHubStars();

  return (
    <span>
      {stars.toLocaleString("en-US", {
        compactDisplay: "short",
        notation: "compact",
      })}
    </span>
  );
};
