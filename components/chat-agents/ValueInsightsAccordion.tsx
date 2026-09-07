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
    <div className="mx-auto mt-6 max-w-6xl">
      <div className="grid gap-7 lg:grid-cols-[1.08fr_1fr] lg:items-start">
        <div className="order-2 border border-line-structure bg-surface-bg p-2 lg:order-1">
          <div className="border border-dashed border-line-structure bg-surface-1 p-2">
            <Image
              src="/images/docs/observability/first-trace.png"
              alt="Langfuse trace screenshot"
              width={1600}
              height={1000}
              className="h-auto w-full border border-line-structure bg-surface-bg"
              unoptimized
            />
          </div>
          <p className="px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            trace · frustrated turn 3 of 7
          </p>
        </div>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="sessions"
          className="order-1 border-t border-line-structure lg:order-2"
        >
          {INSIGHT_ITEMS.map((item, index) => (
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
              <AccordionPrimitive.Content className="overflow-hidden border-t border-line-structure bg-surface-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-5 pl-8 pr-8 pt-4 text-[13px] leading-[1.5] text-text-secondary">
                  <p>{item.description}</p>
                  <a
                    href={item.href}
                    className="mt-4 inline-block text-[12px] text-text-secondary underline underline-offset-4 hover:text-text-primary"
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
