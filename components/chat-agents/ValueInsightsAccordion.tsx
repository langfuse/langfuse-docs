"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { chatAgentsInsights } from "@/components/chat-agents/content";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";

export type InsightItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageSrc?: string;
  imageAlt?: string;
  imageClassName?: string;
};

type ValueInsightsAccordionProps = {
  items?: InsightItem[];
  imageSrc?: string;
  imageAlt?: string;
  caption?: string;
  /** Pin the two-column block to one-item-expanded height so toggling does not resize it. */
  locked?: boolean;
};

function InsightHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="grid w-full grid-cols-[26px_1fr_auto] items-start gap-3 py-5 text-left">
      <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="flex-1 text-[20px] leading-[1.12] text-text-primary sm:text-[24px]">
        {title}
      </h3>
      <Plus className="mt-1 h-5 w-5 shrink-0 text-text-tertiary" />
    </div>
  );
}

function InsightBody({ item, locked }: { item: InsightItem; locked: boolean }) {
  return (
    <div
      className={cn(
        "text-[13px] leading-[1.5] text-text-secondary",
        locked ? "pb-5 pl-[38px] pr-8 pt-1" : "pb-5 pl-8 pr-8 pt-4",
      )}
    >
      <p>{item.description}</p>
      <a
        href={item.href}
        className="mt-4 inline-block text-[12px] text-text-secondary underline underline-offset-4 hover:text-text-primary"
      >
        {item.ctaLabel} →
      </a>
    </div>
  );
}

export function ValueInsightsAccordion({
  items = chatAgentsInsights,
  imageSrc = "/images/docs/observability/first-trace.png",
  imageAlt = "Langfuse trace screenshot",
  caption = "trace · frustrated turn 3 of 7",
  locked = false,
}: ValueInsightsAccordionProps = {}) {
  const [activeItemId, setActiveItemId] = useState(items[0]?.id);
  const activeItem = items.find((item) => item.id === activeItemId) ?? items[0];
  const activeImageSrc = activeItem?.imageSrc ?? imageSrc;
  const activeImageAlt = activeItem?.imageAlt ?? imageAlt;

  function handleValueChange(value: string) {
    if (value) setActiveItemId(value);
  }

  const media = (
    <>
      <div
        className={cn(
          "border border-dashed border-line-structure bg-surface-1 p-2",
          locked && "relative min-h-[220px] flex-1",
        )}
      >
        {locked ? (
          <div
            className={cn(
              "relative w-full",
              activeItem?.imageSrc
                ? "aspect-square lg:aspect-auto lg:h-full lg:min-h-[200px]"
                : "h-full min-h-[200px]",
            )}
          >
            <Image
              src={activeImageSrc}
              alt={activeImageAlt}
              fill
              className={cn(
                "object-top",
                activeItem?.imageSrc ? "object-contain" : "object-cover",
                activeItem?.imageClassName,
              )}
              unoptimized
            />
          </div>
        ) : (
          <Image
            src={activeImageSrc}
            alt={activeImageAlt}
            width={1600}
            height={1000}
            className={cn(
              "h-auto w-full border border-line-structure bg-surface-bg",
              activeItem?.imageClassName,
            )}
            unoptimized
          />
        )}
      </div>
      {caption ? (
        <p className="px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          {caption}
        </p>
      ) : null}
    </>
  );

  const accordionItems = items.map((item, index) => (
    <AccordionPrimitive.Item
      key={item.id}
      value={item.id}
      className="border-b border-line-structure"
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger className="grid w-full grid-cols-[26px_1fr_auto] items-start gap-3 py-5 text-left [&[data-state=open]>svg]:rotate-45">
          <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="flex-1 text-[20px] leading-[1.12] text-text-primary sm:text-[24px]">
            {item.title}
          </h3>
          <Plus className="mt-1 h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={
          locked
            ? "overflow-hidden data-[state=closed]:hidden"
            : "overflow-hidden border-t border-line-structure bg-surface-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        }
      >
        <InsightBody item={item} locked={locked} />
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  ));

  return (
    <div className="mx-auto mt-6 max-w-6xl">
      <div
        className={cn(
          "grid gap-7 lg:grid-cols-[1.08fr_1fr]",
          locked ? "lg:items-stretch" : "lg:items-start",
        )}
      >
        {locked ? (
          <CornerBox className="order-2 flex h-full min-h-[260px] flex-col p-2 lg:order-1">
            {media}
          </CornerBox>
        ) : (
          <div className="order-2 border border-line-structure bg-surface-bg p-2 lg:order-1">
            {media}
          </div>
        )}

        {locked ? (
          <div className="relative order-1 min-h-0 lg:order-2">
            <div
              className="invisible border-t border-line-structure"
              aria-hidden="true"
            >
              {items.map((item, index) => (
                <div key={item.id} className="border-b border-line-structure">
                  <InsightHeader index={index} title={item.title} />
                </div>
              ))}
              <div className="grid pb-6">
                {items.map((item) => (
                  <div key={item.id} className="col-start-1 row-start-1">
                    <InsightBody item={item} locked />
                  </div>
                ))}
              </div>
            </div>
            <AccordionPrimitive.Root
              type="single"
              collapsible
              defaultValue={items[0]?.id}
              onValueChange={handleValueChange}
              className="absolute inset-0 overflow-hidden border-t border-line-structure"
            >
              {accordionItems}
            </AccordionPrimitive.Root>
          </div>
        ) : (
          <AccordionPrimitive.Root
            type="single"
            collapsible
            defaultValue={items[0]?.id}
            onValueChange={handleValueChange}
            className="order-1 border-t border-line-structure lg:order-2"
          >
            {accordionItems}
          </AccordionPrimitive.Root>
        )}
      </div>
    </div>
  );
}
