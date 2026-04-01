import { HomeSection } from "./HomeSection";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui/text-highlight";
import { Text } from "@/components/ui/text";
import { CornerBox } from "@/components/ui/corner-box";
import { cornersFromNeighbors } from "@/components/ui/corner-box";

const reasons = [
  {
    title: "Unified Platform",
    body: "Langfuse is a single end-to-end platform combining tracing, prompts, evals and more.",
  },
  {
    title: "Open Source (MIT)",
    body: "Inspect the code. Self-host for free. No vendor lock-in.",
  },
  {
    title: "OTEL native",
    body: "Standard trace format. Works with existing OTEL instrumentation. Export anywhere.",
  },
  {
    title: "80+ integrations",
    body: "Works with any model, any framework, and stack.",
  },
  {
    title: "Largest OSS community",
    body: "Inspect the code. Self-host for free. We are the largest OSS community in our category.",
  },
  {
    title: "Built for Scale",
    body: "ClickHouse backend allows to query millions of traces in milliseconds.",
  },
  {
    title: "Async by default",
    body: "Tracing never blocks your application. Background processing, automatic batching.",
  },
  {
    title: "Loved by Agents",
    body: "CLI, MCP, accessible docs — Coding Agents love working with Langfuse.",
  },
  {
    title: "Production-proven",
    body: "Billions of events processed per month. 23M installs/month. Fortune 50 deployments.",
  },
  {
    title: "Shipping Velocity",
    body: "The AI space is changing fast. We understand what patterns matter and ship daily.",
  },
];

export function WhyLangfuse() {
  return (
    <HomeSection id="why-langfuse" className="pt-20">
      <div className="flex flex-col gap-3 mb-10">
        <Heading as="h2" size="normal">
          Why choose <TextHighlight>Langfuse</TextHighlight>?
        </Heading>
        <Text className="max-w-sm text-left">
          Langfuse is the most widely adopted open-source LLM engineering
          platform. Developers who value open-source trust Langfuse.
        </Text>
      </div>
      <ul className="flex flex-col">
        {reasons.map((item, i) => {
          const isLast = i === reasons.length - 1;
          return (
            <li key={item.title} className="grid grid-cols-[1fr_2fr] gap-8 py-2.5 border-b border-line-structure last:border-b-0">
              <Text className="font-medium text-left text-text-secondary">
                {item.title}
              </Text>
              <Text size="s" className="text-left">
                {item.body}
              </Text>
            </li>
          );
        })}
      </ul>
    </HomeSection>
  );
}
