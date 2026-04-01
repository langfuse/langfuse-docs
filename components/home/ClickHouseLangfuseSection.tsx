import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HomeSection } from "@/components/home/HomeSection";
import { ClickHouseLangfuseCodeBlocks } from "@/components/home/ClickHouseLangfuseCodeBlocks";
import { cn } from "@/lib/utils";

/**
 * Marketing block: ClickHouse × Langfuse quickstart (not the main page hero).
 */
export function ClickHouseLangfuseSection() {
  return (
    <HomeSection className="pt-6 pb-6 sm:pt-8 sm:pb-10">
      <div
        className={cn(
          "flex flex-col gap-8 items-center px-4 py-10 sm:gap-10 sm:py-12",
          "rounded-sm border pattern-bg border-line-structure bg-surface-1"
        )}
      >
        <div className="flex max-w-[min(100%,640px)] flex-col items-center gap-6 text-center">
          <Text size="s" className="text-text-tertiary">
            ClickHouse × Langfuse
          </Text>
          <Heading>
            <span className="block">Traces in 5 minutes.</span>
            <span className="block">No credit card.</span>
          </Heading>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant="primary"
              shortcutKey="s"
              href="https://cloud.langfuse.com"
            >
              Start free
            </Button>
            <Button variant="secondary" shortcutKey="d" href="/docs">
              Documentation
            </Button>
          </div>
        </div>
        <ClickHouseLangfuseCodeBlocks />
        <Text size="s" className="max-w-xl text-text-tertiary">
          Free tier: 50k observations/month. No credit card required.
        </Text>
      </div>
    </HomeSection>
  );
}
