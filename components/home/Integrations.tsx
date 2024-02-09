import { Chrome, Code, Link, Package, Unplug } from "lucide-react";
import { SiOpenai } from "react-icons/si";

const features = [
  {
    name: "SDKs for Python & JS/TS",
    description:
      "Typed SDKs that capture trace data and send it fully async to Langfuse. You have full control on what is sent to Langfuse.",
    icon: Package,
    href: "/docs/sdk",
  },
  {
    name: "🦜🔗 Langchain integration",
    description:
      "Using Langchain? Get full execution traces in 5 minutes by adding the Langfuse Callback Handler to your app. Works for Python and JS projects.",
    icon: Link,
    href: "/docs/integrations/langchain",
  },
  {
    name: "Web SDK",
    description:
      "Capture user feedback and other quality scores right from the frontend using the Langfuse Web SDK.",
    icon: Chrome,
    href: "/docs/sdk/typescript-web",
  },
  {
    name: "OpenAI",
    description:
      "If you use the OpenAI SDK, use the Langfuse drop-in replacement to get full trace data by just changing the import.",
    icon: SiOpenai,
    href: "/docs/integrations/openai",
  },
  {
    name: "API",
    description:
      "Need more control? Use the Langfuse API to ingest traces and scores and build your own custom integrations.",
    icon: Code,
    href: "/docs/api",
  },
  {
    name: "Other open-source projects",
    description: "Dedicated integrations with Flowise, Langflow, and LiteLLM.",
    icon: Unplug,
    href: "/docs/integrations",
  },
];

export default function Integrations() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 ">Integrations</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Works with any LLM app
          </p>
          <p className="mt-6 text-lg leading-8 text-primary/70">
            Typed SDKs for Python & JS/TS. Native integrations for popular
            frameworks and libraries. Missing an integration? Let us know on
            Discord!
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl lg:max-w-none sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-background"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-primary/70">
                  {feature.description}{" "}
                  {feature.href ? (
                    <a href={feature.href} className="hover:text-primary">
                      Learn more →
                    </a>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
