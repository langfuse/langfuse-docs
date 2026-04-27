import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export const CustomerStoryCTA = () => {
  return (
    <div className="mt-14 not-prose">
      <CornerBox hoverStripes className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10">
        <Heading as="h3" size="normal" className="text-center">
          Ready to get started with Langfuse?
        </Heading>
        <Text className="max-w-lg">
          Join thousands of teams building better LLM applications with
          Langfuse&apos;s open-source observability platform.
        </Text>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <Button variant="primary" href="/cloud">
            Start free
          </Button>
          <Button variant="secondary" href="/docs">
            Documentation
          </Button>
        </div>
        <Text size="s">
          or{" "}
          <Link
            href="/talk-to-us"
            className="text-text-secondary underline underline-offset-4 decoration-line-structure hover:decoration-text-tertiary transition-colors"
          >
            Talk to an expert
          </Link>
        </Text>
        <Text size="s">
          No credit card required · Free tier available · Self-hosting option
        </Text>
      </CornerBox>
    </div>
  );
};
