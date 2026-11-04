import { HomeSection } from "@/components/home/HomeSection";
import { Button, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { AcademyRowVisual } from "@/components/home/academy-loop/AcademyRowVisual";

export const AcademyLoopSection = () => {
  return (
    <HomeSection id="llm-engineering-loop" className="pt-[120px]">
      <div className="relative z-10 flex flex-col gap-4 items-start">
        <Heading className="text-left">
          <TextHighlight className="whitespace-nowrap">
            Learn how&nbsp;
          </TextHighlight>
          <TextHighlight className="whitespace-nowrap">
            the best teams
          </TextHighlight>{" "}
          build with AI.
        </Heading>
        <Text className="text-left max-w-[64ch]">
          Langfuse is the platform. The Langfuse Academy is how you, and your
          agents, learn what to do with it: the AI engineering loop of tracing,
          monitoring, datasets, experiments, and evals, with worked examples
          from real applications. Free, open, and readable as Markdown for
          coding agents.
        </Text>
        <Button
          variant="secondary"
          size="default"
          href="/academy"
          wrapperClassName="mt-2"
        >
          Explore the Academy
        </Button>
      </div>

      <div className="mt-12">
        <AcademyRowVisual />
      </div>
    </HomeSection>
  );
};
