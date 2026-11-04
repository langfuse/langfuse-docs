"use client";

import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { FAQAccordion, type FAQItem } from "@/components/shared/FAQAccordion";
import { formatCompanyCount } from "@/lib/usage-stats";

const faqs: FAQItem[] = [
  {
    question: "What is Langfuse?",
    answer: `Langfuse is an [open-source](https://github.com/langfuse/langfuse) AI engineering platform that helps teams build, monitor, and improve their LLM applications. It covers the full development lifecycle with [tracing](/docs/observability/overview), [prompt management](/docs/prompt-management/overview), [evaluations](/docs/evaluation/overview), and [analytics dashboards](/docs/metrics/overview), plus an optional [AI Gateway](/docs/gateway/overview) that routes your AI calls through Langfuse and traces each one with usage and cost. Many teams start with tracing alone and adopt other features as they need them. Langfuse is used by ${formatCompanyCount()} companies and processes billions of observations per month. You can try it instantly with the [public demo project](/docs/demo) or [sign up for free](/cloud).`,
  },
  {
    question:
      "How does Langfuse compare to LangSmith, Braintrust, Arize, Galileo, and Datadog?",
    answer:
      "Langfuse is an [open-source](/why) AI engineering platform for tracing, evaluations, prompt management, and experiments, with an optional [AI Gateway](/docs/gateway/overview). Compared with [LangSmith](/compare/langsmith), [Braintrust](/compare/braintrust), [Arize](/compare/arize-phoenix), [Galileo](/compare/galileo), and [Datadog Agent Observability](/compare/datadog), it is [MIT licensed](/handbook/chapters/open-source), [OpenTelemetry](/integrations/native/opentelemetry) native, [self-hostable](/self-hosting) at the same scale as Langfuse Cloud, and model- and framework-agnostic. On a representative workload, Langfuse Cloud is cheaper than [LangSmith](/compare/langsmith), [Braintrust](/compare/braintrust), [Arize](/compare/arize-phoenix), and [Datadog Agent Observability](/compare/datadog). See [Why Langfuse?](/why) for how we position the product, or the [comparison pages](/compare) for product-by-product differences.",
  },
  {
    question: "What deployment options do exist?",
    answer:
      "Langfuse is available as a [managed cloud service](https://cloud.langfuse.com) in [global regions](/security/data-regions), or you can [self-host](/self-hosting) it on your own infrastructure using [Docker Compose](/self-hosting/deployment/docker-compose), [Kubernetes (Helm)](/self-hosting/deployment/kubernetes-helm), or Terraform templates for [AWS](/self-hosting/deployment/aws), [GCP](/self-hosting/deployment/gcp), and [Azure](/self-hosting/deployment/azure). Self-hosting is free under the [MIT license](/handbook/chapters/open-source) and includes all core features, such as observability, evaluation, prompt management, and datasets, with unlimited usage. The [AI Gateway](/docs/gateway/overview) is fully available when self-hosting as well. You only pay for your own infrastructure. The [self-hosted Enterprise plan](/pricing-self-host) adds project-level RBAC, audit logs, data retention policies, management APIs, and dedicated support with SLAs.",
  },
  {
    question: "Do I need the AI Gateway to use Langfuse?",
    answer:
      "No. The [AI Gateway](/docs/gateway/overview) is optional. To use it, swap the base URL and API key in your AI calls for the gateway's, and every call is traced without an SDK. Otherwise, the [SDKs](/docs/observability/sdk/overview) and [OpenTelemetry integrations](/integrations/native/opentelemetry) work as before. You can also [combine both](/docs/gateway/troubleshooting-and-faq#sdk), so gateway calls show up inside your existing traces.",
  },
  {
    question: "What's the latency impact?",
    answer:
      "Tracing with the SDKs and OpenTelemetry is async and doesn't block your application. Data is sent in the background with [automatic batching and queuing](/docs/observability/features/queuing-batching). The [AI Gateway](/docs/gateway/overview) sits in the request path between your application and the provider, and is built in Rust and optimized for low latency. Prompts are [cached client-side in the SDKs](/docs/prompt-management/features/caching), so there's no latency impact after the first fetch, and [guaranteed availability](/docs/prompt-management/features/guaranteed-availability) keeps your application working even if Langfuse is unreachable.",
  },
  {
    question: "Is Langfuse secure and compliant?",
    answer:
      "Yes. Langfuse Cloud is [SOC 2 Type II](/security/soc2) certified, [ISO 27001](/security/iso27001) compliant, [GDPR](/security/gdpr) compliant, and offers a [HIPAA-ready region](/security/hipaa). Data is [encrypted](/security/encryption) at rest and in transit, and you can choose between [US, EU, Japan, and HIPAA data regions](/security/data-regions). For full control, you can [self-host](/self-hosting) Langfuse on your own infrastructure with [data masking](/self-hosting/security/data-masking) and your own encryption keys. See our [security overview](/security) for details.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Langfuse Cloud has a [free Hobby plan](/pricing) with no credit card required. Paid plans use usage-based [graduated pricing](/pricing) based on [billable units](/docs/administration/billable-units), which are the traces, observations, and scores you send to the platform. Volume discounts apply automatically as you scale. You can also [self-host](/self-hosting) Langfuse for free under the MIT license. See the [pricing page](/pricing) for the full calculator and plan comparison.",
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
