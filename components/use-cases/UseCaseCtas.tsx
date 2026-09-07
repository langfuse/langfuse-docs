import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface UseCaseCtasProps {
  variant?: "inline" | "banner";
}

export function UseCaseCtas({ variant = "inline" }: UseCaseCtasProps) {
  const buttons = (
    <div className="flex flex-col gap-3 items-stretch sm:flex-row sm:items-center not-prose">
      <Button variant="primary" size="default" href="/cloud">
        Start free
      </Button>
      <Button variant="secondary" size="default" href="/talk-to-us">
        Talk to Sales
      </Button>
    </div>
  );

  if (variant === "banner") {
    return (
      <div className="mt-14 not-prose">
        <CornerBox
          hoverStripes
          className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10"
        >
          <Heading as="h3" size="normal" className="text-center">
            Ready to build reliable automation agents?
          </Heading>
          <Text className="max-w-lg">
            Start tracing your workflow agents in minutes, or talk to us about
            how teams like Hugging Face, Ravenna, and Merck run automation on
            Langfuse.
          </Text>
          {buttons}
          <Text size="s">
            No credit card required · Free tier available · Self-hosting option
          </Text>
        </CornerBox>
      </div>
    );
  }

  return <div className="mt-6 mb-2">{buttons}</div>;
}
