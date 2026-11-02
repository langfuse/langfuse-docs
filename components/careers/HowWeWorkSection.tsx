"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import {
  HOW_WE_WORK_EYEBROW,
  HOW_WE_WORK_HEADLINE,
  HOW_WE_WORK_SUBTITLE,
  howWeWorkCtas,
  howWeWorkSteps,
  howWeWorkVisualFacts,
  type HowWeWorkStep,
  type HowWeWorkStepId,
} from "./how-we-work-steps";

/**
 * Step accents, derived from the site palette (--text-links, callout and
 * muted-* tokens), darkened where needed for AA text contrast on light
 * backgrounds. Literal class strings so Tailwind can see them.
 */
const stepAccents: Record<
  HowWeWorkStepId,
  { text: string; chip: string; pill: string; tint: string }
> = {
  customer: {
    text: "text-[#4f39f6] dark:text-[#a5b4fc]",
    chip: "bg-[#4f39f6]",
    pill: "bg-[#4f39f6]/[0.08] dark:bg-[#6366f1]/20",
    tint: "bg-[#4f39f6]/[0.06] dark:bg-[#6366f1]/15",
  },
  rfc: {
    text: "text-[#0e7e85] dark:text-[#5eead4]",
    chip: "bg-[#0e7e85]",
    pill: "bg-[#119da4]/10 dark:bg-[#119da4]/20",
    tint: "bg-[#119da4]/[0.07] dark:bg-[#119da4]/15",
  },
  build: {
    text: "text-[#4d7a12] dark:text-[#bef264]",
    chip: "bg-[#4d7a12]",
    pill: "bg-[#7ecb12]/[0.14] dark:bg-[#7ecb12]/20",
    tint: "bg-[#7ecb12]/[0.08] dark:bg-[#7ecb12]/15",
  },
  ship: {
    text: "text-[#9a6b00] dark:text-[#fcd34d]",
    chip: "bg-[#9a6b00]",
    pill: "bg-[#e09d00]/[0.11] dark:bg-[#e09d00]/20",
    tint: "bg-[#e09d00]/[0.08] dark:bg-[#e09d00]/15",
  },
  offsite: {
    text: "text-[#b91c6e] dark:text-[#f9a8d4]",
    chip: "bg-[#b91c6e]",
    pill: "bg-[#f76eb2]/[0.12] dark:bg-[#f76eb2]/20",
    tint: "bg-[#f76eb2]/[0.09] dark:bg-[#f76eb2]/15",
  },
};

const visualAltTexts: Record<HowWeWorkStepId, string> = {
  customer:
    "Cropped GitHub discussion where users shaped the evals revamp, with 29 upvotes and 8 comments",
  rfc: "Cropped RFC document for the evals revamp, open for comments with threads from the team",
  build:
    "Cropped merged pull request for the evals revamp with 25 commits and about 3,400 added lines",
  ship: "Cropped Experiments changelog post next to the launch checklist",
  offsite:
    "Placeholder for a team photo from the Tokyo offsite, to be replaced with a real photo",
};

function SkeletonLine({ className }: { className?: string }) {
  return (
    <span className={cn("block h-1.5 rounded-full bg-surface-2", className)} />
  );
}

function BrowserFrame({
  source,
  children,
}: {
  source: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-line-structure bg-card shadow-sm">
      <div className="flex h-6 shrink-0 items-center gap-1 border-b border-line-structure/60 bg-surface-1 px-2">
        <span className="size-[5px] rounded-full bg-line-structure" />
        <span className="size-[5px] rounded-full bg-line-structure" />
        <span className="size-[5px] rounded-full bg-line-structure" />
        <span className="ml-1 truncate font-mono text-[8px] text-text-disabled">
          {source}
        </span>
      </div>
      <div className="min-h-0 flex-1 p-2.5">{children}</div>
    </div>
  );
}

