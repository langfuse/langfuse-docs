import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";

type CustomerStoryCTAProps = {
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  contactLabel?: string;
  contactHref?: string;
  footnote?: string;
};

export const CustomerStoryCTA = ({
  title = "Ready to get started with Langfuse?",
  description = "Join thousands of teams building better LLM applications with Langfuse's open-source observability platform.",
  primaryCtaLabel = "Start free",
  primaryCtaHref = "/cloud",
  secondaryCtaLabel = "Documentation",
  secondaryCtaHref = "/docs",
  contactLabel = "Talk to an expert",
  contactHref = "/talk-to-us",
  footnote = "No credit card required · Free tier available · Self-hosting option",
}: CustomerStoryCTAProps = {}) => {
  return (
    <div className="mt-14 not-prose">
      <CornerBox
        hoverStripes
        className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10"
      >
        <Heading as="h3" size="normal" className="text-center">
          {title}
        </Heading>
        <Text className="max-w-lg">{description}</Text>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <Button variant="primary" size="default" href={primaryCtaHref}>
            {primaryCtaLabel}
          </Button>
          <Button variant="secondary" size="default" href={secondaryCtaHref}>
            {secondaryCtaLabel}
          </Button>
        </div>
        <Text size="s">
          or{" "}
          <Link
            href={contactHref}
            className="text-text-secondary underline underline-offset-4 decoration-line-structure hover:decoration-text-tertiary transition-colors"
          >
            {contactLabel}
          </Link>
        </Text>
        <Text size="s">{footnote}</Text>
      </CornerBox>
    </div>
  );
};
