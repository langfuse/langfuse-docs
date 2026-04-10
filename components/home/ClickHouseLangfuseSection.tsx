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
    <HomeSection id="quickstart" className="pt-20">
      <div
        className={cn(
          "flex flex-col gap-2.5 items-center"
        )}
      >
        <div className="flex max-w-[min(100%,640px)] flex-col items-center gap-8 text-center">
          <div className='flex flex-col gap-4.5 items-center'>
            <Text>ClickHouse x Langfuse</Text>
            <Heading className="text-primary" size="large">
              <span className="block">Traces in 5 minutes.</span>
              <span className="block">No credit card.</span>
            </Heading>
          </div>
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
        <Text size="s" className="w-full max-w-[min(100%,560px)] border-t border-line-structure pt-2.5">
          Free tier: <span className="text-primary">50k observations/month</span>. No credit card required.
        </Text>
      </div>
    </HomeSection>
  );
}
