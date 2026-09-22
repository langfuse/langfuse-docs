import { WrappedSection } from "./components/WrappedSection";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <WrappedSection
      id="overview"
      className="pt-5 sm:pt-8 md:pt-[60px] lg:pt-[60px]"
    >
      <CornerBox className="flex flex-col gap-4 sm:gap-6 items-center px-4 py-10 sm:px-8 sm:py-14">
        <Text size="s" className="text-text-tertiary">
          2025
        </Text>
        <Heading
          as="h1"
          size="big"
          className={cn(
            "flex flex-col items-center gap-0.5 sm:gap-1 text-center font-medium leading-[105%]",
            "[leading-trim:both] [text-edge:cap]",
          )}
        >
          <TextHighlight highlightClassName="mix-blend-multiply">
            Langfuse
          </TextHighlight>
          <TextHighlight highlightClassName="mix-blend-multiply">
            Wrapped
          </TextHighlight>
        </Heading>
        <Text className="max-w-xl">A year in review</Text>
      </CornerBox>
    </WrappedSection>
  );
}
