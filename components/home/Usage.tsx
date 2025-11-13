import { HomeSection } from "./components/HomeSection";
import NumberTicker from "@/components/ui/number-ticker";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { getGitHubStars } from "@/lib/github-stars";
import { cn } from "@/lib/utils";

// Export usage stats constants
export const SDK_INSTALLS_PER_MONTH = 14_800_000;
export const DOCKER_PULLS = 6_000_000;

export const Usage = ({ noPadding = false }: { noPadding?: boolean }) => {
  const stats = [
    {
      name: "SDK installs / month",
      value: SDK_INSTALLS_PER_MONTH,
      showPlus: true,
    },
    { name: "GitHub stars", value: getGitHubStars(), showPlus: false },
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
        <div className="flex flex-row justify-around sm:justify-center sm:gap-10">
          {stats.map((item) => (
            <div key={item.name} className="text-center">
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
