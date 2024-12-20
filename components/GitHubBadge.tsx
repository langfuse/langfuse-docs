import { useEffect, useState } from "react";
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
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!stars)
      fetch("/api/stargazer-count")
        .then((data) =>
          data.json().then((json) => setStars(json.stargazers_count))
        )
        .catch((err) => console.error("Error while loading GitHub stars", err));
  }, []);

  return stars ? (
    <span>
      {(stars as number).toLocaleString("en-US", {
        compactDisplay: "short",
        notation: "compact",
      })}
    </span>
  ) : null;
};
