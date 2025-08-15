import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Plus, Minus, ExternalLink, InfoIcon } from "lucide-react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { Header } from "../Header";
import { HomeSection } from "./components/HomeSection";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TrustedBy } from "./components/TrustedBy";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";
import { trustedByData } from "@/data/trusted-by";

// Graduated pricing tiers
const pricingTiers = [
  { min: 0, max: 100000, rate: 0, description: "0-100k units" },
  { min: 100001, max: 1000000, rate: 8, description: "0-1M units" },
  { min: 1000001, max: 10000000, rate: 7, description: "1-10M units" },
  {
    min: 10000001,
    max: 50000000,
    rate: 6.5,
    description: "10-50M units",
  },
  { min: 50000001, max: Infinity, rate: 6, description: "50M+ units" },
];

// Calculate graduated pricing
const calculateGraduatedPrice = (events: number): number => {
  if (events <= 100000) return 0; // First 100k are free

  let totalCost = 0;
  let processedEvents = 100000; // Start after free tier

  for (let i = 1; i < pricingTiers.length; i++) {
    const tier = pricingTiers[i];
    if (events <= processedEvents) break;

    const tierStart = Math.max(processedEvents, tier.min);
    const tierEnd = tier.max === Infinity ? events : Math.min(events, tier.max);
    const eventsInTier = tierEnd - tierStart;

    if (eventsInTier > 0) {
      totalCost += (eventsInTier / 100000) * tier.rate;
      processedEvents = tierEnd;
    }
  }

  return Math.round(totalCost * 100) / 100;
};

// Plan configuration
type PlanConfig = {
  name: string;
  baseFee: number;
};

const PLAN_CONFIGS: PlanConfig[] = [
  { name: "Core", baseFee: 59 },
  { name: "Pro", baseFee: 199 },
  { name: "Pro + Teams", baseFee: 499 },
];

// Utility functions
const formatNumber = (num: number) => num.toLocaleString();

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatEventsInput = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  return numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculate events and cost for a specific tier
const calculateTierBreakdown = (
  events: number,
  tier: (typeof pricingTiers)[0],
  index: number
) => {
  let eventsInTier = 0;
  let costForTier = 0;
  let tierRate = "";

  if (index === 0) {
    // Free tier
    eventsInTier = Math.min(events, 100000);
    costForTier = 0;
    tierRate = "Free";
  } else {
    // Paid tiers
    if (events > tier.min) {
      // Fix: Adjust tierStart to be exactly tier.min for correct boundary calculation
      const tierStart = tier.min;
      const tierEnd =
        tier.max === Infinity ? events : Math.min(events, tier.max);
      eventsInTier = Math.max(0, tierEnd - tierStart + 1);
      costForTier = (eventsInTier / 100000) * tier.rate;
    }
    tierRate = `$${tier.rate}/100k`;
  }

  return { eventsInTier, costForTier, tierRate };
};

// Reusable graduated pricing text with calculator
const GraduatedPricingWithCalculator = ({ planName }: { planName: string }) => {
  const planConfig = PLAN_CONFIGS.find((p) => p.name === planName);
  return (
    <>
      $8/100k units. Lower with volume (
      <PricingCalculatorModal
        baseFee={planConfig?.baseFee || 0}
        planName={planName}
      />
      )
    </>
  );
};

