import ShimmerButton from "../magicui/shimmer-button";
import Link from "next/link";
import Changelog from "./Changelog";
import { StarCount } from "../GitHubBadge";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import IconGithub from "../icons/github";

export default function OpenSource() {
  return (
    <HomeSection className="flex flex-col items-center">
      <Header
        title="Proudly Open Source"
        description={
          <span>
            Langfuse is committed to open source. You can also run it{" "}
            <Link href="/docs/deployment/local" className="underline">
              locally
            </Link>{" "}
            or{" "}
            <Link href="/docs/deployment/self-host" className="underline">
              self-hosted
            </Link>
            .
          </span>
        }
        className="mb-0"
      />

      <Link href="https://github.com/langfuse/langfuse">
        <ShimmerButton borderRadius="0.25rem" className="mt-11">
          <div className="flex gap-4 items-center whitespace-pre-wrap bg-gradient-to-b from-white from-30% to-gray-300/70 bg-clip-text text-center text-md font-semibold leading-none tracking-tight text-transparent">
            <IconGithub className="text-white h-9 w-9" />
            <span>langfuse/langfuse:</span>
            <StarCount />
            <span>⭐️</span>
          </div>
        </ShimmerButton>
      </Link>
      <Changelog className="mt-14" />
    </HomeSection>
  );
}
