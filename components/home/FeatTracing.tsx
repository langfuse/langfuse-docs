import { Check } from "lucide-react";
import { CloudflareVideo } from "@/components/Video";

const features = [
  {
    name: "Made for agents & LLM chains.",
    description:
      "Trace unlimited nested actions and get a detailed view of the entire request.",
    icon: Check,
  },
  {
    name: "Exact cost calculation.",
    description:
      "Tokenizes prompts and completions of popular models to exactly measure the cost of each step of the LLM chain.",
    icon: Check,
  },
  {
    name: "Track non-LLM actions.",
    description:
      "Database queries, API calls, and other actions that lead to the response can be tracked for optimal visibility into issues.",
    icon: Check,
  },
  {
    name: "Open & integrated.",
    description:
      "Works with all models and configurations. Native integrations with popular frameworks and libraries.",
    icon: Check,
  },
];

export const FeatTracing = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto px-6 lg:px-8">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-20 xl:mx-0 xl:max-w-none xl:grid-cols-2">
        <div className="flex items-start justify-end">
          <CloudflareVideo
            videoId="e12cbbad8308e31e36127a6abaebe8a9"
            aspectRatio={16 / 9}
            gifStyle
            className="w-full max-w-none rounded-md shadow-xl ring-0 xl:w-[120%]"
          />
        </div>
        <div className="xl:ml-auto xl:pl-4 xl:pt-4">
          <div className="xl:max-w-lg">
            <p className="text-base font-semibold leading-7">Observability</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Debug faster
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary/70">
              LLM applications are increasingly complex, Langfuse helps to trace
              & debug them. Understand how changes to one step impact overall
              application performance.
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-primary xl:max-w-none">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-primary">
                    <feature.icon
                      className="absolute left-1 top-1 h-5 w-5 text-primary"
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
