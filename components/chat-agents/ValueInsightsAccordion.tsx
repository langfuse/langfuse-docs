"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, DollarSign, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

type InsightItem = {
  id: "sessions" | "cost" | "evals";
  category: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

const INSIGHT_ITEMS: InsightItem[] = [
  {
    id: "sessions",
    category: "Sessions",
    title: "Identify where conversations go sideways",
    description:
      "See deep insights into user inputs and agent responses. Dive deep into every step the agent takes in between. Inspect the overall user session as a whole and follow the conversation flow as your users did.",
    href: "/docs/observability/features/sessions",
    ctaLabel: "Session tracing",
  },
  {
    id: "cost",
    category: "Cost",
    title: "Track detailed cost of interactions",
    description:
      "Context grows with every turn and so does your bill. Break cost and token usage by turn, session, model, and release. Build dashboards and set alerts to stay on top of your spend.",
    href: "/docs/observability/features/token-and-cost-tracking",
    ctaLabel: "Cost tracking",
  },
  {
    id: "evals",
    category: "Evals",
    title: "Measure and improve quality of your chat agent",
    description:
      "Run LLM as a judge on production data to detect frustration, follow-ups, or other user signals that are worth investigating. Promote happy paths from production into datasets to measure and improve quality.",
    href: "/docs/evaluation/overview",
    ctaLabel: "Evaluations",
  },
];

function SessionsIllustration() {
  return (
    <div className="border border-line-structure bg-surface-bg p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-text-primary" />
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
          Session flow
        </p>
      </div>
      <div className="mt-3 space-y-2">
        <div className="ml-auto h-8 w-[82%] border border-line-structure bg-surface-1" />
        <div className="h-8 w-full border border-line-structure bg-surface-bg" />
        <div className="ml-auto h-8 w-[70%] border border-line-structure bg-surface-1" />
        <div className="h-8 w-[88%] border border-line-structure bg-surface-bg" />
      </div>
    </div>
  );
}

function CostIllustration() {
  return (
    <div className="with-stripes border border-line-structure p-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-text-primary" />
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
          Cost by step
        </p>
      </div>
      <div className="mt-3 flex h-[125px] items-end gap-2">
        <div className="h-[35%] w-10 border border-line-structure bg-surface-bg" />
        <div className="h-[52%] w-10 border border-line-structure bg-surface-bg" />
        <div className="h-[70%] w-10 border border-line-structure bg-surface-bg" />
        <div className="h-full w-10 border border-line-structure bg-surface-bg" />
      </div>
    </div>
  );
}

function EvalsIllustration() {
  return (
    <div className="border border-line-structure bg-surface-bg p-4">
      <div className="flex items-center gap-2">
        <Check className="h-5 w-5 text-text-primary" />
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
          Quality checks
        </p>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-text-tertiary" />
          <div className="h-7 w-full border border-line-structure bg-surface-1" />
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-text-tertiary" />
          <div className="h-7 w-[85%] border border-line-structure bg-surface-1" />
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-text-tertiary" />
          <div className="h-7 w-[70%] border border-line-structure bg-surface-1" />
        </div>
      </div>
    </div>
  );
}

function RotatingIllustration({ id }: { id: InsightItem["id"] }) {
  if (id === "cost") return <CostIllustration />;
  if (id === "evals") return <EvalsIllustration />;
  return <SessionsIllustration />;
}

export function ValueInsightsAccordion() {
  const [openItem, setOpenItem] = useState<string>();
  const activeItem = useMemo(
    () => INSIGHT_ITEMS.find((item) => item.id === openItem),
    [openItem],
  );

  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <div className="grid gap-2 lg:grid-cols-2">
        <div className="order-2 border border-line-structure bg-surface-1 p-4 sm:p-5 lg:order-1">
          {activeItem ? (
            <>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
                {activeItem.category}
              </p>
              <h3 className="mt-2 text-[24px] leading-[1.1] text-text-primary sm:text-[30px]">
                {activeItem.title}
              </h3>
              <div className="mt-4">
                <RotatingIllustration id={activeItem.id} />
              </div>
            </>
          ) : (
            <div className="flex min-h-[240px] items-center justify-center border border-dashed border-line-structure bg-surface-bg p-6 text-center text-[13px] text-text-tertiary">
              Expand a point to inspect the related illustration.
            </div>
          )}
        </div>

        <Accordion
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="order-1 border border-line-structure bg-surface-bg lg:order-2"
        >
          {INSIGHT_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-b border-line-structure last:border-b-0"
            >
              <AccordionTrigger className="px-4 py-4 text-left hover:no-underline sm:px-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-[34px] leading-[1.05] text-text-primary">
                    {item.title}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="rounded-none border-x-0 border-b-0 border-t border-line-structure bg-surface-1 text-base">
                <p className="text-[13px] leading-[1.5] text-text-secondary">
                  {item.description}
                </p>
                <a
                  href={item.href}
                  className="mt-5 inline-block text-[12px] text-text-secondary underline underline-offset-4 hover:text-text-primary"
                >
                  {item.ctaLabel} →
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
