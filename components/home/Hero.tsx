import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { HeroStatsStrip } from "@/components/home/HeroStatsStrip";
import { HeroSlogan } from "@/components/home/HeroSlogan";
import type { HeroSloganVariant } from "@/lib/hero-slogan-variant";

export function Hero({
  heroSloganVariant,
}: {
  heroSloganVariant: HeroSloganVariant;
}) {
  return (
    <HomeSection className="pt-5 sm:pt-8 md:pt-[60px]">
      <CornerBox className="-mb-px -mt-px">
        <HeroStatsStrip />
      </CornerBox>
      <CornerBox className="flex flex-col gap-4 sm:gap-8 md:gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
        <HeroSlogan initialVariant={heroSloganVariant} />
        <div className="flex flex-col gap-6">
          <Text className="max-w-xl">
            Trace and evaluate AI Agents. Collaborate with your team to
            continuously improve quality, cost and latency of your application.
          </Text>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant="primary"
              size="default"
              shortcutKey="s"
              href="/cloud"
            >
              Start free
            </Button>
            <Button
              variant="secondary"
              size="default"
              shortcutKey="d"
              href="/docs"
            >
              Documentation
            </Button>
          </div>
        </div>
      </CornerBox>
      <CornerBox className="pr-px pb-px -mt-px">
        <EnterpriseLogoGrid />
      </CornerBox>
    </HomeSection>
  );
}
