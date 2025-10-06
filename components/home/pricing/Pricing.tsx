import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ExternalLink, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Header } from "../../Header";
import { HomeSection } from "../components/HomeSection";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TrustedBy } from "../components/TrustedBy";
import { PricingCalculator } from "./PricingCalculator";
import { trustedByData } from "@/data/trusted-by";
import { PricingFAQ } from "./PricingFAQ";
import { PricingDiscounts } from "./PricingDiscounts";

// Reusable graduated pricing text with calculator link
const GraduatedPricingText = () => {
  return (
    <>
      $8/100k units. Lower with volume (
      <Link href="#pricing-calculator" className="hover:text-primary underline">
        pricing calculator
      </Link>
      )
    </>
  );
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
  secondaryCta?: {
    text: string;
    href: string;
  };
  priceDiscountCta?: {
    name: string;
    href: string;
  };
  calloutLink?: {
    text: string;
    href: string;
  };
  addOn?: {
    name: string;
    price?: string;
    mainFeatures: string[];
  };
  learnMore?: string;
};

const TEAMS_ADDON = "Teams add-on";
const YEARLY_COMMITMENT = "Yearly Commitment";

const tiers: Tier[] = [
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
      "Community support via GitHub",
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
    price: "$29",
    priceDiscountCta: {
      name: "Discounts available",
      href: "/pricing#discounts",
    },
    calloutLink: {
      text: "Startup? Get 50% off",
      href: "/startups",
    },
    mainFeatures: [
      "Everything in Hobby",
      <>
        100k units / month included, additional: <GraduatedPricingText />
      </>,
      "90 days data access",
      "Unlimited users",
      "In-app support",
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
    calloutLink: {
      text: "Startup? Get 50% off",
      href: "/startups",
    },
    mainFeatures: [
      "Everything in Core",
      <>
        100k units / month included, additional: <GraduatedPricingText />
      </>,
      "Unlimited data access",
      "Unlimited annotation queues",
      "High rate limits",
      "SOC2 & ISO27001 reports, BAA available (HIPAA)",
      "Prioritized in-app support",
    ],
    addOn: {
      name: "Teams Add-on",
      price: "$300/mo",
      mainFeatures: [
        "Enterprise SSO (e.g. Okta)",
        "SSO enforcement",
        "Fine-grained RBAC",
        "Data retention management",
        "Support via Dedicated Slack Channel",
      ],
    },
    cta: "Sign up",
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "https://cloud.langfuse.com",
    featured: false,
    description:
      "For large scale teams. Enterprise-grade support and security.",
    price: "$2499",
    calloutLink: {
      text: "Enterprise FAQ",
      href: "/enterprise",
    },
    mainFeatures: [
      "Everything in Pro + Teams",
      <>
        100k units / month included, additional: <GraduatedPricingText />
      </>,
      "Audit Logs",
      "SCIM API",
      "Custom rate limits",
      "Uptime SLA",
      "Support SLA",
      "Dedicated support engineer",
    ],
    addOn: {
      name: "Yearly Commitment",
      mainFeatures: [
        "Custom Volume Pricing",
        "Custom Terms & DPA",
        "Architecture reviews",
        "Billing via AWS Marketplace",
        "Billing via Invoice",
        "Vendor Onboarding",
      ],
    },
    cta: "Sign up",
    secondaryCta: {
      text: "Talk to sales",
      href: "/talk-to-us",
    },
  },
];

