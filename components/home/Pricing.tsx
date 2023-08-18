import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Check } from "lucide-react";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];
const tiers = [
  {
    name: "Hobby",
    id: "tier-hobby",
    href: "#",
    price: { monthly: "Free", annually: "Free" },
    description:
      "Get started with Langfuse with our hobby plan, no credit card required. Great for hobby and pre-launch projects.",
    features: [
      "Unlimited projects",
      "Unlimited events (fair use)",
      "30 days of history",
      "1 GB of storage",
      "Support via Discord and Chat",
    ],
    featured: false,
    cta: "Buy plan",
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    price: { monthly: "$98", annually: "$980" },
    description:
      "Pro plan for production usage with extended history, support, and included storage.",
    features: [
      "Unlimited projects",
      "Unlimited events (fair use)",
      "Unlimited history",
      "10 GB of included storage*",
      "1:1 support, Slack Channel, integration help",
    ],
    featured: false,
    cta: "Buy plan",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: "Custom",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Unlimited projects",
      "Unlimited events (fair use)",
      "Unlimited history",
      "10 GB of included storage*",
      "1:1 support, Slack Channel, integration help",
    ],
    featured: true,
    cta: "Contact sales",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Pricing = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple pricing for projects of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          All plans include:{" "}
          <span className="font-medium">unlimited projects</span> and{" "}
          <span className="font-medium">unlimited events</span> (fair use)
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
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
                    checked ? "bg-indigo-600 text-white" : "text-gray-500",
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
                  tier.featured ? "text-white" : "text-gray-900",
                  "text-lg font-semibold leading-8"
                )}
              >
                {tier.name}
              </h3>
              <p
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-4 text-sm leading-6"
                )}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={classNames(
                    tier.featured ? "text-white" : "text-gray-900",
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
                      tier.featured ? "text-gray-300" : "text-gray-600",
                      "text-sm font-semibold leading-6"
                    )}
                  >
                    {frequency.priceSuffix}
                  </span>
                ) : null}
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                    : "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600",
                  "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                {tier.cta}
              </a>
              <ul
                role="list"
                className={classNames(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={classNames(
                        tier.featured ? "text-white" : "text-indigo-600",
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
    </div>
  );
};
