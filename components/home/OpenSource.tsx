import ShimmerButton from "../magicui/shimmer-button";
import { BsGithub } from "react-icons/bs";
import Link from "next/link";
import { useState, useEffect } from "react";

export const OpenSource = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!stars)
      fetch("https://api.github.com/repos/langfuse/langfuse").then((data) =>
        data.json().then((json) => setStars(json.stargazers_count))
      );
  }, []);

  return (
    <section className="text-center my-36 flex flex-col items-center gap-2">
      <h2>Proudly Open Source</h2>
      <p className="text-lg text-primary/70">
        We are committed to open source and Langfuse is easy to run locally and
        self-hosted.
      </p>
      <Link href="https://github.com/langfuse/langfuse">
        <ShimmerButton borderRadius="8px" className="mt-11">
          <div className="flex gap-4 items-center whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            <BsGithub size={28} className="text-white" />
            <span>langfuse/langfuse:</span>
            {stars ? <span>{stars} ⭐️</span> : null}
          </div>
        </ShimmerButton>
      </Link>
    </section>
  );
};
