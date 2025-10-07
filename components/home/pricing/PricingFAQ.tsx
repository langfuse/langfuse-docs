import { Plus, Minus } from "lucide-react";
import { Disclosure } from "@headlessui/react";

const faqs = [
  {
    question: "What is the easiest way to try Langfuse?",
    answer:
      "You can view the <a class='underline' href='/demo'>public example project</a> or sign up for a <a class='underline' href='https://cloud.langfuse.com'>free account</a> to try Langfuse with your own data. The Hobby plan is completely free and does not require a credit card.",
  },
  {
    question: "Can I self-host Langfuse for free?",
    answer:
      "Yes, Langfuse is open source and you can self-host Langfuse for free. Use docker compose to run Langfuse locally, or use one of our templates to self-host Langfuse in production on Kubernetes. Check out the <a class='underline' href='/self-hosting'>self-hosting documentation</a> to learn more.",
  },
  {
    question: "What is a billable unit?",
    answer:
      "A billable unit in Langfuse is any tracing data point you send to our platform - this includes the trace (a complete application interaction), observations (individual steps within a trace: Spans, Events and Generations), and scores (evaluations of your AI outputs). For a detailed explanation and an example, see our <a class='underline' href='/docs/observability/data-model'>Langfuse Data Model docs</a>.",
  },
  {
    question: "How does the graduated pricing work?",
    answer:
      "Our graduated pricing means you pay different rates for different volume tiers. The first 100k units are included in paid plans, then you pay $8/100k for units 100k-1M, $7/100k for 1M-10M units, $6.5/100k for 10M-50M units, and $6/100k for 50M+ units. This ensures you get better rates as you scale up your usage. Use the pricing calculator to estimate your bill.",
  },
  {
    question: "How can I reduce my Langfuse Cloud bill?",
    answer:
      "The primary way to reduce your Langfuse Cloud bill is to reduce the number of billable units that you ingest. We have summarized how this can be done <a class='underline' href='/faq/all/cutting-costs'>here</a>. Additionally, with our new graduated pricing model, you automatically get lower rates per 100k units as your volume increases.",
  },
  {
    question: "When do I get billed?",
    answer:
      "You get one bill each month. We charge your Core, Pro, or Team plan at the start of the month. We charge for your usage at the end of the month. The bill you get at the start of the month shows two things: the plan cost for the new month and the usage from last month.",
  },
  {
    question: "How can I manage my subscription?",
    answer:
      "You can manage your subscription through the organization settings in Langfuse Cloud or by using this <a class='underline' href='/billing-portal'>Customer Portal</a>.",
  },
  {
    question: "Can I redline the contracts?",
    answer:
      "Yes, we offer customized contracts for Langfuse Enterprise customers with a yearly commitment. Please contact us at enterprise@langfuse.com for more details. The default plans are affordable as they are designed to be self-serve on our standard terms.",
  },
  {
    question: "Where is the data stored?",
    answer:
      "Langfuse Cloud is hosted on AWS and data is stored in the US or EU depending on your selection. See our <a class='underline' href='/security'>security and privacy documentation</a> for more details.",
  },
  {
    question: "I have security questions, where to start?",
    answer:
      "We publish almost all of our security documentation and controls. Please refer to our <a class='underline' href='/security'>security documentation</a> for more details.",
  },
];

export function PricingFAQ() {
  return (
    <div id="faq">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-2xl font-bold leading-10 tracking-tight 
            text-primary"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-3 space-y-0 divide-y divide-primary/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question}>
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-primary py-2.5">
                        <span className="text-[15px] font-medium leading-6">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-6 items-center">
                          {open ? (
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="pb-2.5 pr-12">
                      <p
                        className="text-sm leading-7 text-primary/60"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
