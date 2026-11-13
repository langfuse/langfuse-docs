import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading, type HeadingLevel } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
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
  /** Heading level for the title. Defaults to h3, matching story and industry pages. */
  headingAs?: HeadingLevel;
  /** Anchor id for the title, used by in-page navigation. */
  titleId?: string;
  className?: string;
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
  footnote = "No credit card required, free tier available, self-hosting option",
  headingAs = "h3",
  titleId,
  className,
}: CustomerStoryCTAProps = {}) => {
  return (
    <div className={cn("mt-14 not-prose", className)}>
      <CornerBox
        hoverStripes
        className="flex flex-col items-center gap-6 px-6 py-10 sm:px-10"
      >
        <Heading
          as={headingAs}
          id={titleId}
          size="normal"
          className={cn("text-center", titleId && "scroll-mt-28")}
        >
          {title}
        </Heading>
        <Text className="max-w-lg">{description}</Text>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <Button
            variant="primary"
            size="default"
            href={primaryCtaHref}
            shortcutKey={primaryCtaLabel.charAt(0)}
          >
            {primaryCtaLabel}
          </Button>
          <Button
            variant="secondary"
            size="default"
            href={secondaryCtaHref}
            shortcutKey={secondaryCtaLabel.charAt(0)}
          >
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
