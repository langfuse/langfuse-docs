import { Check } from "lucide-react";
import Image from "next/image";

const features = [
  {
    name: "Cost.",
    description:
      "Track token usage and cost of your LLM application. Drill-down by users, models, or application features.",
    icon: Check,
  },
  {
    name: "Quality.",
    description:
      "Track user feedback (via Langfuse Web SDK), internal reviews (in the Langfuse UI) and evals to track quality of your LLM application.",
    icon: Check,
  },
  {
    name: "Latency.",
    description:
      "Monitor and improve latency by getting breakdowns of the added latency of each step of the LLM chain.",
    icon: Check,
  },
];

export const FeatAnalytics = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 2xl:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 2xl:mx-0 2xl:max-w-none 2xl:grid-cols-2">
        <div className="2xl:pr-8 2xl:pt-4">
          <div className="2xl:max-w-lg">
            <h2 className="text-base font-semibold leading-7">Analytics</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Metrics for LLM devs
            </p>
            <p className="mt-6 text-lg leading-8 text-primary/70">
              Based on the ingested data, Langfuse provides prebuilt analytics
              to help teams focus on the most important metrics when improving
              their LLM app.
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 2xl:max-w-none">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold">
                    <feature.icon
                      className="absolute left-1 top-1 h-5 w-5"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>{" "}
                  <dd className="inline text-primary/70">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <Image
          src="https://static.langfuse.com/landingpage-dashboard.gif"
          alt="Dashboard Langfuse"
          className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 2xl:w-[57rem]"
          height={500}
          width={500}
          unoptimized
        />
      </div>
    </div>
  </section>
);
