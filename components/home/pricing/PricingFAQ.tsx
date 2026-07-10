import { Heading } from "@/components/ui/heading";
import { FAQAccordion, type FAQItem } from "@/components/shared/FAQAccordion";

const faqs: FAQItem[] = [
  {
    question: "What is the easiest way to try Langfuse?",
    answer:
      "You can view the [public example project](/demo) or sign up for a [free account](/cloud) to try Langfuse with your own data. The Hobby plan is completely free and does not require a credit card.",
  },
  {
    question: "Can I self-host Langfuse for free?",
    answer:
      "Yes, Langfuse is open source and you can self-host Langfuse for free. Use docker compose to run Langfuse locally, or use one of our templates to self-host Langfuse in production on Kubernetes. Check out the [self-hosting documentation](/self-hosting) to learn more.",
  },
  {
    question: "What is a billable unit?",
    answer:
      "A billable unit in Langfuse is any tracing data point you send to our platform — this includes the trace (a complete application interaction), observations (individual steps within a trace: Spans, Events and Generations), and scores (evaluations of your AI outputs). For a detailed explanation and an example, see our [Langfuse Billable Units docs](/docs/administration/billable-units).",
  },
  {
    question: "How does the graduated pricing work?",
    answer:
      "Our graduated pricing means you pay different rates for different volume tiers. The first 100k units are included in paid plans, then you pay $8/100k for units 100k–1M, $7/100k for 1M–10M units, $6.5/100k for 10M–50M units, and $6/100k for 50M+ units. This ensures you get better rates as you scale up your usage. Use the pricing calculator to estimate your bill.",
  },
  {
    question: "How can I reduce my Langfuse Cloud bill?",
    answer:
      "The primary way to reduce your Langfuse Cloud bill is to reduce the number of billable units that you ingest. We have summarized how this can be done [here](/faq/all/cutting-costs). Additionally, with our new graduated pricing model, you automatically get lower rates per 100k units as your volume increases.",
  },
  {
    question: "When do I get billed?",
    answer:
      "You get one bill each month. We charge your Core, Pro, or Team plan at the start of the month. We charge for your usage at the end of the month. The bill you get at the start of the month shows two things: the plan cost for the new month and the usage from last month.",
  },
  {
    question: "What are Langfuse Cloud Credits, and how do they affect me?",
    answer:
      "A Langfuse Cloud Credit is a prepaid unit of credit, equal to one (1) US dollar, to be applied to a customer's use of Langfuse Cloud. Credits are drawn down according to the then-current pricing at [langfuse.com/pricing](/pricing). Langfuse Cloud Credits only apply to customers with a committed-spend agreement for Langfuse Cloud. If you have questions about your credit balance, drawdown schedule, or committed-spend agreement, please contact your account team. If you use Langfuse Cloud on a Pay-as-you-Go basis, Langfuse Cloud Credits do not apply to you.",
  },
  {
    question: "What is the Committed spend option?",
    answer:
      "Committed spend is an annual agreement for Langfuse Cloud, available on every cloud plan from a minimum annual contract size. You purchase Langfuse Cloud Credits that draw down against the public price list at [langfuse.com/pricing](/pricing). In exchange for the commitment, you get volume discounts, procurement support (vendor onboarding, security reviews), upgraded support, and billing via AWS Marketplace or invoice. Custom or redlined contracts are available for larger agreements. [Talk to us](/talk-to-us) to get started.",
  },
  {
    question: "How is self-hosted Langfuse Enterprise priced?",
    answer:
      "Langfuse OSS is free (MIT license). Langfuse Enterprise (self-hosted) is an annual agreement with a flat fee sized on your [billable units](/docs/administration/billable-units) across all deployments and environments. It is activated via a license key — one key covers all of your environments. Langfuse does not actively meter self-hosted usage; usage is reviewed together at renewal. [Talk to us](/talk-to-us?deployment=self-hosted) for a quote.",
  },
  {
    question: "Can I set up alerts on the usage fees?",
    answer:
      "Yes, you can configure spend alerts to receive email notifications when your organization's spending exceeds predefined monetary thresholds. This helps you monitor costs and take action before unexpected charges occur. Navigate to your organization settings and the Billing tab to configure spend alerts. Learn more in our [spend alerts documentation](/docs/administration/spend-alerts).",
  },
  {
    question: "How can I manage my subscription?",
    answer:
      "You can manage your subscription through the organization settings in Langfuse Cloud or by using this [Customer Portal](/billing-portal).",
  },
  {
    question: "Can I redline the contracts?",
    answer:
      "Custom and redlined contracts are available for larger committed-spend agreements. Please contact us at enterprise@langfuse.com for more details. The default plans are affordable as they are designed to be self-serve on our standard terms.",
  },
  {
    question: "Where is the data stored?",
    answer:
      "Langfuse Cloud is hosted on AWS and data is stored in the US, EU, or Japan depending on your selection. Enterprise customers can also choose a HIPAA-compliant US region. See our [security and privacy documentation](/security) for more details.",
  },
  {
    question: "I have security questions, where to start?",
    answer:
      "We publish almost all of our security documentation and controls. Please refer to our [security documentation](/security) for more details.",
  },
];

export function PricingFAQ() {
  return (
    <div id="faq">
      <div className="pt-16">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          <Heading as="h2" size="normal" className="text-left">
            FAQ
          </Heading>
          <FAQAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
