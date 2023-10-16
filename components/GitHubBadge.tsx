import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";

export const GithubMenuBadge = () => (
  <Link
    href="https://github.com/langfuse/langfuse"
    className="group h-8 flex shrink-0 flex-row items-center rounded-md border border-primary/10 overflow-hidden transition-opacity"
  >
    <div className="py-1 px-2 block bg-primary/10">
      <BsGithub size={22} className="group-hover:opacity-80 opacity-100" />
    </div>
    <StarCount className="py-1 px-2  text-sm group-hover:opacity-80 opacity-100" />
  </Link>
);

export const StarCount: React.FC<{ className?: string }> = ({ className }) => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!stars)
      fetch("https://api.github.com/repos/langfuse/langfuse").then((data) =>
        data.json().then((json) => setStars(json.stargazers_count))
      );
  }, []);

  return stars ? (
    <span className={className}>
      {(stars as number).toLocaleString("en-US", {
        compactDisplay: "short",
        notation: "compact",
      })}
    </span>
  ) : null;
};
