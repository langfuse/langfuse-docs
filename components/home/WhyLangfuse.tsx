"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui/text-highlight";
import { Text } from "@/components/ui/text";

const reasons = [
  {
    title: "The full cycle",
    body: "Langfuse powers the entire development cycle from prototype to full scale production loads.",
  },
  {
    title: "Unified Platform",
    body: "All components of Langfuse work great standalone but excel when used together.",
  },
  {
    title: "Open Source (MIT)",
    body: "Inspect the code. Self-host for free. We are the largest OSS community in our category.",
  },
  {
    title: "OTel native",
    body: "Standard trace format. Works with existing OpenTelemetry instrumentation.",
  },
  {
    title: "80+ integrations",
    body: "Works with any model, any framework, and stack.",
  },
  {
    title: "Built for Scale",
    body: "ClickHouse backend allows to query millions of traces in milliseconds.",
  },
  {
    title: "Async by default",
    body: "Tracing never blocks your application. Background processing, automatic batching.",
  },
  {
    title: "Loved by Agents",
    body: "CLI, MCP, accessible docs - Coding Agents love working with Langfuse.",
  },
  {
    title: "Production-proven",
    body: "Billions of events processed per month. 23M installs/month. Fortune 50 deployments.",
  },
  {
    title: "Shipping Velocity",
    body: "The AI space is changing fast. We understand what patterns matter and ship daily.",
  },
];

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
    >
      {OPEN_PATHS.map(({ d, exitX, exitY }, i) => (
        <motion.path
          key={i}
          d={d}
          fill="#6B6B66"
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
        stroke="#6B6B66"
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

export function WhyLangfuse() {
  const [openItem, setOpenItem] = useState<string>("");

  return (
    <HomeSection id="why-langfuse" className="pt-[120px]">
      <div className="flex flex-col gap-3 mb-10">
        <Heading as="h2" size="normal">
          <TextHighlight>Why use</TextHighlight> Langfuse?
        </Heading>
        <Text className="max-w-[48ch] text-left">
          Langfuse is the most widely adopted open-source LLM engineering platform.
          Developers who value open-source and control over their data build production grade agents and LLM applications with Langfuse.
        </Text>
      </div>

      {/* Mobile / tablet: accordion (below lg) */}
      <AccordionPrimitive.Root
        type="single"
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className="flex flex-col lg:hidden"
      >
        {reasons.map((item) => (
          <AccordionPrimitive.Item
            key={item.title}
            value={item.title}
            className="border-t border-line-structure last:border-b"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 gap-4 justify-between items-center py-4 text-left cursor-pointer text-text-primary">
                <Text className="font-medium text-text-secondary">
                  {item.title}
                </Text>
                <span className="shrink-0">
                  <AccordionIcon isOpen={openItem === item.title} />
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <Text size="s" className="pr-8 pb-4 text-left">
                {item.body}
              </Text>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>

      {/* Desktop: two-column list (lg and above) */}
      <ul className="hidden flex-col lg:flex">
        {reasons.map((item) => (
          <li
            key={item.title}
            className="grid grid-cols-[1fr_3fr] gap-8 py-2.5 border-b border-line-structure last:border-b-0"
          >
            <Text className="font-medium text-left text-text-secondary">
              {item.title}
            </Text>
            <Text size="s" className="text-left">
              {item.body}
            </Text>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
