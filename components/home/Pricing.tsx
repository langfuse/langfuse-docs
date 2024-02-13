import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
];
const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "https://cloud.langfuse.com",
    price: "Free",
    description:
      "Get started, no credit card required. Great for hobby projects and POCs.",
    features: [
      "50k observations / month",
      "Access last 30 days",
      "Max 3 users",
      "Max 1k requests / minute",
      "Community support (Discord & GitHub)",
      "Select data region (US or EU)",
    ],
    featured: false,
    cta: "Sign up",
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "https://cloud.langfuse.com",
    price: { monthly: "$59" },
    description:
      "For serious projects. Includes access to full history and higher usage.",
    features: [
      "100k observations / month included, additional: $10 / 100k observations",
      "Unlimited data access",
      "Unlimited users",
      "Max 1k requests / minute",
      "Dedicated support via email, Slack or Discord",
      "Select data region (US or EU)",
      "DPA for GDPR compliance",
    ],
    featured: true,
    cta: "Sign up",
  },
  {
    name: "Team",
    id: "tier-team",
    href: "/schedule-demo",
    price: { monthly: "$499" },
    description:
      "Dedicated solutions and support for your team. Contact us for pricing.",
    features: [
      "All Pro features",
      "SSO enforcement",
      "White-glove onboarding support",
      "Single-tenant instance on your domain",
      "Support SLAs",
      "Custom data retention policies",
      "Compliance information and security reviews",
    ],
    featured: false,
    cta: "Talk to founders",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Pricing: React.FC<{ includeFaq?: boolean }> = ({
  includeFaq = false,
}) => {
  const frequency = frequencies[0];

  return (
    <section className="py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight  sm:text-5xl">
            Simple pricing for projects of all sizes
          </p>
        </div>
        <div className="isolate mx-auto mt-20 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? "bg-gray-900 ring-gray-900" : "ring-gray-200",
                "rounded-3xl p-8 ring-1 xl:p-10"
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? "text-white" : "",
                  "text-lg font-semibold leading-8"
                )}
              >
                {tier.name}
              </h3>
              <p
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-primary/80",
                  "mt-4 text-sm leading-6"
                )}
              >
                {tier.description}
              </p>
              <p className={classNames("mt-6 flex items-baseline gap-x-2")}>
                {tier.name === "Team" ? (
                  <span
                    className={classNames(
                      tier.featured ? "text-gray-300" : "text-primary/80",
                      "text-sm font-semibold leading-6"
                    )}
                  >
                    Starts at
                  </span>
                ) : null}
                <span
                  className={classNames(
                    tier.featured ? "text-white" : "",
                    "text-4xl font-bold tracking-tight"
                  )}
                >
                  {typeof tier.price === "string"
                    ? tier.price
                    : tier.price[frequency.value]}
                </span>
                {typeof tier.price !== "string" ? (
                  <span
                    className={classNames(
                      tier.featured ? "text-gray-300" : "text-primary/80",
                      "text-sm font-semibold leading-6"
                    )}
                  >
                    {frequency.priceSuffix}
                  </span>
                ) : null}
              </p>
              <Button
                className="w-full mt-6"
                asChild
                variant={tier.featured ? "secondary" : "default"}
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
              <ul
                role="list"
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-primary/80",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={classNames(
                        tier.featured ? "text-white" : "text-primary",
                        "h-6 w-5 flex-none"
                      )}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {includeFaq ? (
        <PricingFAQ />
      ) : (
        <div className="text-center mt-10">
          Questions? See our{" "}
          <a href="/pricing#faq" className="underline">
            Pricing FAQ
          </a>
          .
        </div>
      )}
    </section>
  );
};

const faqs = [
  {
    question: "What is the easiest way to try Langfuse?",
    answer:
      "You can view the <a class='underline' href='/demo'>public demo project</a> or sign up for a <a class='underline' href='https://cloud.langfuse.com'>free account</a> to try Langfuse with your own data. The Hobby plan is completeley free and does not require a credit card.",
  },
  {
    question: "What is an observation?",
    answer:
      "Traces in Langfuse include a set of observations. An observation is a single event that occurred in your system. For example, a single LLM call, a single HTTP request, a single log object, or a database query. Check out the <a class='underline' href='/docs/tracing'>Langfuse Tracing docs<a/> for more details.",
  },
  {
    question: "Do I need to use Langfuse Cloud?",
    answer:
      "No, Langfuse Cloud is the managed service offered by the Langfuse team. Langfuse is open source and you can run Langfuse <a class='underline' href='/docs/deployment/local'>locally using docker compose<a/> or for <a class='underline' href='/docs/deployment/self-host'>production use via docker<a/> and a standalone database.",
  },
  {
    question: "Where is the data stored?",
    answer:
      "Langfuse Cloud is hosted on AWS and data is stored in the US or EU depending on your selection. See our <a class='underline' href='/docs/data-security-privacy'>security and privacy documentation</a> for more details.",
  },
  {
    question: "What are the limitations of the fair use policy?",
    answer:
      "The fair use policy is designed to be generous. By default, we limit API usage at 1k requests per minute to prevent abuse. Since requests are batched via the Langfuse client SDKs and the /api/public/ingestion endpoint, this limit is unlikely to be reached by most customers. If you need to increase this limit, please contact us.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "Yes, we offer discounts for students, academics and open-source projects. If you believe your situation warrants a discount, please contact us at sales@langfuse.com with details about your project.",
  },
];

export function PricingFAQ() {
  return (
    <div id="faq">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-primary/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-primary">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-primary/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-primary">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <Minus className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <Plus className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p
                        className="text-base leading-7 text-primary/70"
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
