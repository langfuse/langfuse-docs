import ShimmerButton from "../magicui/shimmer-button";
import { BsGithub } from "react-icons/bs";
import Link from "next/link";
import Changelog from "./Changelog";
import { StarCount } from "../GitHubBadge";
import { HomeSection } from "./components/HomeSection";
import HomeSubHeader from "./components/HomeSubHeader";

export const OpenSource = () => {
  return (
    <HomeSection className="flex flex-col items-center">
      <HomeSubHeader
        title="Proudly Open Source"
        description="We are committed to open source and Langfuse is easy to run locally and
        self-hosted."
        className="mb-0"
      />

      <Link href="https://github.com/langfuse/langfuse">
        <ShimmerButton borderRadius="0.25rem" className="mt-11">
          <div className="flex gap-4 items-center whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            <BsGithub size={28} className="text-white" />
            <span>langfuse/langfuse:</span>
            <StarCount />
            <span>⭐️</span>
          </div>
        </ShimmerButton>
      </Link>
      <Changelog className="mt-14" />
    </HomeSection>
  );
};
