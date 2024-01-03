import { Check } from "lucide-react";
import { CloudflareVideo } from "@/components/Video";

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
      "Add scores to each trace. Can be model-based evaluation, user feedback, or manual labeling in the Langfuse UI.",
    icon: Check,
  },
  {
    name: "Latency.",
    description:
      "Monitor and improve latency by getting breakdowns of the added latency of each step of the LLM chain.",
    icon: Check,
  },
  {
    name: "Connected to traces.",
    description:
      "All analytics are connected to traces, so you can easily find the root cause of any issue.",
    icon: Check,
  },
  {
    name: "Public API.",
    description:
      "All data is also accessible via the public API to build your own custom features and dashboards on top of Langfuse.",
    icon: Check,
  },
];

export const FeatAnalytics = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 xl:px-8">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-20 xl:mx-0 xl:max-w-none xl:grid-cols-2">
        <div className="flex items-start justify-end  xl:order-last">
          <CloudflareVideo
            videoId="8072f530d91328c4946f1435b52e08e5"
            aspectRatio={16 / 9}
            gifStyle
            className="w-full max-w-none rounded-md shadow-xl ring-0 xl:w-[120%]"
          />
        </div>
        <div className="xl:pr-8 xl:pt-4">
          <div className="xl:max-w-lg">
            <h2 className="text-base font-semibold leading-7">Analytics</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Prebuilt dashboards
            </p>
            <p className="mt-6 text-lg leading-8 text-primary/70">
              Based on the ingested data, Langfuse provides prebuilt analytics
              to help teams focus on the most important metrics accessible to
              the whole team.
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 xl:max-w-none">
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
      </div>
    </div>
  </section>
);
