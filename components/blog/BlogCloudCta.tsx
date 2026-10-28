"use client";

import NextLink from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HoverCorners } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type BlogCloudCtaProps = {
  /** `stack` for the narrow right column. `row` for the end of the article. */
  layout?: "stack" | "row";
  className?: string;
};

function CtaLink({
  href,
  variant,
  children,
  className,
}: {
  href: string;
  variant: "primary" | "secondary";
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex items-center p-1", className)}>
      <HoverCorners />
      <NextLink
        href={href}
        className={cn(
          buttonVariants({ variant, size: "small" }),
          "justify-center px-2 font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]",
        )}
      >
        {children}
      </NextLink>
    </div>
  );
}

/**
 * Signup and sales actions for blog posts. The stack layout sits under the
 * table of contents. The row layout is the same offer at the end of the
 * article, where the right column is hidden.
 */
export function BlogCloudCta({
  layout = "stack",
  className,
}: BlogCloudCtaProps) {
  const copy = (
    <div className={layout === "row" ? "min-w-0" : undefined}>
      <Text
        size="s"
        className="mb-1 font-[430] text-left text-[13px] text-text-primary"
      >
        Langfuse Cloud
      </Text>
      <Text
        size="s"
        className="text-left text-[13px] text-text-tertiary leading-snug"
      >
        50k observations a month. No credit card.
      </Text>
    </div>
  );

  const actions = (
    <div
      className={cn(
        "flex",
        layout === "row"
          ? "mt-3 flex-col sm:mt-0 sm:shrink-0 sm:flex-row"
          : "mt-3 flex-col",
      )}
    >
      <CtaLink
        href="/cloud"
        variant="primary"
        className={layout === "row" ? "w-full sm:w-[140px]" : "w-full"}
      >
        Start free
      </CtaLink>
      <CtaLink
        href="/talk-to-us"
        variant="secondary"
        className={layout === "row" ? "w-full sm:w-[140px]" : "w-full"}
      >
        Talk to us
      </CtaLink>
    </div>
  );

  if (layout === "row") {
    return (
      <section
        id="blog-cloud-cta"
        aria-label="Langfuse Cloud"
        className={cn(
          "not-prose flex flex-col gap-3 border border-line-structure bg-surface-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        {copy}
        {actions}
      </section>
    );
  }

  return (
    <section aria-label="Langfuse Cloud" className={cn("px-4 py-4", className)}>
      {copy}
      {actions}
    </section>
  );
}