// Pricing Calculator Modal Component
const PricingCalculatorModal = ({
  baseFee = 0,
  planName = "plan",
}: {
  baseFee?: number;
  planName?: string;
}) => {
  const router = useRouter();
  const [monthlyEvents, setMonthlyEvents] = useState<string>("200,000");
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<string>(planName);
  const [currentBaseFee, setCurrentBaseFee] = useState<number>(baseFee);

  // Read open state from URL
  const isOpen = router.query.calculatorOpen === "true";

  // Calculate price when events change
  useEffect(() => {
    const events = parseInt(monthlyEvents.replace(/,/g, "")) || 0;
    setCalculatedPrice(calculateGraduatedPrice(events));
  }, [monthlyEvents]);

  const handleOpenChange = (open: boolean) => {
    const query = { ...router.query };
    if (open) {
      query.calculatorOpen = "true";
    } else {
      delete query.calculatorOpen;
    }
    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlanName = e.target.value;
    const newPlan = PLAN_CONFIGS.find((plan) => plan.name === newPlanName);
    setSelectedPlan(newPlanName);
    setCurrentBaseFee(newPlan?.baseFee || 0);
  };

  const handleEventsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyEvents(formatEventsInput(e.target.value));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <span className="text-sm hover:text-primary underline cursor-pointer">
          pricing calculator
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pricing Calculator</DialogTitle>
          <DialogDescription>
            Enter your monthly billable units to see the graduated pricing
            breakdown
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="plan">Plan</Label>
            <select
              id="plan"
              value={selectedPlan}
              onChange={handlePlanChange}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {PLAN_CONFIGS.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name}{" "}
                  {plan.baseFee > 0 ? `($${plan.baseFee}/month)` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="events" className="flex items-center gap-1">
              Monthly Units
              <Link
                href="/docs/observability/data-model#billable-units"
                target="_blank"
              >
                <InfoIcon className="size-3" />
              </Link>
            </Label>
            <Input
              id="events"
              type="text"
              value={monthlyEvents}
              onChange={handleEventsChange}
              placeholder="Enter number of units per month"
              className="mt-1"
            />
          </div>

          <div className="bg-muted p-6 rounded">
            {currentBaseFee > 0 ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 text-lg font-medium">
                  <div className="text-center">
                    <div className="text-primary">
                      {formatCurrency(currentBaseFee)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedPlan} Base
                    </div>
                  </div>
                  <div className="text-muted-foreground">+</div>
                  <div className="text-center">
                    <div className="text-primary">
                      {formatCurrency(calculatedPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Usage
                    </div>
                  </div>
                  <div className="text-muted-foreground">=</div>
                  <div className="text-center">
                    <div className="text-primary">
                      {formatCurrency(calculatedPrice + currentBaseFee)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-center">
                  <div className="text-lg font-medium text-primary">
                    {formatCurrency(calculatedPrice)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total Usage Cost
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            <div className="font-medium text-sm">Pricing tiers:</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Tier</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Your Units</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingTiers.map((tier, index) => {
                  const events = parseInt(monthlyEvents.replace(/,/g, "")) || 0;
                  const { eventsInTier, costForTier, tierRate } =
                    calculateTierBreakdown(events, tier, index);

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {tier.description}
                      </TableCell>
                      <TableCell className="text-right">{tierRate}</TableCell>
                      <TableCell className="text-right">
                        {eventsInTier > 0 ? formatNumber(eventsInTier) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {eventsInTier > 0 ? formatCurrency(costForTier) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Total row */}
                <TableRow className="border-t-2">
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell className="text-right">{monthlyEvents}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatCurrency(calculatedPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type DeploymentOption = "cloud" | "selfHosted";

type DeploymentOptionParams = {
  switch: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
};

const deploymentOptions: Record<DeploymentOption, DeploymentOptionParams> = {
  cloud: {
    switch: (
      <span className="flex flex-row items-center gap-x-1">
        Langfuse Cloud
        <span className="hidden md:block"> (we host)</span>
      </span>
    ),
    title: "Pricing",
    subtitle:
      "Get started on the Hobby plan for free. No credit card required.",
    href: "/pricing",
  },
  selfHosted: {
    switch: (
      <span className="flex flex-row items-center gap-x-1">
        Self-hosted
        <span className="hidden md:block"> (you host)</span>
      </span>
    ),
    title: "Pricing",
    subtitle: "Deploy Langfuse OSS today. Upgrade to Enterprise at any time.",
    href: "/pricing-self-host",
  },
};

type Tier = {
  name: string;
  id: string;
  href: string;
  featured: boolean;
  description: string;
  price: string;
  priceUnit?: string;
  mainFeatures: (string | React.ReactNode)[];
  cta: string;
  ctaCallout?: {
    text: string;
    href: string;
  };
  priceDiscountCta?: {
    name: string;
    href: string;
  };
  addOn?: {
    name: string;
    price: string;
    mainFeatures: string[];
  };
  learnMore?: string;
};

const TEAMS_ADDON = "Teams add-on";

const tiers: Record<DeploymentOption, Tier[]> = {
  cloud: [
    {
      name: "Hobby",
      id: "tier-hobby",
      href: "https://cloud.langfuse.com",
      featured: false,
      description:
        "Get started, no credit card required. Great for hobby projects and POCs.",
      price: "Free",
      mainFeatures: [
        "All platform features (with limits)",
        "50k units / month included",
        "30 days data access",
        "2 users",
        "Community support (Discord & GitHub)",
      ],
      cta: "Sign up",
    },
    {
      name: "Core",
      id: "tier-core",
      href: "https://cloud.langfuse.com",
      featured: true,
      description:
        "For production projects. Longer data retention and unlimited users.",
      price: "$59",
      priceDiscountCta: {
        name: "Discounts available",
        href: "/pricing#discounts",
      },
      mainFeatures: [
        "Everything in Hobby",
        <>
          100k units / month included, additional:{" "}
          <GraduatedPricingWithCalculator planName="Core" />
        </>,
        "90 days data access",
        "Unlimited users",
        "Unlimited evaluators",
        "Support via Email/Chat",
      ],
      cta: "Sign up",
    },
    {
      name: "Pro",
      id: "tier-pro",
      href: "https://cloud.langfuse.com",
      featured: false,
      price: "$199",
      description:
        "For scaling projects. Unlimited history, high rate limits, all features.",
      mainFeatures: [
        "Everything in Core",
        <>
          100k units / month included, additional:{" "}
          <GraduatedPricingWithCalculator planName="Pro" />
        </>,
        "Unlimited data access",
        "Unlimited annotation queues",
        "High rate limits",
        "SOC2 & ISO27001 reports, BAA available (HIPAA)",
        "Support via Slack",
      ],
      addOn: {
        name: "Teams",
        price: "$300",
        mainFeatures: [
          "Enterprise SSO (e.g. Okta)",
          "SSO enforcement",
          "Fine-grained RBAC",
          "Data retention management",
        ],
      },
      cta: "Sign up",
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "/talk-to-us",
      featured: false,
      description: "Enterprise-grade support and security features.",
      price: "Custom",
      mainFeatures: [
        "Everything in Pro and Teams add-on",
        "Custom rate limits",
        "Uptime SLA",
        "Support SLA",
        "Custom Terms & DPA",
        "Dedicated support engineer",
        "Architecture reviews",
        "Billing via AWS Marketplace",
        "Billing via Invoice",
      ],
      cta: "Talk to sales",
    },
  ],
  selfHosted: [
    {
      name: "Open Source",
      id: "tier-self-hosted-oss",
      href: "/self-hosting",
      featured: true,
      description:
        "Self-host all core Langfuse features for free without any limitations.",
      price: "Free",
      mainFeatures: [
        "MIT License",
        "All core platform features and APIs (observability, evaluation, prompt management, datasets, etc.)",
        "Scalability of Langfuse Cloud",
        "Deployment docs & Helm chart",
        "Enterprise SSO and RBAC",
        "Community support",
      ],
      cta: "Deployment guide",
    },
    {
      name: "Enterprise",
      id: "tier-self-hosted-enterprise",
      href: "/talk-to-us",
      featured: false,
      price: "Custom",
      description: "Enterprise-grade support and security features.",
      mainFeatures: [
        "All Open Source features",
        "Project-level RBAC",
        "Enterprise Security Features",
        "SOC2, ISO27001, and InfoSec reviews",
        "Dedicated support engineer",
        "Support SLA",
        "Billing via AWS Marketplace",
        "Billing via Invoice",
      ],
      cta: "Talk to sales",
      ctaCallout: {
        text: "Request trial",
        href: "/request-trial",
      },
      learnMore: "/enterprise",
    },
  ],
} as const;

type Section = {
  name: string;
  description?: string;
  href?: string;
  features: {
    name: string;
    description?: string;
    href?: string;
    tiers: Partial<
      Record<
        DeploymentOption,
        Record<string, boolean | string | React.ReactNode>
      >
    >;
  }[];
};

const sections: Section[] = [
  {
    name: "LLM Application & Agent Tracing",
    href: "/docs/observability/overview",
    features: [
      {
        name: "Traces and Graphs (Agents)",
        href: "/docs/observability/overview",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Session Tracking (Chats/Threads)",
        href: "/docs/observability/features/sessions",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "User Tracking",
        href: "/docs/observability/features/users",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Token and Cost Tracking",
        href: "/docs/observability/features/token-and-cost-tracking",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Native Frameworks Integrations",
        description:
          "Langfuse integrates natively with many LLM providers and agent frameworks such as LangChain, LlamaIndex, LangGraph, CrewAI, Semantic Kernel, ...",
        href: "/integrations",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "SDKs (Python, JavaScript)",
        href: "/docs/observability/sdk/overview",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "OpenTelemetry (Java, Go, custom)",
        description:
          "Use Langfuse as an OpenTelemetry backend. Thereby you can use any OpenTelemetry compatible SDKs (Java, Go, etc.) to send traces to Langfuse. This also increases compatibility with many frameworks and LLM providers.",
        href: "/docs/observability/get-started#opentelemetry",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Proxy-based Logging (via LiteLLM)",
        href: "/integrations/gateways/litellm",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Custom via API",
        href: "/docs/api-and-data-platform/features/public-api",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Included usage",
        description:
          "Billable units are the collection of created traces, observations, and scores in Langfuse.",
        href: "/docs/observability/data-model",
        tiers: {
          cloud: {
            Hobby: "50k units",
            Core: "100k units",
            Pro: "100k units",
            Enterprise: "Custom",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Additional usage",
        description:
          "Billable units are the collection of created traces, observations, and scores in Langfuse. Pricing follows graduated tiers with lower rates at higher volumes.",
        href: "/docs/observability/data-model",
        tiers: {
          cloud: {
            Hobby: false,
            Core: <GraduatedPricingWithCalculator planName="Core" />,
            Pro: <GraduatedPricingWithCalculator planName="Pro" />,
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Multi-modal",
        href: "/docs/observability/features/multi-modality",
        tiers: {
          cloud: {
            Hobby: "Free while in beta",
            Core: "Free while in beta",
            Pro: "Free while in beta",
            Enterprise: "Free while in beta",
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Access to historical data",
        tiers: {
          cloud: {
            Hobby: "30 days",
            Core: "90 days",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Ingestion throughput",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "1,000 requests / min",
            Core: "4,000 requests / min",
            Pro: "20,000 requests / min",
            Enterprise: "Custom",
          },
        },
      },
    ],
  },
  {
    name: "Prompt Management",
    href: "/docs/prompt-management/overview",
    features: [
      {
        name: "Prompt Versioning",
        description: "Manage prompts via UI, API, SDKs",
        href: "/docs/prompt-management/overview",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Prompt Fetching",
        tiers: {
          cloud: {
            Hobby: "Unlimited",
            Core: "Unlimited",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Prompt Release Management",
        description: "Deploy and rollback prompts to different environments",
        href: "/docs/prompt-management/overview",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Prompt Composability",
        description:
          "Create shared snippets that can be reused in different prompts",
        href: "/docs/prompt-management/features/composability",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Prompt Caching (server and client)",
        description: "Use prompts with 0 latency and uptime impact",
        href: "/docs/prompt-management/features/caching",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Playground",
        description: "Test prompts in a sandbox environment",
        href: "/docs/prompt-management/features/playground",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Prompt Experiments",
        description: "Run structured experiments on new prompt versions",
        href: "/docs/evaluation/dataset-runs/datasets",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Protected Deployment Labels",
        description:
          "Prevent certain prompt labels from being modified or deleted by non-admins/owners",
        href: "/docs/prompt-management/get-started#protected-prompt-labels",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Evaluation (online and offline)",
    features: [
      {
        name: "Datasets",
        description:
          "Create and manage datasets of inputs and expected outputs. These can be created from production traces, manually in the UI, or uploaded via the SDK/UI. Datasets are the baseline for offline evaluation.",
        href: "/docs/evaluation/dataset-runs/datasets",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Custom Experiments (via SDK)",
        description:
          "Run custom experiments on your Langfuse datasets via the SDK. This can for example be used to benchmark an agent in CI on a daily basis.",
        href: "/docs/evaluation/dataset-runs/datasets",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Evaluation Scores (custom)",
        href: "/docs/evaluation/evaluation-methods/custom-scores",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "User Feedback Tracking",
        href: "/docs/evaluation/evaluation-methods/custom-scores#user-feedback",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Human Annotation",
        description: "Manually annotate LLM traces in Langfuse",
        href: "/docs/evaluation/evaluation-methods/annotation",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Human Annotation Queues",
        description: "Managed human annotation workflows with queues",
        href: "/docs/evaluation/evaluation-methods/annotation#annotation-queues",
        tiers: {
          cloud: {
            Hobby: "1 queue",
            Core: "3 queues",
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "External Evaluation Pipelines",
        href: "/docs/evaluation/evaluation-methods/custom-scores#external-evaluation-pipelines",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "LLM-as-judge evaluators",
        description:
          "Fully managed LLM-as-judge evaluators within Langfuse. Can be run on any dataset or LLM trace.",
        href: "/docs/evaluation/evaluation-methods/llm-as-a-judge",
        tiers: {
          cloud: {
            Hobby: "1 evaluator",
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Collaboration",
    features: [
      {
        name: "Projects",
        tiers: {
          cloud: {
            Hobby: "Unlimited",
            Core: "Unlimited",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Users",
        tiers: {
          cloud: {
            Hobby: "2",
            Core: "Unlimited",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Enterprise: "As licensed",
          },
        },
      },
    ],
  },
  {
    name: "API",
    href: "/docs/api-and-data-platform/overview",
    features: [
      {
        name: "Extensive Public API",
        href: "/docs/api-and-data-platform/features/public-api",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Rate limit (general API routes)",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "30 requests / min",
            Core: "100 requests / min",
            Pro: "1,000 requests / min",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Rate limit (datasets api)",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "100 requests / min",
            Core: "200 requests / min",
            Pro: "1,000 requests / min",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Rate limit (metrics api)",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "100 requests / day",
            Core: "200 requests / day",
            Pro: "2000 requests / day",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "SLA",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Exports",
    features: [
      {
        name: "Batch Export via UI",
        href: "/docs/api-and-data-platform/features/export-from-ui",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "PostHog Integration",
        href: "/docs/api-and-data-platform/features/export-from-ui",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Scheduled Batch Export to Blob Storage",
        href: "/docs/api-and-data-platform/features/export-to-blob-storage",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
    ],
  },
  {
    name: "Support",
    href: "/support",
    features: [
      {
        name: "Ask AI",
        href: "/docs/ask-ai",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Community (GitHub, Discord)",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Chat & Email",
        tiers: {
          cloud: { Hobby: false, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Private Slack/Discord channel",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Dedicated Support Engineer",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Support SLA",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Architectural guidance",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Security",
    href: "/docs/security-and-guardrails",
    features: [
      {
        name: "Data region",
        tiers: {
          cloud: {
            Hobby: "US or EU",
            Core: "US or EU",
            Pro: "US or EU",
            Enterprise: "US or EU",
          },
        },
      },
      {
        name: "Data masking",
        href: "/docs/observability/features/masking",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "SSO via Google, AzureAD, GitHub",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Organization-level RBAC",
        href: "/docs/administration/rbac",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Enterprise SSO (e.g. Okta, AzureAD/EntraID)",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "SSO enforcement",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Project-level RBAC",
        href: "/docs/administration/rbac#project-level-roles",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Data retention management",
        href: "/docs/administration/data-retention",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Organization Creators",
        href: "/self-hosting/organization-creators",
        tiers: {
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "UI Customization",
        href: "/self-hosting/ui-customization",
        tiers: {
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Audit Logs",
        href: "/docs/administration/audit-logs",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Admin API (project management, SCIM)",
        href: "/docs/administration/scim-and-org-api",
        tiers: {
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Organization Management API",
        href: "/self-hosting/organization-management-api",
        tiers: {
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
    ],
  },
  {
    name: "Billing",
    features: [
      {
        name: "Subscription management",
        tiers: {
          cloud: {
            Hobby: false,
            Core: "Self-serve",
            Pro: "Self-serve",
            Enterprise: "Sales",
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: "Sales",
          },
        },
      },
      {
        name: "Payment methods",
        tiers: {
          cloud: {
            Hobby: false,
            Core: "Credit card",
            Pro: "Credit card",
            Enterprise: "Credit card, Invoice",
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: "Credit card, Invoice",
          },
        },
      },
      {
        name: "Contract duration",
        tiers: {
          cloud: {
            Hobby: false,
            Core: "Monthly",
            Pro: "Monthly",
            Enterprise: "Custom",
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Billing via AWS Marketplace",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Compliance",
    href: "/security",
    features: [
      {
        name: "Contracts",
        tiers: {
          cloud: {
            Hobby: "Standard T&Cs",
            Core: "Standard T&Cs & DPA",
            Pro: "Standard T&Cs & DPA",
            Enterprise: "Custom",
          },
          selfHosted: {
            "Open Source": false,
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Data processing agreement (GDPR)",
        tiers: {
          cloud: { Hobby: false, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "SOC2 Type II & ISO27001 reports",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "HIPAA compliance",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "InfoSec/legal reviews",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
    ],
  },
];

export default function Pricing({
  isPricingPage = false,
  initialVariant = "cloud",
}: {
  isPricingPage?: boolean;
  initialVariant?: "cloud" | "selfHosted";
}) {
  const [localVariant, setLocalVariant] = useState(initialVariant);
  const variant = isPricingPage ? initialVariant : localVariant;
  const selectedTiers = tiers[variant];
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerWidth, setHeaderWidth] = useState<number>(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!isPricingPage) return;

    const calculateWidths = () => {
      if (headerRef.current && tableRef.current) {
        // Get the total width of the table
        const tableWidth = tableRef.current.getBoundingClientRect().width;
        setHeaderWidth(tableWidth);

        // Get the widths of each column
        const headerCells = headerRef.current.querySelectorAll("th");
        const widths = Array.from(headerCells).map(
          (cell) => (cell as HTMLElement).getBoundingClientRect().width
        );
        setColumnWidths(widths);
      }
    };

    // Calculate widths initially and on resize
    calculateWidths();
    window.addEventListener("resize", calculateWidths);

    const handleScroll = () => {
      if (!tableRef.current) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const navbarHeight = 64; // Approximate height of the navbar

      // Check if we're within the table's vertical bounds
      const isWithinTableBounds =
        tableRect.top < navbarHeight && tableRect.bottom > navbarHeight;

      setIsHeaderFixed((prevIsHeaderFixed) => {
        if (isWithinTableBounds && !prevIsHeaderFixed) {
          return true;
        } else if (!isWithinTableBounds && prevIsHeaderFixed) {
          return false;
        }
        return prevIsHeaderFixed;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateWidths);
    };
  }, [isPricingPage]);

  const FeatureDetails = ({
    description,
    href,
  }: {
    description?: string;
    href?: string;
  }) => {
    if (!description && !href) {
      return null;
    }

    if (!description && href) {
      return (
        <Link href={href} className="inline-block" target="_blank">
          <ExternalLink className="size-4 ml-2 pt-0.5" />
        </Link>
      );
    }

    return (
      <HoverCard>
        <HoverCardTrigger>
          <InfoIcon className="inline-block size-3 ml-1" />
        </HoverCardTrigger>
        <HoverCardContent className="w-60 text-xs">
          <p>
            {description}
            {href && (
              <span>
                {" "}
                (
                <Link href={href} className="underline" target="_blank">
                  learn more
                </Link>
                )
              </span>
            )}
          </p>
        </HoverCardContent>
      </HoverCard>
    );
  };

  const FeatureCell = ({
    value,
  }: {
    value: boolean | string | React.ReactNode;
  }) => {
    if (typeof value === "string") {
      return (
        <div className="text-sm leading-6 text-center break-words">
          {value}
          {value === TEAMS_ADDON && (
            <HoverCard>
              <HoverCardTrigger>
                <InfoIcon className="inline-block size-3 ml-1" />
              </HoverCardTrigger>
              <HoverCardContent className="w-60">
                <p className="text-sm">
                  Available as part of the Teams add-on on the Pro plan.
                </p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      );
    } else if (typeof value === "boolean") {
      return (
        <div className="flex justify-center">
          {value === true ? (
            <CheckIcon className="h-5 w-5 text-primary" />
          ) : (
            <MinusIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      );
    } else {
      return (
        <div className="text-sm leading-6 text-center break-words">{value}</div>
      );
    }
  };

  return (
    <HomeSection id="pricing" className={cn(isPricingPage && "px-0 sm:px-0")}>
      <div className="isolate overflow-hidden">
        <div className="flow-root pb-16 lg:pb-0">
          <div className="mx-auto max-w-7xl">
            <Header
              title={deploymentOptions[variant].title}
              description={deploymentOptions[variant].subtitle}
              h="h1"
            />

            {/* Deployment Options Tabs */}
            <Tabs
              defaultValue={variant}
              value={variant}
              className="mt-4 flex justify-center"
              onValueChange={(value) => {
                if (!isPricingPage) {
                  setLocalVariant(value as "cloud" | "selfHosted");
                }
              }}
            >
              <TabsList>
                {Object.keys(deploymentOptions).map((key) => (
                  <TabsTrigger key={key} value={key} asChild={isPricingPage}>
                    {isPricingPage ? (
                      <Link href={deploymentOptions[key].href}>
                        {deploymentOptions[key].switch}
                      </Link>
                    ) : (
                      deploymentOptions[key].switch
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Pricing Cards Grid */}
            <div
              className={cn(
                "mt-12 grid sm:grid-cols-2 gap-y-6 gap-x-6 md:gap-x-2 lg:gap-x-6 lg:items-stretch",
                selectedTiers.length === 4 && "md:grid-cols-4",
                selectedTiers.length === 3 && "md:grid-cols-3",
                selectedTiers.length === 2 && "md:grid-cols-2"
              )}
            >
              {selectedTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    tier.featured && "border-primary",
                    "relative h-full flex flex-col"
                  )}
                >
                  {/* Unlimited Users callout for Core and Pro */}
                  {variant === "cloud" &&
                    (tier.name === "Core" || tier.name === "Pro") && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                          Unlimited Users
                        </div>
                      </div>
                    )}

                  <CardHeader className="p-4 lg:p-6 text-left">
                    <CardTitle className="text-lg text-foreground font-semibold">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-left">
                      {tier.description}
                      {tier.learnMore && (
                        <>
                          {" "}
                          <Link href={tier.learnMore} className="underline">
                            Learn more
                          </Link>
                          .
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 px-4 lg:px-6">
                    {/* Price information */}
                    <div className="h-[60px] flex items-baseline">
                      <span className="font-bold text-3xl">{tier.price}</span>
                      <span className="text-sm leading-4 ml-1">
                        {tier.price.includes("$")
                          ? tier.priceUnit
                            ? `/ ${tier.priceUnit}`
                            : "/ month"
                          : ""}
                      </span>
                    </div>

                    <div>
                      {tier.ctaCallout ? (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            variant={tier.featured ? "default" : "outline"}
                            asChild
                          >
                            <Link href={tier.href}>{tier.cta}</Link>
                          </Button>
                          <Button
                            className="flex-1"
                            variant="secondary"
                            asChild
                          >
                            <Link href={tier.ctaCallout.href}>
                              {tier.ctaCallout.text}
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            className="w-full"
                            variant={tier.featured ? "default" : "outline"}
                            asChild
                          >
                            <Link href={tier.href}>{tier.cta}</Link>
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Startup discount callout for Core and Pro - always render container for alignment */}
                    <div className="p-6 h-[30px] flex items-center justify-center">
                      {variant === "cloud" &&
                      (tier.name === "Core" || tier.name === "Pro") ? (
                        <div className="text-xs text-muted-foreground text-center">
                          <Link
                            href="/startups"
                            className="underline hover:text-primary"
                          >
                            Startup? Get 50% off
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>

                  {/* Trusted by section for cloud tiers */}
                  {variant === "cloud" && (
                    <>
                      <div className="border-t"></div>
                      <TrustedBy customers={trustedByData.cloud[tier.name]} />
                    </>
                  )}
                  <div className="border-t"></div>
                  <CardFooter className="p-4 lg:p-6 flex-col items-start gap-2">
                    <ul className="space-y-2.5 text-sm">
                      {tier.mainFeatures.map((feature) => (
                        <li key={feature} className="flex space-x-2">
                          <Check className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {tier.addOn && (
                      <div className="mt-3 border rounded pt-4 p-3 relative w-full">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-0 bg-card px-2 text-xs text-muted-foreground">
                          + optional
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-primary">
                            {tier.addOn.name} Add-on
                          </span>
                          <span className="font-bold text-sm text-primary">
                            {tier.addOn.price}/mo
                          </span>
                        </div>
                        <ul className="mt-1 space-y-1 text-sm">
                          {tier.addOn.mainFeatures.map((feature) => (
                            <li key={feature} className="flex space-x-2">
                              <Check className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {isPricingPage && (
              <>
                {/* Special offers callout */}
                <div className="mt-4 mb-4 text-center">
                  <div className="inline-flex items-center gap-6 px-4 py-2 bg-muted/30 rounded-full text-sm text-muted-foreground">
                    <Link 
                      href="/startups" 
                      className="hover:text-primary transition-colors underline"
                    >
                      Startup discounts available
                    </Link>
                    <span className="text-muted-foreground/50">|</span>
                    <Link 
                      href="/research" 
                      className="hover:text-primary transition-colors underline"
                    >
                      Academic & research benefits
                    </Link>
                  </div>
                </div>

                {/* Feature comparison (up to lg) */}
                <section
                  aria-labelledby="mobile-comparison-heading"
                  className="lg:hidden mt-20"
                >
                  <h2 id="mobile-comparison-heading" className="sr-only">
                    Feature comparison
                  </h2>

                  <div className="mx-auto max-w-2xl space-y-16">
                    {selectedTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="mb-10 bg-card rounded-lg overflow-hidden border p-4"
                      >
                        <div className="mb-6">
                          <h4 className="text-lg text-foreground font-semibold">
                            {tier.name}
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {tier.description}
                          </p>
                        </div>
                        <Table>
                          <TableBody>
                            {sections.map((section) => (
                              <React.Fragment key={section.name}>
                                <TableRow className="bg-muted hover:bg-muted">
                                  <TableHead
                                    colSpan={2}
                                    className="w-full text-primary font-bold"
                                    scope="colgroup"
                                  >
                                    {section.name}
                                    <FeatureDetails
                                      description={section.description}
                                      href={section.href}
                                    />
                                  </TableHead>
                                </TableRow>
                                {section.features
                                  .filter((f) => variant in f.tiers)
                                  .map((feature) => (
                                    <TableRow key={feature.name}>
                                      <TableHead className="w-9/12" scope="row">
                                        {feature.name}
                                        <FeatureDetails
                                          description={feature.description}
                                          href={feature.href}
                                        />
                                      </TableHead>
                                      <TableCell className="w-3/12 text-center">
                                        <FeatureCell
                                          value={
                                            feature.tiers[variant][tier.name]
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Feature comparison (lg+) */}
                <section
                  aria-labelledby="comparison-heading"
                  className="hidden lg:block bg-card rounded-lg overflow-hidden border mt-20"
                  ref={tableRef}
                >
                  <h2 id="comparison-heading" className="sr-only">
                    Feature comparison
                  </h2>

                  {isHeaderFixed && (
                    <div
                      className="fixed left-0 right-0 bg-muted z-50 shadow-md border-b"
                      style={{ top: "64px" }}
                    >
                      <div className="mx-auto max-w-7xl px-6">
                        <div className="overflow-hidden pl-[16px]">
                          <table
                            className="w-full"
                            style={{
                              width: headerWidth,
                            }}
                          >
                            <thead>
                              <tr>
                                {columnWidths.length > 0 && (
                                  <>
                                    <th
                                      style={{ width: columnWidths[0] }}
                                      className="text-left font-medium"
                                      scope="col"
                                    ></th>
                                    {selectedTiers.map((tier, index) => (
                                      <th
                                        key={tier.id}
                                        style={{
                                          width: columnWidths[index + 1],
                                        }}
                                        className="py-2 text-center text-lg text-foreground font-semibold"
                                        scope="col"
                                      >
                                        {tier.name}
                                      </th>
                                    ))}
                                  </>
                                )}
                              </tr>
                            </thead>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Table className="w-full">
                      <thead ref={headerRef} className="bg-muted">
                        <tr>
                          <th
                            className="w-3/12 text-left font-medium"
                            scope="col"
                          ></th>
                          {selectedTiers.map((tier) => (
                            <th
                              key={tier.id}
                              className="w-2/12 p-2 text-center text-lg text-foreground font-semibold"
                              scope="col"
                            >
                              {tier.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <TableBody>
                        {sections.map((section) => (
                          <React.Fragment key={section.name}>
                            <TableRow className="bg-muted/50">
                              <TableCell colSpan={5} className="font-medium">
                                {section.name}
                                <FeatureDetails
                                  description={section.description}
                                  href={section.href}
                                />
                              </TableCell>
                            </TableRow>
                            {section.features
                              .filter((f) => variant in f.tiers)
                              .map((feature) => (
                                <TableRow key={feature.name}>
                                  <TableCell>
                                    {feature.name}
                                    <FeatureDetails
                                      description={feature.description}
                                      href={feature.href}
                                    />
                                  </TableCell>
                                  {selectedTiers.map((tier) => (
                                    <TableCell key={tier.id}>
                                      <FeatureCell
                                        value={
                                          feature.tiers[variant][tier.name]
                                        }
                                      />
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
        {isPricingPage ? (
          <>
            <div className="relative">
              <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
                <DiscountOverview className="mt-0" />
                <PricingFAQ />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mt-10">
              For a detailed comparison and FAQ, see our{" "}
              <Link
                href={deploymentOptions[variant].href}
                className="underline"
              >
                pricing page
              </Link>
              .
            </div>
          </>
        )}
      </div>
    </HomeSection>
  );
}

const discounts = [
  {
    name: "Early-stage startups",
    description: "50% off, first year",
    cta: {
      text: "Learn more and apply",
      href: "/startups",
    },
  },
  {
    name: "Research / Students",
    description: "Up to 100% off, limits apply",
    cta: {
      text: "Learn more and apply",
      href: "/research",
    },
  },
  {
    name: "Open-source projects",
    description: "USD 300 in credits / month, first year",
  },
];

const DiscountOverview = ({ className }: { className?: string }) => (
  <div
    className={cn("mx-auto max-w-7xl px-6 lg:px-8 pt-8", className)}
    id="discounts"
  >
    <div className="mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold leading-10 tracking-tight text-primary">
        Discounts
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {discounts.map((discount) => (
          <div
            key={discount.name}
            className="rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <dt className="text-base font-semibold leading-7 text-primary">
              {discount.name}
            </dt>
            <dd className="mt-2 text-sm leading-7 text-primary/60">
              {discount.description}
            </dd>
            {discount.cta && (
              <Button size="sm" variant="secondary" asChild className="mt-2">
                <Link href={discount.cta.href} target="_blank">
                  {discount.cta.text}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 leading-8 text-primary/60">
        Reach out to{" "}
        <Link href="mailto:support@langfuse.com" className="underline">
          support@langfuse.com
        </Link>{" "}
        to apply for a discount. We want all startups, educational users,
        non-profits and open source projects to build with Langfuse and are
        happy to work with you to make that happen.
      </p>
    </div>
  </div>
);

const faqs = [
  {
    question: "What is the easiest way to try Langfuse?",
    answer:
      "You can view the <a class='underline' href='/demo'>public demo project</a> or sign up for a <a class='underline' href='https://cloud.langfuse.com'>free account</a> to try Langfuse with your own data. The Hobby plan is completeley free and does not require a credit card.",
  },
  {
    question: "What is a billable unit?",
    answer:
      "A billable unit in Langfuse is any tracing data point you send to our platform - this includes the trace (a complete application interaction), observations (individual steps within a trace: Spans, Events and Generations), and scores (evaluations of your AI outputs). For a detailed explanation and an example, see our <a class='underline' href='/docs/observability/data-model'>Langfuse Data Model docs</a>.",
  },
  {
    question: "How can I reduce my Langfuse Cloud bill?",
    answer:
      "The primary way to reduce your Langfuse Cloud bill is to reduce the number of billable units that you ingest. We have summarized how this can be done <a class='underline' href='/faq/all/cutting-costs'>here</a>. Additionally, with our new graduated pricing model, you automatically get lower rates per 100k units as your volume increases.",
  },
  {
    question: "How does the graduated pricing work?",
    answer:
      "Our graduated pricing means you pay different rates for different volume tiers. The first 100k units are included in paid plans, then you pay $8/100k for units 100k-1M, $7/100k for 1M-10M units, $6.5/100k for 10M-50M units, and $6/100k for 50M+ units. This ensures you get better rates as you scale up your usage. Use the pricing calculator to estimate your bill.",
  },
  {
    question: "Can I self-host Langfuse?",
    answer:
      "Yes, Langfuse is open source and you can run Langfuse <a class='underline' href='/self-hosting/docker-compose'>locally using docker compose<a/> or for <a class='underline' href='/self-hosting'>production use via docker<a/> and a standalone database.",
  },
  {
    question: "Where is the data stored?",
    answer:
      "Langfuse Cloud is hosted on AWS and data is stored in the US or EU depending on your selection. See our <a class='underline' href='/security'>security and privacy documentation</a> for more details.",
  },
  {
    question: "Do you offer discounts?",
    answer:
      "Yes, we offer discounts for startups (request <a class='underline' href='https://forms.gle/eJAYjRWeCZU1Mn6j8'>here</a>), students, academics and open-source projects. If you believe your situation warrants a discount, please contact us at support@langfuse.com with details about your project.",
  },
  {
    question: "How do I activate my self-hosted Enterprise plan?",
    answer:
      "Once you've deployed Langfuse OSS, you can activate your Enterprise plan by adding the <a class='underline' href='/self-hosting/license-key'>license key</a> you received from the Langfuse team to your deployment.",
  },
  {
    question: "How can I manage my subscription?",
    answer:
      "You can manage your subscription through the organization settings in Langfuse Cloud or by using this <a class='underline' href='/billing-portal'>Customer Portal</a> for both Langfuse Cloud and Self-Hosted subscriptions.",
  },
  {
    question: "Can I redline the contracts?",
    answer:
      "Yes, we do offer customized contracts as an add-on on Langfuse Teams (cloud) and as a part of an Enterprise agreement (self-hosted). Please contact us at enterprise@langfuse.com for more details. The default plans are affordable as they are designed to be self-serve on our standard terms.",
  },
  {
    question: "Do you offer billing via AWS Marketplace?",
    answer:
      "Yes, all Langfuse Enterprise plans are available via AWS Marketplace (private offer). This applies to both Langfuse Cloud and Self-Hosted deployments. Please contact us at enterprise@langfuse.com for more details.",
  },
];

export function PricingFAQ() {
  return (
    <div id="faq">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-8">
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
