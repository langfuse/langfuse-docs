import { Check, Cloud } from "lucide-react";
import Image from "next/image";
import TraceScreen from "./img/trace-detail.gif";

const features = [
  {
    name: "Made for agents & LLM chains.",
    description:
      "Trace unlimited nested actions and get a detailed view of the entire request.",
    icon: Check,
  },
  {
    name: "Track non-LLM actions.",
    description:
      "Database queries, API calls, and other actions that lead to the response can be tracked for optimal visibility into issues.",
    icon: Check,
  },
  {
    name: "Open.",
    description: "Works with all models and configurations.",
    icon: Check,
  },
];

export const FeatTracing = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div className="lg:ml-auto lg:pl-4 lg:pt-4">
          <div className="lg:max-w-lg">
            <p className="text-base font-semibold leading-7">Observability</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Debug faster
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary/70">
              LLM applications are increasingly complex, Langfuse helps to trace
              & debug them. Understand how changes to one step impact overall
              application performance.
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-primary lg:max-w-none">
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
        <div className="flex items-start justify-end lg:order-first">
          <Image
            src={TraceScreen}
            alt="Screenshot single trace in Langfuse"
            className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 lg:w-[57rem]"
          />
        </div>
      </div>
    </div>
  </section>
);
