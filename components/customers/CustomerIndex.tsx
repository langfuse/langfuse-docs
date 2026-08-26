"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CornerBox } from "@/components/ui/corner-box";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { CustomerStory } from "./CustomerCarousel";
import { companyName } from "./customerStoryLabels";

const INITIAL_VISIBLE = 10;

export function CustomerIndex({
  stories: allStories = [],
  maxItems,
  initialVisible,
  showHeader = true,
}: {
  stories?: CustomerStory[];
  maxItems?: number;
  /** Caps the grid before “Show more”. Embeds omit this to show all stories. */
  initialVisible?: number;
  /** Landing-page intro header. Disable for embeds that already have their own. */
  showHeader?: boolean;
}) {
  const resolvedInitialVisible =
    initialVisible ?? (showHeader ? INITIAL_VISIBLE : Number.POSITIVE_INFINITY);

  const customerStories = useMemo(
    () =>
      allStories
        .filter((page) => page.frontMatter?.showInCustomerIndex !== false)
        .slice(0, maxItems),
    [allStories, maxItems],
  );

  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded
    ? customerStories.length
    : Math.min(resolvedInitialVisible, customerStories.length);
  const visibleStories = customerStories.slice(0, visibleCount);
  const hasMore = customerStories.length > resolvedInitialVisible;

  if (customerStories.length === 0) return null;

  return (
    <section className="not-prose">
      {showHeader ? (
        <div className="mb-8 flex flex-col gap-3">
          <Heading as="h2" size="normal" className="max-w-[20ch] text-left">
            Learn from teams building AI on Langfuse
          </Heading>
          <Text className="max-w-[52ch] text-left">
            Real deployments across support agents, tutoring, design tools, and
            enterprise AI platforms. How teams trace, monitor and improve with
            Langfuse.
          </Text>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {visibleStories.map((story, index) => {
          const company = companyName(story);
          const headline = story.frontMatter.title ?? story.route;
          const quote = story.frontMatter.customerQuote;
          const logo = story.frontMatter.customerLogo;
          const logoDark = story.frontMatter.customerLogoDark;
          const withStripes = index % 3 === 1;

          return (
            <CornerBox
              key={story.route}
              withStripes={withStripes}
              hoverStripes={!withStripes}
              className={cn(
                "-mt-px flex min-h-[176px] flex-col p-5 sm:-ml-px sm:p-6",
              )}
            >
              <Link
                href={story.route}
                className="group flex h-full flex-col no-underline outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="mb-4 flex h-8 items-center">
                  {logo ? (
                    <div className="relative h-8 w-[120px]">
                      {logoDark ? (
                        <>
                          <Image
                            src={logo}
                            alt={`${company} logo`}
                            fill
                            sizes="120px"
                            className="object-contain object-left dark:hidden"
                            unoptimized
                          />
                          <Image
                            src={logoDark}
                            alt={`${company} logo`}
                            fill
                            sizes="120px"
                            className="hidden object-contain object-left dark:block"
                            unoptimized
                          />
                        </>
                      ) : (
                        <Image
                          src={logo}
                          alt={`${company} logo`}
                          fill
                          sizes="120px"
                          className="object-contain object-left dark:invert dark:brightness-0 dark:contrast-200"
                          unoptimized
                        />
                      )}
                    </div>
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                      {company}
                    </span>
                  )}
                </div>
                <h3 className="m-0 font-analog text-[20px] font-medium leading-[1.2] tracking-tight text-text-primary sm:text-[21px]">
                  {headline}
                </h3>
                {quote ? (
                  <p className="mt-2 mb-0 line-clamp-2 text-[13px] leading-[1.45] text-text-tertiary">
                    “{quote}”
                  </p>
                ) : story.frontMatter.description ? (
                  <p className="mt-2 mb-0 line-clamp-2 text-[13px] leading-[1.45] text-text-tertiary">
                    {story.frontMatter.description}
                  </p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary transition-colors group-hover:text-text-primary">
                  Read
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </CornerBox>
          );
        })}
      </div>

      {hasMore || showHeader ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          {hasMore ? (
            <Button
              variant="secondary"
              size="default"
              className="w-auto min-w-[160px]"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show fewer stories" : "Show more stories"}
            </Button>
          ) : (
            <span />
          )}
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
            {visibleCount} of {customerStories.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
