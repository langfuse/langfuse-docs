"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";

const faqs = [
  {
    question: "What is Langfuse?",
    answer:
      "Langfuse is an open-source LLM engineering platform that helps teams build, monitor, and improve their AI applications. It provides tracing, prompt management, evaluations, and analytics — all in one place.",
  },
  {
    question: "Can I use just tracing without the other features?",
    answer:
      "Yes, you can use Langfuse purely for tracing. The SDK is modular and you can integrate only what you need. Tracing works independently of prompt management, evaluations, or any other feature.",
  },
  {
    question: "What does Langfuse help me with?",
    answer:
      "Langfuse helps you debug LLM applications with detailed traces, manage and version your prompts, run automated evaluations, monitor costs and latency, and collaborate with your team on AI application quality.",
  },
  {
    question: "What deployment options do exist?",
    answer:
      "Langfuse is available as a managed cloud service at cloud.langfuse.com (US and EU regions) or you can self-host it for free using Docker Compose or Kubernetes. The self-hosted version includes all features under the MIT license.",
  },
  {
    question: "Is self-hosting actually free?",
    answer:
      "Yes, self-hosting Langfuse is completely free. The entire codebase is open source under the MIT license. You only pay for your own infrastructure costs.",
  },
  {
    question: "What frameworks are supported?",
    answer:
      "Langfuse supports 80+ integrations including OpenAI, Anthropic, LangChain, LlamaIndex, Vercel AI SDK, AWS Bedrock, and many more. It is OpenTelemetry native, so it works with any OTEL-compatible library.",
  },
  {
    question: "What's the latency impact?",
    answer:
      "Langfuse is async by default — tracing never blocks your application. Data is sent in the background with automatic batching, so the latency impact on your application is negligible.",
  },
];

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
    >
      {/* The 4 quadrant paths — expand outward when open, converge when closed */}
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

      {/* The horizontal dash from acc-close.svg — draws in from center */}
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

export function FAQ() {
  const [openItem, setOpenItem] = useState<string>(faqs[0].question);

  return (
    <HomeSection id="faq" className="pt-[120px]">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
        <Heading as="h2" className="hidden top-8 text-left lg:block">
          FAQ
        </Heading>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className="flex flex-col"
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
              <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <p className="pr-8 pb-5 text-sm leading-7 text-text-tertiary">
                  {faq.answer}
                </p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </HomeSection>
  );
}
