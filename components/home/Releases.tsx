import Marquee from "@/components/magicui/marquee";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import IconTypescript from "../icons/typescript";
import IconPython from "../icons/python";

export type GithubRelease = {
  repo: string;
  name: string;
  html_url: string;
  created_at: string;
};

const ReleaseCard = ({
  release,
  icon,
}: {
  release: GithubRelease;
  icon: React.ReactNode;
}) => {
  return (
    <div className="relative cursor-default w-60 overflow-hidden rounded border bg-card px-3 py-2 flex gap-4 items-center">
      {icon}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium dark:text-white">{release.name}</h3>
        <time className="text-xs font-medium dark:text-white/40">
          {release.repo}
        </time>
      </div>
    </div>
  );
};

export const Releases = ({
  releases,
}: {
  releases: {
    langfuse: GithubRelease[];
    jsSdk: GithubRelease[];
    pythonSdk: GithubRelease[];
  };
}) => {
  return (
    <HomeSection>
      <Header
        title="We Ship Fast"
        description="We are all figuring out the best workflow for LLM engineering together. Here's what we've released in the past 14 days."
        buttons={[
          {
            href: "https://github.com/langfuse",
            text: "GitHub",
          },
        ]}
      />
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded">
        <Marquee className="[--duration:50s]">
          {releases.langfuse.map((release) => (
            <ReleaseCard
              key={release.name}
              release={release}
              icon={
                <span>
                  <img src="/icon.svg" alt="langfuse" className="h-5 w-5" />
                </span>
              }
            />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:50s]">
          {releases.jsSdk.map((release) => (
            <ReleaseCard
              key={release.name}
              release={release}
              icon={<IconTypescript className="h-5 w-5" />}
            />
          ))}
        </Marquee>
        <Marquee className="[--duration:50s]">
          {releases.pythonSdk.map((release) => (
            <ReleaseCard
              key={release.name}
              release={release}
              icon={<IconPython className="h-5 w-5" />}
            />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </HomeSection>
  );
};
