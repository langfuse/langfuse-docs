"use client";

import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { FAQAccordion, type FAQItem } from "@/components/shared/FAQAccordion";

const faqs: FAQItem[] = [
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
      "Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [US and EU regions](/security), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). The self-hosted version includes all product features under the [MIT license](/open-source). For teams needing additional support and compliance, there is a [self-hosted Enterprise plan](/pricing-self-host).",
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
      "Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and [HIPAA eligible](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US and EU data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.",
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

export function FAQ() {
  return (
    <HomeSection id="faq" className="pt-[120px]">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
        <Heading as="h2" className="hidden top-8 text-left lg:block">
          Questions & Answers
        </Heading>

        <FAQAccordion faqs={faqs} />
      </div>
    </HomeSection>
  );
}
