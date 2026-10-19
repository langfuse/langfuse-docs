import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { TextHighlight } from "@/components/ui/text-highlight";
import {
  compareLanding as content,
  FORTUNE_50_TOKEN,
  OBSERVATIONS_TOKEN,
} from "@/lib/compare-landing-data";
import {
  FORTUNE_50_COMPANIES,
  formatObservationsPerMonth,
} from "@/lib/usage-stats";

const heroDescription = content.hero.description
  .replace(FORTUNE_50_TOKEN, String(FORTUNE_50_COMPANIES))
  .replace(OBSERVATIONS_TOKEN, formatObservationsPerMonth());
import { cn } from "@/lib/utils";
import styles from "./compare-landing.module.css";

const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-8";
const eyebrow =
  "font-mono text-[11px] uppercase tracking-[0.04em] text-text-tertiary";
const heading =
  "scroll-mt-28 font-analog font-medium leading-[1.05] text-text-primary text-pretty";
const body = "text-[14px] leading-[1.5] text-text-tertiary text-pretty";
const textLink =
  "text-[13px] text-primary transition-colors hover:text-text-primary";

function Arrow() {
  return <ArrowRight aria-hidden className="inline size-3.5 shrink-0" />;
}

function VendorCard({ vendor }: { vendor: (typeof content.vendors)[number] }) {
  return (
    <CornerBox
      className={cn(
        styles.vendorCard,
        "isolate flex min-w-0 flex-col rounded-[2px] transition-colors hover:bg-surface-1",
      )}
    >
      <div className="flex flex-col gap-2 px-5 pt-6 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-[20px] font-medium leading-[1.3] text-text-primary">
            vs. {vendor.name}
          </h3>
          <span className={cn(eyebrow, "shrink-0 text-[10px]")}>
            {vendor.idx}
          </span>
        </div>
        <p className={body}>{vendor.body}</p>
      </div>
      <div className={cn(styles.factField, "mx-px mt-auto")}>
        <ul
          className={styles.factPlane}
          aria-label={`${vendor.name} comparison facts`}
        >
          {vendor.chips.map((chip) => (
            <li
              key={chip.text}
              className={cn(
                styles.factChip,
                "inline-flex items-center gap-1.5 rounded-[2px] border px-[9px] py-[5px] font-mono text-[11px]",
                chip.dark
                  ? "border-text-primary bg-text-primary text-surface-bg shadow-sm"
                  : "border-line-cta bg-surface-bg text-text-secondary shadow-sm",
                chip.faint &&
                  "border-line-structure text-text-tertiary shadow-none",
              )}
              style={
                {
                  "--chip-x": `${chip.x}%`,
                  "--chip-y": `${chip.y}px`,
                } as React.CSSProperties
              }
            >
              {chip.text}
              {chip.dot && (
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    chip.dot === "positive"
                      ? "bg-[var(--callout-success)]"
                      : "bg-[var(--callout-error)]",
                  )}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dashed border-line-divider-dash px-5 pb-5 pt-3.5 sm:px-6">
        <Link
          href={vendor.compare}
          className="text-[13px] font-medium text-text-primary underline-offset-4 after:absolute after:inset-0 after:z-10 after:cursor-pointer after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
          aria-label={`Full ${vendor.name} comparison`}
        >
          Full comparison <Arrow />
        </Link>
        {vendor.migrate && (
          <div className="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[13px] text-text-tertiary">
            {vendor.migrate2 && <span>Migration:</span>}
            <Link
              href={vendor.migrate}
              className="relative z-20 underline decoration-line-cta underline-offset-4 hover:text-text-primary"
              aria-label={`${vendor.name}: ${vendor.migrate2 ? `${vendor.migrateLabel} migration guide` : vendor.migrateLabel}`}
            >
              {vendor.migrateLabel}
            </Link>
            {vendor.migrate2 && (
              <Link
                href={vendor.migrate2}
                className="relative z-20 underline decoration-line-cta underline-offset-4 hover:text-text-primary"
                aria-label={`${vendor.migrate2Label} migration guide`}
              >
                {vendor.migrate2Label}
              </Link>
            )}
          </div>
        )}
      </div>
    </CornerBox>
  );
}

export function CompareLanding() {
  return (
    <div className="@container/compare bg-surface-bg text-text-primary">
      <section
        className={cn(
          container,
          "grid items-center gap-10 pb-12 pt-10 @min-[900px]/compare:grid-cols-2 @min-[900px]/compare:gap-12 lg:pb-16 lg:pt-12",
        )}
        aria-labelledby="compare-heading"
      >
        <div>
          <p className={cn(eyebrow, "mb-6")}>{content.hero.eyebrow}</p>
          <h1
            id="compare-heading"
            className={cn(
              heading,
              "text-[clamp(40px,5.2cqw,68px)] leading-none tracking-[-0.01em]",
            )}
          >
            {content.hero.lines.map((line, index) => (
              <span key={line} className="block">
                {index === content.hero.lines.length - 1 ? (
                  <TextHighlight highlightClassName="bg-surface-cta-primary">
                    {line}
                  </TextHighlight>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[520px] text-pretty text-[16px] leading-[1.5] text-text-secondary">
            {heroDescription}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Button
              href="https://cloud.langfuse.com"
              aria-label="Start free"
              size="default"
              shortcutKey="s"
              className="h-9 px-3.5"
            >
              Start free
            </Button>
            <Button
              href="/talk-to-us"
              aria-label="Talk to us"
              variant="secondary"
              size="default"
              shortcutKey="t"
              className="h-9 px-3.5"
            >
              Talk to us
            </Button>
            <Link
              href="#migrate"
              className="ml-1 text-[13px] text-text-tertiary hover:text-text-primary"
            >
              Migration guides <Arrow />
            </Link>
          </div>
        </div>
        <ol
          className="flex w-full min-w-0 flex-col gap-3 @min-[600px]/compare:w-[90%] @min-[600px]/compare:justify-self-center @min-[900px]/compare:justify-self-end"
          aria-label="Learn about Langfuse"
        >
          {content.contextCards.map((card) => (
            <li key={card.n}>
              <Link href={card.link} className="group block rounded-[2px]">
                <CornerBox className="grid grid-cols-[24px_1fr] items-start gap-3 rounded-[2px] px-4 py-[18px] transition-colors group-hover:bg-surface-1 sm:grid-cols-[32px_1fr] sm:gap-3.5 sm:px-[18px]">
                  <span
                    className="pt-0.5 font-mono text-[12px] text-text-tertiary"
                    aria-hidden
                  >
                    {card.n}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium leading-[1.4]">
                      {card.title}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-[1.5] text-text-tertiary">
                      {card.body}
                    </p>
                    <span
                      className={cn(
                        textLink,
                        "mt-2.5 inline-block group-hover:underline underline-offset-4",
                      )}
                    >
                      {card.linkLabel} <Arrow />
                    </span>
                  </div>
                </CornerBox>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={cn(container, "relative pb-6")}
        aria-labelledby="platform-comparisons"
      >
        <div className="mb-8 max-w-[800px]">
          <h2
            id="platform-comparisons"
            className={cn(heading, "text-[32px] sm:text-[40px]")}
          >
            {content.headings.comparisons}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.5] text-text-tertiary">
            {content.copy.methodology} {content.copy.correctionPrompt}{" "}
            <a
              href={content.copy.correctionLink}
              className="underline underline-offset-4 hover:text-text-primary"
            >
              {content.copy.correctionLabel}
            </a>{" "}
            {content.copy.correctionSuffix}
          </p>
        </div>
        <div className="grid gap-4 @min-[900px]/compare:grid-cols-2">
          {content.vendors.map((vendor) => (
            <VendorCard key={vendor.name} vendor={vendor} />
          ))}
        </div>
        <div className="mt-12 grid gap-6 @min-[600px]/compare:grid-cols-[1fr_auto] @min-[600px]/compare:gap-8">
          {content.comparisonResources.map((resource) => (
            <div key={resource.title}>
              <h3 className="text-[16px] font-medium leading-[1.5] text-text-primary">
                {resource.title}
              </h3>
              <Link
                href={resource.link}
                className="mt-3 inline-block text-[14px] text-text-secondary underline decoration-line-cta underline-offset-4 hover:text-text-primary"
              >
                {resource.linkLabel} <Arrow />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section
        className={cn(
          container,
          "border-t border-line-structure py-12 lg:pb-[72px]",
        )}
        aria-labelledby="why-langfuse"
      >
        <h2
          id="why-langfuse"
          className={cn(heading, "max-w-[720px] text-[32px] sm:text-[40px]")}
        >
          {content.headings.pillars}
        </h2>
        <p className={cn(body, "mt-4")}>
          {content.pillarsIntro.map((part, index) =>
            part.link ? (
              <Link
                key={index}
                href={part.link}
                className="text-text-secondary underline decoration-line-cta underline-offset-4 hover:text-text-primary"
              >
                {part.text}
              </Link>
            ) : (
              part.text
            ),
          )}
        </p>
        <div className="mt-8 grid gap-8 @min-[800px]/compare:grid-cols-3">
          {content.pillars.map((pillar) => (
            <div key={pillar.n} className="flex flex-col items-start gap-3">
              <span className="font-mono text-[12px] text-text-tertiary">
                {pillar.n}
              </span>
              <h3 className={cn(heading, "text-[24px] leading-[1.15]")}>
                {pillar.title}
              </h3>
              <p className={body}>{pillar.body}</p>
              <Link href={pillar.link} className={cn(textLink, "mt-1")}>
                {pillar.linkLabel} <Arrow />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border-t border-line-structure"
        aria-labelledby="customer-stories"
      >
        <div className={cn(container, "py-12 lg:pb-[72px] lg:pt-16")}>
          <h2
            id="customer-stories"
            className={cn(heading, "max-w-[640px] text-[32px] leading-[1.1]")}
          >
            {content.headings.customers}
          </h2>
          <p className={cn(body, "mt-4")}>
            {content.customerStories.description}{" "}
            <Link
              href={content.customerStories.link}
              className="text-text-secondary underline decoration-line-cta underline-offset-4 hover:text-text-primary"
            >
              {content.customerStories.linkLabel} <Arrow />
            </Link>
          </p>
          <div className="mt-8 grid gap-4 @min-[800px]/compare:grid-cols-3">
            {content.quotes.map((quote) => (
              <Link
                key={quote.company}
                href={quote.link}
                className="block rounded-[2px]"
              >
                <CornerBox className="flex h-full flex-col gap-4 rounded-[2px] p-6 transition-colors hover:bg-surface-1">
                  <p className={eyebrow}>{quote.company}</p>
                  {quote.isQuote ? (
                    <blockquote className="font-analog text-[20px] leading-[1.25] text-pretty">
                      “{quote.text}”
                    </blockquote>
                  ) : (
                    <p className="font-analog text-[20px] leading-[1.25] text-pretty">
                      {quote.text}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-2.5">
                    {quote.avatar ? (
                      <Image
                        src={quote.avatar}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 rounded-full border border-line-structure object-cover"
                      />
                    ) : (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-structure bg-surface-2">
                        <BookOpen
                          aria-hidden
                          className="size-3.5 text-text-tertiary"
                        />
                      </span>
                    )}
                    <p className="text-[12px] leading-[1.5] text-text-tertiary">
                      {quote.who}
                    </p>
                  </div>
                </CornerBox>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-line-structure"
        aria-labelledby="integrations-heading"
      >
        <div
          className={cn(
            container,
            "grid gap-10 py-12 @min-[720px]/compare:grid-cols-2 lg:pb-[72px] lg:pt-16",
          )}
        >
          <div>
            <h2
              id="integrations-heading"
              className={cn(heading, "max-w-[360px] text-[40px] leading-none")}
            >
              {content.headings.integrations.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className={cn(body, "mt-4 max-w-[400px]")}>
              {content.copy.integrations}
            </p>
            <Link
              href="/integrations"
              className={cn(textLink, "mt-3.5 inline-block")}
            >
              All 100+ integrations <Arrow />
            </Link>
          </div>
          <div className="flex flex-col gap-[18px]">
            {content.integrations.map((group) => (
              <div key={group.group}>
                <h3 className={cn(eyebrow, "mb-2 text-[10px]")}>
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-[2px] border border-line-structure px-[9px] py-1 text-[12px] text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-line-structure">
        <div
          className={cn(
            container,
            "grid gap-4 py-12 @min-[720px]/compare:grid-cols-2 lg:pb-[72px] lg:pt-16",
          )}
        >
          <CornerBox className="flex flex-col gap-3.5 rounded-[2px] p-5 sm:p-7">
            <p className={cn(eyebrow, "text-[10px]")}>Migration guides</p>
            <h2
              id="migrate"
              className={cn(heading, "scroll-mt-28 text-[28px] leading-[1.08]")}
            >
              {content.headings.migration}
            </h2>
            <p className={body}>{content.copy.migration}</p>
            <div className="grid grid-cols-1 gap-px border border-line-structure bg-line-structure sm:grid-cols-2">
              {content.guides.map((guide) => (
                <Link
                  key={guide.name}
                  href={guide.link}
                  className="flex items-center justify-between gap-2 bg-surface-bg px-3.5 py-[11px] text-[13px] transition-colors hover:bg-surface-1"
                >
                  {guide.name} <Arrow />
                </Link>
              ))}
            </div>
          </CornerBox>
          <CornerBox className="flex flex-col gap-3.5 rounded-[2px] p-5 sm:p-7">
            <p className={cn(eyebrow, "text-[10px]")}>Clarifications</p>
            <h2
              id="clarifications"
              className={cn(heading, "text-[28px] leading-[1.08]")}
            >
              {content.headings.clarifications}
            </h2>
            <dl>
              {content.clarifications.map((item) => (
                <div
                  key={item.claim}
                  className="grid gap-1 border-t border-dashed border-line-divider-dash py-2.5 text-[13px] leading-[1.5] sm:grid-cols-[110px_1fr] sm:gap-3"
                >
                  <dt className="font-mono text-[11px] text-text-tertiary">
                    <span className="sr-only">Misconception: </span>
                    <s>{item.claim}</s>
                  </dt>
                  <dd>
                    <span className="sr-only">Fact: </span>
                    {item.fact}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href="/resources/engineering/clarifications"
              className={cn(textLink, "mt-auto")}
            >
              All clarifications <Arrow />
            </Link>
          </CornerBox>
        </div>
      </div>

      <section
        className="border-t border-line-structure bg-surface-cta-primary"
        aria-labelledby="compare-cta"
      >
        <div
          className={cn(
            container,
            "flex flex-col items-center gap-5 py-12 text-center lg:py-20",
          )}
        >
          <h2
            id="compare-cta"
            className={cn(
              heading,
              "max-w-[640px] text-balance text-[32px] leading-[1.04] sm:text-[40px]",
            )}
          >
            {content.headings.cta}
          </h2>
          <p className="max-w-[520px] text-[15px] text-text-secondary">
            {content.copy.cta}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button
              href="https://cloud.langfuse.com"
              aria-label="Start free"
              size="default"
              className="h-9 px-3.5"
            >
              Start free
            </Button>
            <Button
              href="#migrate"
              aria-label="Migration guides"
              variant="secondary"
              size="default"
              className="h-9 bg-transparent px-3.5"
            >
              Migration guides
            </Button>
            <span className="text-[13px] text-text-secondary">
              or{" "}
              <Link
                href="/talk-to-us"
                className="text-text-primary underline underline-offset-2"
              >
                Talk to us
              </Link>
            </span>
          </div>
          <p className="font-mono text-[11px] text-text-tertiary">
            {content.copy.ctaNote}
          </p>
        </div>
      </section>
    </div>
  );
}
