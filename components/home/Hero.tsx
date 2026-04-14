import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <HomeSection className="pt-[40px]">
      <CornerBox className="-mb-px">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 lg:gap-6 justify-center items-center px-4 py-[10px] min-w-max mx-auto">
            <Text size="s" className="whitespace-nowrap shrink-0">Used by <b className="text-primary">19</b> of Fortune 50</Text>
            <Dot />
            <Text size="s" className="whitespace-nowrap shrink-0"><b className="text-primary">10+ billion</b> observations/month</Text>
            <Dot />
            <Text size="s" className="whitespace-nowrap shrink-0"><b className="text-primary">100,000+</b> engineers building on Langfuse</Text>
          </div>
        </div>
      </CornerBox>
      <CornerBox className="flex flex-col gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
        <Heading
          as="h1"
          size="big"
          className={cn(
            "hidden sm:flex flex-col items-center gap-1.5 text-center font-medium leading-[105%]",
            "[leading-trim:both] [text-edge:cap]"
          )}
        >
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">
            Open Source LLM
          </TextHighlight>
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">
            Engineering Platform
          </TextHighlight>
        </Heading>
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex sm:hidden flex-col items-center gap-1.5 text-center font-medium leading-[105%]",
            "[leading-trim:both] [text-edge:cap]"
          )}
        >
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">
            Open Source
          </TextHighlight>
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">
            LLM Engineering
          </TextHighlight>
          <TextHighlight highlightClassName="mix-blend-multiply" className="whitespace-nowrap">
            Platform
          </TextHighlight>
        </Heading>
        <div className="flex flex-col gap-6">
          <Text className="max-w-xl">
            Debug AI Applications and Agents in minutes. Spot issues before your users do. Collaborate with your team to continuously improve on cost, latency and quality. Any model, any framework. Based on OpenTelemetry.
          </Text>
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
      </CornerBox>
      <CornerBox className="pr-px pb-px -mt-px">
        <EnterpriseLogoGrid />
      </CornerBox>
    </HomeSection>
  );
}
