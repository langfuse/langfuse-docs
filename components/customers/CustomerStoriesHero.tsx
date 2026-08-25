"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CustomerStory } from "./CustomerCarousel";
import { companyName } from "./customerStoryLabels";
import { TextHighlight } from "@/components/ui/text-highlight";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5500;

function HighlightedQuote({
  quote,
  highlight,
}: {
  quote: string;
  highlight?: string;
}) {
  if (!highlight) return <>“{quote}”</>;

  const start = quote.indexOf(highlight);
  if (start === -1) return <>“{quote}”</>;

  return (
    <>
      “{quote.slice(0, start)}
      <TextHighlight>{highlight}</TextHighlight>
      {quote.slice(start + highlight.length)}”
    </>
  );
}

export function CustomerStoriesHero({
  stories: allStories,
}: {
  stories: CustomerStory[];
}) {
  const stories = useMemo(
    () =>
      allStories
        .filter(
          (s) =>
            s.frontMatter?.showInCustomerIndex !== false &&
            Boolean(s.frontMatter.customerQuote),
        )
        .slice(0, 6),
    [allStories],
  );

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || stories.length < 2) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % stories.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, stories.length]);

  if (stories.length === 0) return null;

  const story = stories[active];
  const company = companyName(story);
  const quote = story.frontMatter.customerQuote!;
  const quoteHighlight = story.frontMatter.customerQuoteHighlight;
  const quoteTag = story.frontMatter.customerQuoteTag;
  const quoteAuthor = story.frontMatter.quoteAuthor;
  const quoteRole = story.frontMatter.quoteRole;
  const logo = story.frontMatter.customerLogo;

  return (
    <section
      className="relative overflow-hidden border-y border-line-structure bg-surface-bg text-text-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured customer stories"
    >
      <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:min-h-[580px] lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:gap-10 lg:py-12">
        <div className="flex min-w-0 flex-col">
          <div className="mb-8 flex items-start justify-between gap-4">
            <h1 className="m-0 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-text-tertiary">
              Customer stories
            </h1>
            <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
              <span>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(stories.length).padStart(2, "0")}
              </span>
              <span className="hidden text-text-disabled sm:inline">·</span>
              <span className="hidden sm:inline">
                {paused ? "paused" : "auto-plays"}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={story.route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-5 flex h-10 items-center">
                {logo ? (
                  <div className="relative h-10 w-40">
                    <Image
                      src={logo}
                      alt={`${company} logo`}
                      fill
                      sizes="160px"
                      className="object-contain object-left"
                      unoptimized
                    />
                  </div>
                ) : (
                  <p className="font-analog text-[28px] font-medium leading-none tracking-tight text-text-primary sm:text-[34px]">
                    {company}
                  </p>
                )}
              </div>
              <blockquote className="m-0 max-w-[38rem] border-0 p-0 font-analog text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-text-primary sm:text-[34px] lg:text-[40px]">
                <HighlightedQuote quote={quote} highlight={quoteHighlight} />
              </blockquote>
              {quoteTag && (
                <span className="mt-4 inline-flex w-fit bg-[#FBFF7A] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">
                  {quoteTag}
                </span>
              )}

              {(quoteAuthor || quoteRole) && (
                <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
                  {quoteAuthor && (
                    <span className="font-medium text-text-primary">
                      {quoteAuthor}
                    </span>
                  )}
                  {quoteRole && (
                    <span className="text-text-tertiary">{quoteRole}</span>
                  )}
                </div>
              )}

              <div className="mt-auto flex justify-end pt-10">
                <Link
                  href={story.route}
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-text-secondary no-underline transition-colors hover:text-text-primary"
                >
                  Read the story
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden min-w-0 flex-col justify-center border-l border-line-structure pl-6 lg:flex">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {stories.map((s, i) => {
              const isActive = i === active;
              const name = companyName(s);
              const logo = s.frontMatter.customerLogo;
              return (
                <li key={s.route}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-4 rounded-sm py-2.5 pr-3 pl-5 text-left transition-colors",
                      isActive ? "bg-surface-bg" : "hover:bg-surface-1",
                    )}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Show ${name} story`}
                  >
                    <div className="flex h-8 min-w-0 flex-1 items-center">
                      {logo ? (
                        <div className="relative h-7 w-28">
                          <Image
                            src={logo}
                            alt=""
                            fill
                            sizes="112px"
                            className="object-contain object-left"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="font-analog text-[24px] font-medium leading-none text-text-primary">
                          {name}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "h-8 w-0.5 shrink-0 rounded-full transition-colors",
                        isActive ? "bg-text-primary" : "bg-transparent",
                      )}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.route}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors",
                  isActive
                    ? "border-line-cta bg-surface-bg text-text-primary"
                    : "border-line-structure text-text-tertiary hover:text-text-primary",
                )}
              >
                {companyName(s)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
