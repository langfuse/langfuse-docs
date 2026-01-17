import { HomeSection } from "./components/HomeSection";
import NumberTicker from "@/components/ui/number-ticker";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { getGitHubStars } from "@/lib/github-stars";
import { cn } from "@/lib/utils";

// Export usage stats constants
export const SDK_INSTALLS_PER_MONTH = 23_100_000;
export const DOCKER_PULLS = 6_000_000;
export const FORTUNE_500_COMPANIES = 63;
export const FORTUNE_50_COMPANIES = 19;

export const Usage = ({ noPadding = false }: { noPadding?: boolean }) => {
  const stats = [
    {
      name: "SDK installs / month",
      value: SDK_INSTALLS_PER_MONTH,
      showPlus: true,
    },
    { name: "GitHub stars", value: getGitHubStars(), showPlus: false },
    {
      name: "of the Fortune 50",
      value: FORTUNE_50_COMPANIES,
      showPlus: false,
    },
    { name: "Docker pulls", value: DOCKER_PULLS, showPlus: true },
  ];

  return (
    <div className={cn(!noPadding && "py-14")}>
      <h2 className="text-center text-lg font-semibold leading-8 mb-8 text-balance">
        Teams building complex LLM apps rely on Langfuse
      </h2>
      <div className="flex flex-col gap-8">
        <div className="relative">
          <EnterpriseLogoGrid />
        </div>
        <div className="flex flex-row flex-wrap justify-around gap-6 sm:justify-center sm:gap-10">
          {stats.map((item) => (
            <div
              key={item.name}
              className="text-center flex-[1_1_45%] sm:flex-none"
            >
              <p className="text-xl sm:text-2xl font-bold text-primary/80 font-mono">
                <NumberTicker value={item.value} />
                {item.showPlus && (
                  <span className="ml-1 hidden sm:inline">{"+"}</span>
                )}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-primary/70">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function UsageSection() {
  return (
    <HomeSection>
      <Usage />
    </HomeSection>
  );
}