function StepVisual({ id }: { id: HowWeWorkStepId }) {
  const facts = howWeWorkVisualFacts;
  switch (id) {
    case "customer":
      return (
        <BrowserFrame source={facts.discussion.source}>
          <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-text-primary">
            {facts.discussion.title}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="rounded border border-line-structure px-1.5 py-px font-mono text-[8px] text-text-secondary">
              ▲ {facts.discussion.upvotes}
            </span>
            <span className="text-[8px] text-text-tertiary">
              {facts.discussion.comments} comments
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-full bg-muted-blue/40" />
              <SkeletonLine className="w-4/5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 shrink-0 rounded-full bg-muted-magenta/40" />
              <SkeletonLine className="w-3/5" />
            </div>
          </div>
        </BrowserFrame>
      );
    case "rfc":
      return (
        <BrowserFrame source={facts.rfc.source}>
          <p className="text-[10px] font-semibold leading-tight text-text-primary">
            {facts.rfc.title}
          </p>
          <div className="mt-1.5">
            <span className="rounded bg-[#119da4]/10 px-1.5 py-px font-mono text-[8px] text-[#0e7e85] dark:bg-[#119da4]/20 dark:text-[#5eead4]">
              {facts.rfc.status}
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="rounded bg-surface-bg px-1.5 py-1">
              <span className="text-[8px] font-semibold text-text-secondary">
                Marc
              </span>
              <SkeletonLine className="mt-1 w-5/6" />
            </div>
            <div className="rounded bg-surface-bg px-1.5 py-1">
              <span className="text-[8px] font-semibold text-text-secondary">
                Clemens
              </span>
              <SkeletonLine className="mt-1 w-2/3" />
            </div>
          </div>
        </BrowserFrame>
      );
    case "build":
      return (
        <BrowserFrame source={facts.pullRequest.source}>
          <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-text-primary">
            {facts.pullRequest.title}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="rounded-full bg-[#8250df] px-1.5 py-px text-[8px] font-semibold text-white">
              Merged
            </span>
            <span className="font-mono text-[8px] text-text-tertiary">
              #{facts.pullRequest.number}
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[8px] text-text-tertiary">
            <span className="text-[#1a7f37] dark:text-[#3fb950]">
              {facts.pullRequest.additions}
            </span>{" "}
            <span className="text-[#cf222e] dark:text-[#f85149]">
              {facts.pullRequest.deletions}
            </span>{" "}
            · {facts.pullRequest.commits} commits
          </p>
          <div className="mt-1.5 space-y-1">
            <div className="flex gap-0.5">
              <span className="h-1 w-3/5 rounded-full bg-[#7ecb12]/40" />
              <span className="h-1 w-1/6 rounded-full bg-[#cf222e]/30" />
            </div>
            <div className="flex gap-0.5">
              <span className="h-1 w-2/5 rounded-full bg-[#7ecb12]/40" />
              <span className="h-1 w-1/4 rounded-full bg-[#cf222e]/30" />
            </div>
          </div>
        </BrowserFrame>
      );
    case "ship":
      return (
        <BrowserFrame source={facts.changelog.source}>
          <p className="font-mono text-[7px] uppercase tracking-wider text-[#9a6b00] dark:text-[#fcd34d]">
            Changelog
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-tight text-text-primary">
            {facts.changelog.title}
          </p>
          <p className="mt-0.5 text-[8px] text-text-tertiary">
            {facts.changelog.date}
          </p>
          <ul className="mt-1.5 space-y-1">
            {facts.changelog.checklist.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check
                  className="size-2.5 shrink-0 text-[#1a7f37] dark:text-[#3fb950]"
                  strokeWidth={3}
                />
                <span className="text-[8px] text-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </BrowserFrame>
      );
    case "offsite":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-md border-[1.5px] border-dashed border-[#b91c6e]/45 bg-card/60 p-2 text-center">
          <Camera className="size-5 text-[#b91c6e] dark:text-[#f9a8d4]" />
          <span className="text-[10px] font-semibold text-text-primary">
            {facts.offsite.title}
          </span>
          <span className="font-mono text-[8px] text-text-disabled">
            {facts.offsite.note}
          </span>
        </div>
      );
  }
}

function StepTile({
  step,
  className,
}: {
  step: HowWeWorkStep;
  className?: string;
}) {
  const accent = stepAccents[step.id];
  return (
    <Link
      href={step.href}
      className={cn(
        "group/tile flex h-full flex-col gap-2.5 rounded-lg border border-line-structure bg-card p-4 no-underline shadow-sm",
        "transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-1 hover:border-text-disabled hover:shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-links focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 self-start rounded-full py-[3px] pl-[3px] pr-2.5",
          accent.pill,
        )}
      >
        <span
          className={cn(
            "flex size-[18px] items-center justify-center rounded-full text-[10px] font-semibold text-white",
            accent.chip,
          )}
        >
          {step.number}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] font-medium tracking-wide",
            accent.text,
          )}
        >
          {step.label}
        </span>
      </span>
      <div
        role="img"
        aria-label={visualAltTexts[step.id]}
        className={cn("h-[180px] rounded-md p-2", accent.tint)}
      >
        <div aria-hidden className="h-full">
          <StepVisual id={step.id} />
        </div>
      </div>
      <p className="text-[15px] font-semibold leading-snug text-text-primary">
        {step.caption}
      </p>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-text-links">
        How we do this
        <ArrowRight
          className="size-3 transition-transform group-hover/tile:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

function MobileCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="lg:hidden">
      <div className="relative">
        <Carousel setApi={setApi} opts={{ align: "start" }}>
          <CarouselContent viewportClassName="py-1" className="-ml-3">
            {howWeWorkSteps.map((step) => (
              <CarouselItem key={step.id} className="basis-[272px] pl-3">
                <StepTile step={step} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {howWeWorkSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Go to step ${step.number}: ${step.label}`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === current
                ? "w-4 bg-text-primary"
                : "w-1.5 bg-line-structure hover:bg-text-disabled",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * "How we work" journey on the careers page: five steps from customer call to
 * offsite, each linking to the matching handbook page. Five-across row with
 * connecting arrows at lg+, swipe carousel with snap scrolling below.
 */
export function HowWeWorkSection() {
  return (
    <section
      aria-labelledby="how-we-work-heading"
      className="not-prose relative left-1/2 my-16 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-text-tertiary">
          {HOW_WE_WORK_EYEBROW}
        </p>
        <h2
          id="how-we-work-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
        >
          {HOW_WE_WORK_HEADLINE}
        </h2>
        <p className="text-balance text-base text-text-tertiary">
          {HOW_WE_WORK_SUBTITLE}
        </p>
      </div>

      <div className="mt-10">
        <div className="hidden items-stretch lg:flex">
          {howWeWorkSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div
                  aria-hidden
                  className="flex w-7 shrink-0 items-center justify-center"
                >
                  <ArrowRight className="size-4 text-text-disabled" />
                </div>
              )}
              <StepTile step={step} className="min-w-0 flex-1" />
            </React.Fragment>
          ))}
        </div>
        <MobileCarousel />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <Button
          href={howWeWorkCtas[0].href}
          variant="primary"
          size="default"
          wrapperClassName="w-full sm:w-auto"
        >
          {howWeWorkCtas[0].label}
        </Button>
        <Button
          href={howWeWorkCtas[1].href}
          variant="secondary"
          size="default"
          wrapperClassName="w-full sm:w-auto"
        >
          {howWeWorkCtas[1].label}
        </Button>
      </div>
    </section>
  );
}
