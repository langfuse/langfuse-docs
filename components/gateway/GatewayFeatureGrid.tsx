"use client";

import { ChipCard } from "@/components/ui/chip-card";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import {
  featureCardsBottom,
  featureCardsTop,
  providerCard,
  type FeatureCard,
  type SketchRow,
} from "./content";

const toneClass: Record<NonNullable<SketchRow["tone"]>, string> = {
  ok: "text-muted-green",
  warn: "text-text-code-orange",
  error: "text-destructive",
};

const titleClass = "text-[17px] font-medium leading-[1.3] text-text-primary";
const descriptionClass =
  "text-[14px] leading-[1.5] tracking-[-0.07px] text-text-tertiary";

function SketchToggle({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-[30px] items-center rounded-full p-[3px] align-middle",
        on ? "justify-end bg-text-primary" : "justify-start bg-line-structure",
      )}
    >
      <span className="size-2.5 rounded-full bg-surface-bg" />
    </span>
  );
}

function Row({ row, raised }: { row: SketchRow; raised: boolean }) {
  return (
    <div className={cn(styles.row, raised && styles.raised)}>
      <span>{row.label}</span>
      {row.toggle !== undefined ? (
        <SketchToggle on={row.toggle} />
      ) : (
        <span className={row.tone ? toneClass[row.tone] : undefined}>
          {row.value}
        </span>
      )}
    </div>
  );
}

function Sketch({ sketch }: { sketch: FeatureCard["sketch"] }) {
  let content: React.ReactNode;
  if (sketch.kind === "rows") {
    content = sketch.rows.map((row, i) => (
      <Row key={row.label} row={row} raised={i === 0} />
    ));
  } else if (sketch.kind === "budget") {
    content = (
      <>
        <Row row={{ label: "platform", value: "86%" }} raised />
        <div className={styles.meter}>
          <div className="h-full w-[86%] bg-text-primary" />
          <div className="absolute left-[85%] -top-[5px] h-[22px] w-0.5 bg-text-code-orange" />
          <div className="absolute left-[95%] -top-[5px] h-[22px] w-0.5 bg-text-code-orange" />
        </div>
        <Row
          row={{ label: "warning", value: "at 85%", tone: "warn" }}
          raised={false}
        />
      </>
    );
  } else {
    const heights = [30, 42, 36, 55, 48, 66, 60, 78, 72, 90, 84, 100];
    content = (
      <>
        <Row row={{ label: "30d cost", value: "$18,204" }} raised />
        <div className={styles.bars}>
          {heights.map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex-1",
                i === 9 ? "bg-text-primary" : "bg-line-structure",
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className={cn(styles.sketch, "-mx-4 mt-auto")} aria-hidden>
      <div className={styles.plane}>
        <div className={styles.grid} />
        {content}
      </div>
    </div>
  );
}

function Card({ card, className }: { card: FeatureCard; className?: string }) {
  return (
    <ChipCard
      href={card.href}
      tooltip="Read the docs"
      className={cn(
        "flex h-full w-full min-w-0 flex-col items-stretch overflow-hidden p-0",
        className,
      )}
    >
      <div className="flex h-full min-w-0 flex-col gap-1 px-4 pt-4">
        <div className={titleClass}>{card.title}</div>
        <p className={cn(descriptionClass, "mb-3")}>{card.description}</p>
        <Sketch sketch={card.sketch} />
      </div>
    </ChipCard>
  );
}

export function GatewayFeatureGrid() {
  return (
    <div className="flex flex-col gap-2">
      <ChipCard
        href={providerCard.href}
        tooltip="Read the docs"
        className="flex w-full min-w-0 flex-col items-stretch overflow-hidden p-0"
      >
        <div className="grid w-full min-w-0 items-center md:grid-cols-2">
          <div className="flex flex-col gap-1 p-4 md:py-10">
            <div className={titleClass}>{providerCard.title}</div>
            <p className={cn(descriptionClass, "max-w-[52ch]")}>
              {providerCard.description}
            </p>
          </div>
          <div className={styles.wideSketch} aria-hidden>
            <div className={styles.widePlane}>
              <div className={styles.grid} />
              <span className={cn(styles.chip, styles.raised)}>AI Gateway</span>
              {providerCard.chips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ChipCard>
      <div className="grid gap-2 lg:grid-cols-3">
        {featureCardsTop.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {featureCardsBottom.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
