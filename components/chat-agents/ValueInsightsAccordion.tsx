"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import Image from "next/image";

type InsightItem = {
  id: "sessions" | "cost" | "evals";
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

const INSIGHT_ITEMS: InsightItem[] = [
  {
    id: "sessions",
    title: "Identify where conversations go sideways",
    description:
      "See deep insights into user inputs and agent responses. Dive deep into every step the agent takes in between. Inspect the overall user session as a whole and follow the conversation flow as your users did.",
    href: "/docs/observability/features/sessions",
    ctaLabel: "Session tracing",
  },
  {
    id: "cost",
    title: "Track detailed cost of interactions",
    description:
      "Context grows with every turn and so does your bill. Break cost and token usage by turn, session, model, and release. Build dashboards and set alerts to stay on top of your spend.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
  },
  {
    id: "evals",
    title: "Measure and improve quality of your chat agent",
    description:
      "Run LLM as a judge on production data to detect frustration, follow-ups, or other user signals that are worth investigating. Promote happy paths from production into datasets to measure and improve quality.",
    href: "/docs/evaluation/overview",
    ctaLabel: "Evaluations",
  },
];

export function ValueInsightsAccordion() {
  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="order-2 border border-line-structure bg-surface-1 p-4 lg:order-1">
          <Image
            src="/images/docs/observability/first-trace.png"
            alt="Langfuse trace screenshot"
            width={1600}
            height={1000}
            className="h-auto w-full border border-line-structure bg-surface-bg"
            unoptimized
          />
        </div>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="sessions"
          className="order-1 border-t border-line-structure lg:order-2"
        >
          {INSIGHT_ITEMS.map((item) => (
            <AccordionPrimitive.Item
              key={item.id}
              value={item.id}
              className="border-b border-line-structure"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-4 py-7 text-left [&[data-state=open]>svg]:rotate-45">
                  <h3 className="text-[27px] leading-[1.08] text-text-primary sm:text-[38px]">
                    {item.title}
                  </h3>
                  <Plus className="h-6 w-6 shrink-0 text-text-tertiary transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden border-t border-line-structure bg-surface-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-6 pr-12 pt-5 text-[13px] leading-[1.5] text-text-secondary">
                  <p>{item.description}</p>
                  <a
                    href={item.href}
                    className="mt-5 inline-block text-[12px] text-text-secondary underline underline-offset-4 hover:text-text-primary"
                  >
                    {item.ctaLabel} →
                  </a>
                </div>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </div>
  );
}
