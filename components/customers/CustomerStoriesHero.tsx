"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CustomerStory } from "./CustomerCarousel";
import { companyName } from "./customerStoryLabels";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5500;

export function CustomerStoriesHero({
  stories: allStories,
}: {
  stories: CustomerStory[];
}) {
  const stories = useMemo(
    () =>
      allStories.filter(
        (s) =>
          s.frontMatter?.showInCustomerIndex !== false &&
          Boolean(s.frontMatter.customerQuote),
      ),
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
  const metaBits = [
    story.frontMatter.quoteRole,
    story.frontMatter.description
      ? story.frontMatter.description.split(/[.!?]/)[0]
      : null,
  ].filter(Boolean) as string[];

  return (
    <section
      className="relative overflow-hidden bg-surface-code text-[#F6F6F3]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured customer stories"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#2a2a27_0%,#3a3a36_55%,#2f2f2c_100%)]" />
      <div className="relative grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:gap-10 lg:py-12">
        <div className="flex min-w-0 flex-col">
          <div className="mb-8 flex items-start justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
              Customer stories
            </p>
            <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
              <span>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(stories.length).padStart(2, "0")}
              </span>
              <span className="hidden text-white/30 sm:inline">·</span>
              <span className="hidden sm:inline">
                {paused ? "paused" : "auto-plays"}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={story.route}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              <p className="mb-4 font-analog text-[28px] font-medium leading-none tracking-tight text-[#FBFF7A] sm:text-[34px]">
                {company}
              </p>
              <blockquote className="m-0 max-w-[38rem] border-0 p-0 font-analog text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white sm:text-[34px] lg:text-[40px]">
                “{quote}”
              </blockquote>

              <div className="mt-auto flex flex-col gap-5 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-white/55">
                  {metaBits.slice(0, 2).map((bit) => (
                    <span key={bit} className="max-w-[28ch] truncate">
                      {bit}
                    </span>
                  ))}
                </div>
                <Link
                  href={story.route}
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-[#FBFF7A] no-underline transition-opacity hover:opacity-80"
                >
                  Read the story
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden min-w-0 flex-col justify-center border-l border-white/10 pl-6 lg:flex">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {stories.map((s, i) => {
              const isActive = i === active;
              const name = companyName(s);
              const logo =
                s.frontMatter.customerLogoDark ?? s.frontMatter.customerLogo;
              return (
                <li key={s.route}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors",
                      isActive ? "bg-white/10" : "hover:bg-white/5",
                    )}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Show ${name} story`}
                  >
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-white/10 bg-white/5 p-1.5">
                      {logo ? (
                        <Image
                          src={logo}
                          alt=""
                          width={80}
                          height={32}
                          className="h-6 w-auto max-w-full object-contain brightness-0 invert"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-[13px]",
                        isActive ? "text-white" : "text-white/55",
                      )}
                    >
                      {name}
                    </span>
                    <span
                      className={cn(
                        "h-8 w-0.5 shrink-0 rounded-full transition-colors",
                        isActive ? "bg-[#FBFF7A]" : "bg-transparent",
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
                    ? "border-[#FBFF7A]/60 bg-[#FBFF7A]/10 text-[#FBFF7A]"
                    : "border-white/15 text-white/55 hover:border-white/30 hover:text-white/80",
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
