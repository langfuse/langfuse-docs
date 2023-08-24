import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];
const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "https://cloud.langfuse.com",
    price: { monthly: "Free", annually: "Free" },
    description:
      "Get started, no credit card required. Great for hobby, pre-launch and internal projects.",
    features: [
      "Unlimited projects",
      "Unlimited events (fair use)",
      "1 GB of storage",
      "Support via Discord and Chat",
    ],
    featured: false,
    cta: "Sign up",
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "https://cloud.langfuse.com",
    price: { monthly: "$95", annually: "$950" },
    description:
      "More storage and support for production-grade projects with significant usage.",
    features: [
      "Unlimited projects",
      "Unlimited events (fair use)",
      "10 GB of included storage",
      "1:1 support, Slack Channel, integration help",
    ],
    featured: false,
    cta: "Sign up",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "mailto:enterprise@langfuse.com",
    price: "Custom",
    description:
      "Dedicated solutions and support for enterprise teams. Contact us to learn more.",
    features: [
      "Support with self-hosting in your VPS or cloud",
      "Prioritization of your feature requests",
      "Engineering support for your team",
      "Support SLAs",
    ],
    featured: true,
    cta: "Contact founders",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Pricing = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

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
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-primary/80">
          All plans include:{" "}
          <span className="font-medium">unlimited projects</span> and{" "}
          <span className="font-medium">unlimited events</span> (fair use)
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-primary/80"
          >
            <RadioGroup.Label className="sr-only">
              Payment frequency
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(
                    checked ? "bg-primary text-background" : "text-primary/70",
                    "cursor-pointer rounded-full px-2.5 py-1"
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
              <p className="mt-6 flex items-baseline gap-x-1">
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
    </section>
  );
};
