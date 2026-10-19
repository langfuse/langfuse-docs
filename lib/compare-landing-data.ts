// Content shared by the compare landing page and its Markdown renderer.
// Keep claims aligned with the dated, sourced comparisons linked from each card.
// This file is loaded by Node without a bundler, so it has no imports; the
// stat tokens below are filled in by each consumer from usage-stats.
export const OBSERVATIONS_TOKEN = "{observationsPerMonth}";
export const FORTUNE_50_TOKEN = "{fortune50}";

export const compareSections = [
  ["compare-heading", "Overview"],
  ["platform-comparisons", "Compare platforms"],
  ["why-langfuse", "How we build"],
  ["customer-stories", "Customer stories"],
  ["integrations-heading", "Integrations"],
  ["migrate", "Migration guides"],
  ["clarifications", "Clarifications"],
  ["compare-cta", "Get started"],
].map(([id, title]) => ({ id, title, depth: 2, url: `#${id}` }));

type ChipOptions = {
  dark?: boolean;
  faint?: boolean;
  dot?: "positive" | "negative";
};

function chip(text: string, x: number, y: number, options: ChipOptions = {}) {
  return { text, x, y: y - 24, ...options };
}
const G = "positive";
const R = "negative";
const vendors = [
  {
    name: "LangSmith",
    body: "LangChain's own suite vs. an open platform you control. Compare eval workflows, data ownership, and the full bill.",
    chips: [
      chip("$39 / seat / month", 6, 22),
      chip("14-day retention", 50, 58, { faint: true }),
      chip("SmithDB · closed · 2026", 8, 94),
      chip("self-host: Enterprise only", 46, 130, { dot: R }),
      chip("Langfuse Core $29 · unlimited users", 10, 168, {
        dark: true,
        dot: G,
      }),
    ],
    compare: "/compare/langsmith",
    migrate: "/resources/engineering/migrate-from-langsmith",
    migrateLabel: "Migration guide",
  },
  {
    name: "Braintrust",
    body: "Braintrust bills per score, so evaluating every trace adds up. Compare experiment workflows, total cost, and who controls your data.",
    chips: [
      chip("$3 / GB processed", 8, 22),
      chip("$1.50 / 1k scores", 52, 58),
      chip("Brainstore · closed · 2025", 6, 94, { faint: true }),
      chip("control plane: vendor-run", 46, 130, { dot: R }),
      chip("Langfuse: 1 score = 1 unit", 12, 168, { dark: true, dot: G }),
    ],
    compare: "/compare/braintrust",
    migrate: "/resources/engineering/migrate-from-braintrust",
    migrateLabel: "Migration guide",
  },
  {
    name: "Arize AX / Phoenix",
    body: "Arize ships two products: Phoenix (source-available) and AX (proprietary). How each compares with Langfuse on evals, cost, and scale.",
    chips: [
      chip("Phoenix · Elastic License 2.0", 4, 22),
      chip("AX · adb · closed · 2025", 50, 58),
      chip("30-day retention (Pro)", 8, 94, { faint: true }),
      chip("AX code evals: Enterprise only", 42, 130, { dot: R }),
      chip("Langfuse: code evals on every plan", 8, 168, {
        dark: true,
        dot: G,
      }),
    ],
    compare: "/compare/arize-phoenix",
    migrate: "/resources/engineering/migrate-from-arize-ax",
    migrateLabel: "AX",
    migrate2: "/resources/engineering/migrate-from-phoenix",
    migrate2Label: "Phoenix",
  },
  {
    name: "Datadog Agent Observability",
    body: "Already on Datadog? See where the two overlap, where they don't, and when to run both.",
    chips: [
      chip("15-day retention", 8, 22),
      chip("$4 / 10k spans for 90 days", 44, 58),
      chip("self-host: not offered", 6, 94, { dot: R }),
      chip("gov sites: unavailable", 54, 130, { faint: true }),
      chip("Langfuse Pro: 3 years, no add-on", 10, 168, { dark: true, dot: G }),
    ],
    compare: "/compare/datadog",
  },
].map((v, i) => ({ ...v, idx: `0${i + 1} / 04` }));
export const compareLanding = {
  hero: {
    eyebrow: "Compare Langfuse",
    lines: ["Trace. Evaluate. Improve.", "On your terms."],
    description: `Open-source AI engineering platform behind ${FORTUNE_50_TOKEN} of the Fortune 50 and ${OBSERVATIONS_TOKEN} observations a month. One MIT license, one codebase, on Langfuse Cloud or your own infrastructure, priced by usage instead of seats. The comparisons below show where that differs from LangSmith, Braintrust, Arize, and Datadog.`,
  },
  headings: {
    comparisons: "Compare what matters to your team",
    pillars: "What shapes the way we build Langfuse",
    customers: "How teams use Langfuse in production",
    integrations: ["Any model,", "any framework"],
    migration: "First traces the same day.",
    clarifications: "Common misconceptions",
    cta: "See how Langfuse fits your workflow",
  },
  copy: {
    methodology:
      "Each comparison cites public documentation and shows the date we last checked it.",
    correctionPrompt: "Spotted an error?",
    correctionLabel: "Pull requests",
    correctionLink: "https://github.com/langfuse/langfuse-docs",
    correctionSuffix: "are welcome.",
    integrations:
      "Built on OpenTelemetry. Add two lines to your handler, or point an existing exporter at Langfuse. Nothing else in your stack changes.",
    migration:
      "Repoint the exporter. Run both side by side. Import datasets, recreate prompts and judges. Your history stays where it is.",
    cta: "Start with one application, explore your traces, and evaluate the results. Moving from another platform? Follow a migration guide or talk through your requirements with us.",
    ctaNote: "No credit card · Free tier · Self-host anytime",
  },
  vendors,
  comparisonResources: [
    {
      title: "More comparisons",
      linkLabel: "Langfuse vs. Galileo",
      link: "/compare/galileo",
    },
    {
      title: "What would help you decide?",
      linkLabel: "Talk to us",
      link: "/talk-to-us",
    },
  ],
  contextCards: [
    {
      n: "01",
      title: "Why Langfuse",
      body: "What Langfuse is for, and why teams pick it.",
      link: "/handbook/chapters/why",
      linkLabel: "Read the handbook",
    },
    {
      n: "02",
      title: "Our approach",
      body: "Look at production data, fix it as a team, prove it with evals. That's how reliable AI gets built.",
      link: "/handbook/chapters/mission",
      linkLabel: "Read our mission",
    },
    {
      n: "03",
      title: "Where we're going",
      body: "Current priorities, in public. Tell us what's missing.",
      link: "/docs/roadmap",
      linkLabel: "See the roadmap",
    },
  ],
  pillarsIntro: [
    {
      text: "Know what you're building on and what it costs. The ",
    },
    {
      text: "code is open",
      link: "/handbook/chapters/open-source",
    },
    { text: ", deployment is your call, and " },
    {
      text: "pricing doesn't scale with headcount",
      link: "/handbook/chapters/monetization",
    },
    { text: "." },
  ],
  pillars: [
    {
      n: "01",
      title: "Open source. Deploy where you want.",
      body: "Managed Cloud or self-hosted, same MIT-licensed core. Read the code, change it, and keep your data where you want it.",
      link: "/self-hosting",
      linkLabel: "Self-hosting",
    },
    {
      n: "02",
      title: "One billing unit. Public prices.",
      body: "Traces, observations, and scores each count as one unit. Plan prices are public, and paid Cloud plans include unlimited users, so adding a reviewer costs nothing extra.",
      link: "/pricing-comparison-sheet",
      linkLabel: "Editable pricing model",
    },
    {
      n: "03",
      title: "Built on ClickHouse. Built for scale.",
      body: "ClickHouse runs the analytics in Cloud and self-hosted deployments alike. We're part of ClickHouse now, so we work with its engineers directly on performance and reliability.",
      link: "/blog/joining-clickhouse",
      linkLabel: "Why we joined ClickHouse",
    },
  ],
  customerStories: {
    description:
      "See how teams put AI to work, from customer support to company-wide adoption.",
    linkLabel: "Explore all customer stories",
    link: "/users",
  },
  quotes: [
    {
      company: "SumUp",
      isQuote: true,
      avatar: "/images/customers/sumup/ana-casado.jpg",
      text: "Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.",
      who: "Ana Casado, Head of Operations Data and AI",
      link: "/users/sumup",
    },
    {
      company: "Canva",
      isQuote: true,
      avatar: "/images/customers/canva/andreas.jpg",
      text: "Langfuse hits the sweet spot between engineering requirements and empowerment of non-technical users to contribute their domain expertise.",
      who: "Andreas Schuster, Head of Product, AI Help Experience",
      link: "/users/canva",
    },
    {
      company: "Merck",
      isQuote: false,
      avatar: "",
      text: "About 80 GenAI use cases and 200+ people on one self-hosted Langfuse. Chosen for data sovereignty, the public roadmap, and shipping speed.",
      who: "Customer story",
      link: "/users/merckgroup",
    },
  ],
  integrations: [
    {
      group: "Agent frameworks",
      items: [
        "LangChain",
        "LangGraph",
        "OpenAI Agents",
        "Vercel AI SDK",
        "Pydantic AI",
        "CrewAI",
        "Mastra",
        "LlamaIndex",
      ],
    },
    {
      group: "Model providers",
      items: [
        "OpenAI",
        "Anthropic",
        "Google Gemini",
        "Amazon Bedrock",
        "Azure OpenAI",
        "LiteLLM",
      ],
    },
    {
      group: "Languages & telemetry",
      items: [
        "Python",
        "TypeScript",
        "OpenTelemetry",
        "OpenInference",
        "REST API",
      ],
    },
  ],
  guides: [
    {
      name: "From LangSmith",
      link: "/resources/engineering/migrate-from-langsmith",
    },
    {
      name: "From Braintrust",
      link: "/resources/engineering/migrate-from-braintrust",
    },
    {
      name: "From Arize AX",
      link: "/resources/engineering/migrate-from-arize-ax",
    },
    {
      name: "From Arize Phoenix",
      link: "/resources/engineering/migrate-from-phoenix",
    },
  ],
  clarifications: [
    {
      claim: "No alerting",
      fact: "Alerts on any observation or score metric, to Slack, webhooks, and GitHub Actions. Cloud and self-host v4+.",
    },
    {
      claim: "No code evals",
      fact: "Python or TypeScript evaluators on live traffic and experiments. GA on every plan.",
    },
    {
      claim: "Acquired, so closed",
      fact: "Still MIT, still self-hostable, same endpoints, same roadmap. Joining ClickHouse changed none of that.",
    },
  ],
};