type Section = {
  name: string;
  description?: string;
  href?: string;
  features: {
    name: string;
    description?: string;
    href?: string;
    tiers: Record<string, boolean | string | React.ReactNode>;
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
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Session Tracking (Chats/Threads)",
        href: "/docs/observability/features/sessions",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "User Tracking",
        href: "/docs/observability/features/users",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Token and Cost Tracking",
        href: "/docs/observability/features/token-and-cost-tracking",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Native Frameworks Integrations",
        description:
          "Langfuse integrates natively with many LLM providers and agent frameworks such as LangChain, LlamaIndex, LangGraph, CrewAI, Semantic Kernel, ...",
        href: "/integrations",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "SDKs (Python, JavaScript)",
        href: "/docs/observability/sdk/overview",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "OpenTelemetry (Java, Go, custom)",
        description:
          "Use Langfuse as an OpenTelemetry backend. Thereby you can use any OpenTelemetry compatible SDKs (Java, Go, etc.) to send traces to Langfuse. This also increases compatibility with many frameworks and LLM providers.",
        href: "/docs/opentelemetry/get-started",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Proxy-based Logging (via LiteLLM)",
        href: "/integrations/gateways/litellm",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Custom via API",
        href: "/api-and-data-platform/features/public-api",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Included usage",
        description:
          "Billable units are the collection of created traces, observations, and scores in Langfuse.",
        href: "/docs/observability/data-model",
        tiers: {
          Hobby: "50k units",
          Core: "100k units",
          Pro: "100k units",
          Enterprise: "100k units",
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
            Core: <GraduatedPricingText />,
            Pro: <GraduatedPricingText />,
            Enterprise: <GraduatedPricingText />,
          },
        },
      },
      {
        name: "Custom Usage Pricing",
        description: "Custom volume based pricing for large-scale projects.",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: "Available with " + YEARLY_COMMITMENT,
        },
      },
      {
        name: "Multi-modal",
        href: "/docs/observability/features/multi-modality",
        tiers: {
          Hobby: "Free while in beta",
          Core: "Free while in beta",
          Pro: "Free while in beta",
          Enterprise: "Free while in beta",
        },
      },
      {
        name: "Access to historical data",
        tiers: {
          Hobby: "30 days",
          Core: "90 days",
          Pro: "Unlimited",
          Enterprise: "Unlimited",
        },
      },
      {
        name: "Ingestion throughput",
        href: "/faq/all/api-limits",
        tiers: {
          Hobby: "1,000 requests / min",
          Core: "4,000 requests / min",
          Pro: "20,000 requests / min",
          Enterprise: "Custom",
        },
      },
    ],
  },
  {
    name: "Prompt Management",
    href: "/docs/prompt-management/get-started",
    features: [
      {
        name: "Prompt Versioning",
        description: "Manage prompts via UI, API, SDKs",
        href: "/docs/prompt-management/get-started",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Prompt Fetching",
        tiers: {
          Hobby: "Unlimited",
          Core: "Unlimited",
          Pro: "Unlimited",
          Enterprise: "Unlimited",
        },
      },
      {
        name: "Prompt Release Management",
        description: "Deploy and rollback prompts to different environments",
        href: "/docs/prompt-management/features/prompt-version-control",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Prompt Composability",
        description:
          "Create shared snippets that can be reused in different prompts",
        href: "/docs/prompt-management/features/composability",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Prompt Caching (server and client)",
        description: "Use prompts with 0 latency and uptime impact",
        href: "/docs/prompt-management/features/caching",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Playground",
        description: "Test prompts in a sandbox environment",
        href: "/docs/prompt-management/features/playground",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Prompt Experiments",
        description: "Run structured experiments on new prompt versions",
        href: "/docs/evaluation/dataset-runs/native-run",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Webhooks & Slack",
        description:
          "Trigger webhooks for prompt changes and integrate with Slack",
        href: "/docs/prompt-management/features/webhooks-slack-integrations",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Protected Deployment Labels",
        description:
          "Prevent certain prompt labels from being modified or deleted by non-admins/owners",
        href: "/docs/prompt-management/get-started#protected-prompt-labels",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
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
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Experiments via SDK",
        description:
          "Experiment on your Datasets via the SDK. This can for example be used to benchmark an agent in CI on a daily basis.",
        href: "/docs/evaluation/experiments/experiments-via-sdk",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Experiments via UI",
        description:
          "Test different versions of your prompts or models in the UI using Datasets you manage in Langfuse.",
        href: "/docs/evaluation/experiments/experiments-via-ui",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Evaluation Scores (custom)",
        href: "/docs/evaluation/evaluation-methods/custom-scores",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "User Feedback Tracking",
        href: "/faq/all/user-feedback",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "External Evaluation Pipelines",
        href: "/guides/cookbook/example_external_evaluation_pipelines",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "LLM-as-judge evaluators",
        description:
          "Fully managed LLM-as-judge evaluators within Langfuse. Can be run on any dataset or LLM trace.",
        href: "/docs/evaluation/evaluation-methods/llm-as-a-judge",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Human Annotation",
        description: "Manually annotate LLM traces in Langfuse",
        href: "/docs/scores/annotation",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Human Annotation Queues",
        description: "Managed human annotation workflows with queues",
        href: "/docs/evaluation/evaluation-methods/annotation#annotation-queues",
        tiers: {
          Hobby: "1 queue",
          Core: "3 queues",
          Pro: true,
          Enterprise: true,
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
          Hobby: "Unlimited",
          Core: "Unlimited",
          Pro: "Unlimited",
          Enterprise: "Unlimited",
        },
      },
      {
        name: "Users",
        tiers: {
          Hobby: "2",
          Core: "Unlimited",
          Pro: "Unlimited",
          Enterprise: "Unlimited",
        },
      },
    ],
  },
  {
    name: "API",
    href: "/docs/api-and-data-platform/features/public-api",
    features: [
      {
        name: "Extensive Public API",
        href: "/docs/api-and-data-platform/features/public-api",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Rate limit (general API routes)",
        href: "/faq/all/api-limits",
        tiers: {
          Hobby: "30 requests / min",
          Core: "100 requests / min",
          Pro: "1,000 requests / min",
          Enterprise: "Custom",
        },
      },
      {
        name: "Rate limit (datasets api)",
        href: "/faq/all/api-limits",
        tiers: {
          Hobby: "100 requests / min",
          Core: "200 requests / min",
          Pro: "1,000 requests / min",
          Enterprise: "Custom",
        },
      },
      {
        name: "Rate limit (metrics api)",
        href: "/faq/all/api-limits",
        tiers: {
          Hobby: "100 requests / day",
          Core: "200 requests / day",
          Pro: "2000 requests / day",
          Enterprise: "Custom",
        },
      },
      {
        name: "SLA",
        href: "/enterprise#faq",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
        },
      },
    ],
  },
  {
    name: "Exports",
    features: [
      {
        name: "Batch Export via UI",
        href: "/docs/api-and-data-platform/features/query-via-sdk#ui",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "PostHog Integration",
        href: "/integrations/analytics/posthog",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Scheduled Batch Export to Blob Storage",
        href: "/docs/api-and-data-platform/features/query-via-sdk#blob-storage",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
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
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Community (GitHub)",
        href: "/support#community",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "In-app support",
        href: "/support#in-app",
        tiers: {
          Hobby: false,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Private Slack channel",
        href: "/support#slack",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
        },
      },
      {
        name: "Dedicated Support Engineer",
        href: "/support#onboarding",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
        },
      },
      {
        name: "Onboarding & Architectural guidance",
        href: "/support#onboarding",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
        },
      },
      {
        name: "Response time SLO",
        description:
          "Target response time for support requests via supported channels",
        tiers: {
          Hobby: "n/a",
          Core: "48h",
          Pro: "48h, Teams add-on: 24h",
          Enterprise: "Custom",
        },
      },
      {
        name: "Support SLA",
        href: "/enterprise#faq",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
        },
      },
    ],
  },
  {
    name: "Security",
    href: "/docs/security",
    features: [
      {
        name: "Data region",
        href: "/security/data-regions",
        tiers: {
          Hobby: "US or EU",
          Core: "US or EU",
          Pro: "US or EU",
          Enterprise: "US or EU",
        },
      },
      {
        name: "Data masking",
        href: "/docs/observability/features/masking",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "SSO via Google, AzureAD, GitHub",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Organization-level RBAC",
        href: "/docs/administration/rbac",
        tiers: {
          Hobby: true,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "Enterprise SSO (e.g. Okta, AzureAD/EntraID)",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
        },
      },
      {
        name: "SSO enforcement",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
        },
      },
      {
        name: "Project-level RBAC",
        href: "/docs/administration/rbac#project-level-roles",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
        },
      },
      {
        name: "Data retention management",
        href: "/docs/administration/data-retention",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: TEAMS_ADDON,
          Enterprise: true,
        },
      },
      {
        name: "SCIM API for automated user provisioning",
        href: "/docs/administration/scim-and-org-api",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
        },
      },
      {
        name: "Audit Logs",
        href: "/docs/administration/audit-logs",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: true,
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
          Hobby: false,
          Core: "Self-serve",
          Pro: "Self-serve",
          Enterprise: "Self-serve, Contact sales for " + YEARLY_COMMITMENT,
        },
      },
      {
        name: "Payment methods",
        tiers: {
          Hobby: false,
          Core: "Credit card",
          Pro: "Credit card",
          Enterprise: "Credit card, Invoice",
        },
      },
      {
        name: "Contract duration",
        tiers: {
          Hobby: false,
          Core: "Monthly",
          Pro: "Monthly",
          Enterprise: YEARLY_COMMITMENT,
        },
      },
      {
        name: "Billing via AWS Marketplace",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: YEARLY_COMMITMENT,
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
          Hobby: "Standard T&Cs",
          Core: "Standard T&Cs & DPA",
          Pro: "Standard T&Cs & DPA",
          Enterprise: "Custom with " + YEARLY_COMMITMENT,
        },
      },
      {
        name: "Data processing agreement (GDPR)",
        href: "/security/dpa",
        tiers: {
          Hobby: false,
          Core: true,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "SOC2 Type II & ISO27001 reports",
        href: "/security",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "HIPAA compliance",
        href: "/security/hipaa",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: true,
          Enterprise: true,
        },
      },
      {
        name: "InfoSec/legal reviews",
        href: "/security",
        tiers: {
          Hobby: false,
          Core: false,
          Pro: false,
          Enterprise: YEARLY_COMMITMENT,
        },
      },
    ],
  },
];

