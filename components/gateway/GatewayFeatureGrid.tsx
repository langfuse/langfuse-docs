"use client";

import { ChipCard } from "@/components/ui/chip-card";
import { cn } from "@/lib/utils";
import { FeatureSketch, ProviderSketch } from "./GatewayFeatureSketch";
import {
  featureCardsBottom,
  featureCardsTop,
  providerCard,
  type FeatureCard,
} from "./content";

const titleClass = "text-[17px] font-medium leading-[1.3] text-text-primary";
const descriptionClass =
  "text-[14px] leading-[1.5] tracking-[-0.07px] text-text-tertiary";

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
        <FeatureSketch sketch={card.sketch} className="-mx-4 mt-auto" />
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
        <div className="grid w-full min-w-0 items-center @2xl:grid-cols-2">
          <div className="flex flex-col gap-1 p-4 @2xl:py-10">
            <div className={titleClass}>{providerCard.title}</div>
            <p className={cn(descriptionClass, "max-w-[52ch]")}>
              {providerCard.description}
            </p>
          </div>
          <ProviderSketch
            hub={providerCard.hub}
            providers={providerCard.chips}
            icons={providerCard.icons}
          />
        </div>
      </ChipCard>
      <div className="grid gap-2 @3xl:grid-cols-3">
        {featureCardsTop.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
      <div className="grid gap-2 @3xl:grid-cols-3">
        {featureCardsBottom.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
    </div>
  );
}
