"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type FAQItem = {
  question: string;
  answer: string;
};

export function renderAnswerWithLinks(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={i}>{boldMatch[1]}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith("http");
      return (
        <Link
          key={i}
          href={href}
          variant="text"
          className="text-[14px]"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

// Each quadrant path from acc-open.svg with its collapse direction
const OPEN_PATHS = [
  { d: "M0.999993 7.53333V8.46667H5.66666C6.69759 8.46667 7.53333 9.3024 7.53333 10.3333V15H8.46666V7.53333H0.999993Z", exitX: -4, exitY: 4 },
  { d: "M0.999993 8.46666V7.53333H5.66666C6.69759 7.53333 7.53333 6.69759 7.53333 5.66666V0.999993H8.46666V8.46666H0.999993Z", exitX: -4, exitY: -4 },
  { d: "M15 7.53333V8.46667H10.3333C9.30241 8.46667 8.46667 9.3024 8.46667 10.3333V15H7.53334V7.53333H15Z", exitX: 4, exitY: 4 },
  { d: "M15 8.46666V7.53333H10.3333C9.30241 7.53333 8.46667 6.69759 8.46667 5.66666V0.999993H7.53334V8.46666H15Z", exitX: 4, exitY: -4 },
];

function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-text-tertiary"
    >
      {OPEN_PATHS.map(({ d, exitX, exitY }, i) => (
        <motion.path
          key={i}
          d={d}
          fill="currentColor"
          initial={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? exitX : 0,
            y: isOpen ? exitY : 0,
          }}
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? exitX : 0,
            y: isOpen ? exitY : 0,
          }}
          transition={{
            duration: 0.22,
            delay: isOpen ? 0 : i * 0.03,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
      <motion.line
        x1="1"
        y1="8"
        x2="15"
        y2="8"
        stroke="currentColor"
        strokeLinejoin="round"
        initial={{
          opacity: isOpen ? 1 : 0,
          scaleX: isOpen ? 1 : 0,
        }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scaleX: isOpen ? 1 : 0,
        }}
        style={{ transformOrigin: "8px 8px" }}
        transition={{
          duration: 0.22,
          delay: isOpen ? 0.1 : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </svg>
  );
}

export interface FAQAccordionProps {
  /** FAQ items to render. Answers support markdown-style `[label](url)` and `**bold**`. */
  faqs: FAQItem[];
  /** Question key to open initially. Defaults to the first question. */
  defaultOpen?: string;
  className?: string;
}

/**
 * Reusable FAQ accordion with animated open/close icon and markdown-style
 * answer rendering. Shared between the marketing home page and the pricing page.
 */
export function FAQAccordion({
  faqs,
  defaultOpen,
  className,
}: FAQAccordionProps) {
  const [openItem, setOpenItem] = useState<string>(
    defaultOpen ?? faqs[0]?.question ?? ""
  );

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      value={openItem}
      onValueChange={setOpenItem}
      className={cn("flex flex-col", className)}
    >
      {faqs.map((faq) => (
        <AccordionPrimitive.Item
          key={faq.question}
          value={faq.question}
          className="border-t border-line-structure first:border-t-0"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="flex flex-1 gap-4 justify-between items-center py-5 text-left cursor-pointer text-text-primary">
              <span className="text-[15px] font-medium leading-snug">
                {faq.question}
              </span>
              <span className="shrink-0">
                <AccordionIcon isOpen={openItem === faq.question} />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="group overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <Text
              size="s"
              className="pr-8 pb-5 text-sm text-left font-normal lg:leading-[150%] tracking-[-0.07px] text-text-tertiary"
            >
              {renderAnswerWithLinks(faq.answer)}
            </Text>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