export default function Pricing({
  isPricingPage = false,
}: {
  isPricingPage?: boolean;
}) {
  const selectedTiers = tiers;
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
          {value.includes(TEAMS_ADDON) && (
            <HoverCard>
              <HoverCardTrigger>
                <InfoIcon className="inline-block size-3 ml-1" />
              </HoverCardTrigger>
              <HoverCardContent className="w-60">
                Available as part of the Teams add-on on the Pro plan.
              </HoverCardContent>
            </HoverCard>
          )}
          {value.includes(YEARLY_COMMITMENT) && (
            <HoverCard>
              <HoverCardTrigger>
                <InfoIcon className="inline-block size-3 ml-1" />
              </HoverCardTrigger>
              <HoverCardContent className="w-60">
                Available when committing to a yearly contract on the Enterprise
                plan.
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
              title="Pricing"
              description="Get started on the Hobby plan for free. No credit card required."
              h="h1"
            />

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
                  {(tier.name === "Core" || tier.name === "Pro") && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium text-center whitespace-nowrap inline-block">
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
                      <div className={tier.secondaryCta ? "flex gap-2" : ""}>
                        <Button
                          className={tier.secondaryCta ? "flex-1" : "w-full"}
                          variant={tier.featured ? "default" : "outline"}
                          asChild
                        >
                          <Link href={tier.href}>{tier.cta}</Link>
                        </Button>
                        {tier.secondaryCta && (
                          <Button variant="outline" asChild>
                            <Link href={tier.secondaryCta.href}>
                              {tier.secondaryCta.text}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Callouts for different tiers - always render container for alignment */}
                    <div className="p-6 h-[30px] flex items-center justify-center">
                      {tier.calloutLink ? (
                        <div className="text-xs text-muted-foreground text-center">
                          <Link
                            href={tier.calloutLink.href}
                            className="underline hover:text-primary"
                          >
                            {tier.calloutLink.text}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>

                  {/* Trusted by section */}
                  <div className="border-t"></div>
                  <TrustedBy customers={trustedByData.cloud[tier.name]} />
                  <div className="border-t"></div>
                  <CardFooter className="p-4 lg:p-6 flex-col items-start gap-2">
                    <ul className="space-y-2.5 text-sm">
                      {tier.mainFeatures.map((feature, index) => (
                        <li key={index} className="flex space-x-2">
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
                            {tier.addOn.name}
                          </span>
                          {tier.addOn.price && (
                            <span className="font-bold text-sm text-primary">
                              {tier.addOn.price}
                            </span>
                          )}
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
                                {section.features.map((feature) => (
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
                                        value={feature.tiers[tier.name]}
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
                            {section.features.map((feature) => (
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
                                      value={feature.tiers[tier.name]}
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
              <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 mt-16">
                <PricingCalculator />
                <PricingDiscounts />
                <PricingFAQ />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mt-10">
              For a detailed comparison and FAQ, see our{" "}
              <Link href="/pricing" className="underline">
                pricing page
              </Link>
              . You can also{" "}
              <Link href="/self-hosting" className="underline">
                self-host
              </Link>{" "}
              Langfuse OSS.
            </div>
          </>
        )}
      </div>
    </HomeSection>
  );
}
