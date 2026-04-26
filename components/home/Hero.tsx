import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { cn } from "@/lib/utils";
import { HeroStatsStrip } from "@/components/home/HeroStatsStrip";

export function Hero() {
  return (
    <HomeSection className="pt-5 sm:pt-8 md:pt-[60px]">
      <CornerBox className="-mb-px flex items-center justify-center py-2.5 px-4">
        <Link
          href="/japan"
          className="inline-flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors group"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[.08em] text-text-tertiary">New</span>
            <span className="w-px h-3 bg-line-structure" />
            <span className="font-semibold">Langfuse Cloud Japan — 東京リージョン稼働中</span>
          </span>
          <span className="text-text-tertiary group-hover:text-text-secondary transition-colors">→</span>
        </Link>
      </CornerBox>
      <CornerBox className="-mb-px -mt-px">
        <HeroStatsStrip />
      </CornerBox>
      <CornerBox className="flex flex-col gap-4 sm:gap-8 md:gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 text-center font-medium leading-[105%] max-md:max-w-[500px]",
            "[leading-trim:both] [text-edge:cap]"
          )}
        >
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">Open Source<span className="inline max-[499px]:hidden">&nbsp;</span></TextHighlight>
          <span className="flex min-[500px]:inline">
            <TextHighlight highlightClassName="mix-blend-multiply" className="max-[499px]:pr-1.75">LLM</TextHighlight>
            <TextHighlight highlightClassName="mix-blend-multiply" className="min-[500px]:pr-2">Engineering</TextHighlight>
          </span>
          <TextHighlight highlightClassName="mix-blend-multiply">Platform</TextHighlight>
        </Heading>
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex sm:hidden flex-col items-center gap-1.5 text-center font-medium leading-[105%]",
            "[leading-trim:both] [text-edge:cap]"
          )}
        >

        </Heading>
        <div className="flex flex-col gap-6">
          <Text className="max-w-xl">
            Debug AI Applications and Agents in minutes. Spot issues before your users do. Collaborate with your team to continuously improve on cost, latency and quality. <span className="hidden md:inline">Any model, any framework. Based on OpenTelemetry.</span>
          </Text>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant="primary"
              shortcutKey="s"
              href="/cloud"
            >
              Start free
            </Button>
            <Button variant="secondary" shortcutKey="d" href="/docs">
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
