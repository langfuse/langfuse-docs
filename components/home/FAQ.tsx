"use client";

import { useState } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

const faqs = [
  {
    question: "What is Langfuse?",
    answer:
      "Langfuse is an [open-source](https://github.com/langfuse/langfuse) LLM engineering platform that helps teams build, monitor, and improve their AI applications. It covers the full development lifecycle with [tracing](/docs/observability/overview), [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), and [analytics dashboards](/docs/metrics/overview) — all in one place. Langfuse is used by 2,300+ companies and processes billions of observations per month. You can try it instantly with the [public demo project](/docs/demo) or [sign up for free](https://cloud.langfuse.com)",
  },
  {
    question: "What does Langfuse help me with?",
    answer:
      "Langfuse helps you [debug LLM applications](/docs/observability/overview) with detailed traces that capture every step of your AI pipeline, including [agent graphs](/docs/observability/features/agent-graphs). You can [manage and version your prompts](/docs/prompt-management/overview) collaboratively, run [automated evaluations](/docs/evaluation/evaluation-methods/llm-as-a-judge) (including LLM-as-a-judge and [code-based evaluators](/docs/evaluation/overview)), track [costs and latency](/docs/observability/features/token-and-cost-tracking) across models and providers, and run [experiments on datasets](/docs/evaluation/experiments/overview) to measure improvements before shipping. It also supports [custom dashboards](/docs/metrics/features/custom-dashboards) for team-wide visibility.",
  },
  {
    question: "Can I use just tracing without the other features?",
    answer:
      "Yes, you can use Langfuse purely for [tracing](/docs/observability/overview). The [SDKs](/docs/observability/sdk/overview) are modular — you instrument your app with a few lines of code and can integrate only what you need. Tracing works independently of [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), or any other feature. Many teams start with tracing alone and adopt additional capabilities as their needs grow.",
  },
  {
    question: "What deployment options do exist?",
    answer:
      "Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [US, EU, and Japan regions](/security), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). The self-hosted version includes all product features under the [MIT license](/open-source). For teams needing additional support and compliance, there is a [self-hosted Enterprise plan](/pricing-self-host).",
  },
  {
    question: "Is self-hosting actually free?",
    answer:
      "Yes, self-hosting Langfuse is completely free. The entire codebase is [open source under the MIT license](https://github.com/langfuse/langfuse) — all product features are included with no feature gates. You only pay for your own infrastructure costs. Get started with `docker compose up` using our [self-hosting guide](/self-hosting/deployment/docker-compose) or deploy at scale on [Kubernetes](/self-hosting/deployment/kubernetes-helm). The [Enterprise self-hosted option](/pricing-self-host) adds support SLAs and SSO for organizations that need them.",
  },
  {
    question: "What frameworks are supported?",
    answer:
      "Langfuse supports [80+ integrations](/integrations) including [LangChain](/integrations/frameworks/langchain), [LlamaIndex](/integrations/frameworks/llamaindex), [CrewAI](/integrations/frameworks/crewai), [OpenAI Agents](/integrations/frameworks/openai-agents), [Pydantic AI](/integrations/frameworks/pydantic-ai), [Mastra](/integrations/frameworks/mastra), [Google ADK](/integrations/frameworks/google-adk), [Vercel AI SDK](/integrations/frameworks/vercel-ai-sdk), [OpenAI](/integrations/model-providers/openai-py), [Anthropic](/integrations/model-providers/anthropic), and [AWS Bedrock](/integrations/model-providers/amazon-bedrock). Langfuse is [OpenTelemetry native](/integrations/native/opentelemetry), so it works with any OTEL-compatible library or your [existing OTEL setup](/faq/all/existing-otel-setup).",
  },
  {
    question: "What's the latency impact?",
    answer:
      "Langfuse is async by default — tracing never blocks your application. The SDKs send data in the background with [automatic batching and queuing](/docs/observability/features/queuing-batching), so the latency impact on your application is negligible. For prompt management, [edge caching](/docs/prompt-management/features/caching) ensures prompts are fetched with minimal overhead, and [guaranteed availability](/docs/prompt-management/features/guaranteed-availability) means your application continues to work even if Langfuse is unreachable.",
  },
  {
    question: "Is Langfuse secure and compliant?",
    answer:
      "Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and [HIPAA eligible](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US, EU, and Japan data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.",
  },
  {
    question: "How do I get started?",
    answer:
      "It depends on where you are in your workflow. To **add tracing**, follow the [tracing quickstart](/docs/observability/get-started). To **set up prompt management**, see the [prompt management guide](/docs/prompt-management/get-started). To **build an evaluation strategy**, the [evaluation overview](/docs/evaluation/overview) walks you through the different approaches. [Sign up for Langfuse Cloud](https://cloud.langfuse.com) (free, no credit card required) or explore the [public demo project](/docs/demo) to see everything in action.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Langfuse Cloud has a [free Hobby plan](/pricing) with no credit card required. Paid plans use usage-based [graduated pricing](/pricing) based on [billable units](/docs/administration/billable-units) — traces, observations, and scores you send to the platform. Volume discounts apply automatically as you scale. You can also [self-host](/self-hosting) Langfuse for free under the MIT license. See the [pricing page](/pricing) for the full calculator and plan comparison.",
  },
];

function renderAnswerWithLinks(text: string) {
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
          Questions & Answers
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
              <AccordionPrimitive.Content className="group overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <Text size="s" className="pr-8 pb-5 text-sm text-left font-normal lg:leading-[150%] tracking-[-0.07px] text-text-tertiary">
                  {renderAnswerWithLinks(faq.answer)}
                </Text>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </HomeSection>
  );
}
