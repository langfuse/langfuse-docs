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
    subtitle:
      "Deploy Langfuse OSS today. Upgrade to Pro or Enterprise at any time.",
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
  mainFeatures: string[];
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
        "50k events / month included",
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
        "For production projects. Includes access to more history, usage and unlimited users.",
      price: "$59",
      priceDiscountCta: {
        name: "Discounts available",
        href: "/pricing#discounts",
      },
      mainFeatures: [
        "Everything in Hobby",
        "100k events / month included, additional: $8 / 100k events",
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
        "100k events / month included, additional: $8 / 100k events",
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
        "Everything in Team",
        "Custom rate limits",
        "Uptime SLA",
        "Support SLA",
        "Custom Terms & DPA",
        "Dedicated support engineer",
        "Architecture reviews",
        "Billing via AWS Marketplace",
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
      name: "Pro",
      id: "tier-self-hosted-pro",
      href: "https://buy.stripe.com/aEU6qufIwfJy0CYbIR",
      featured: false,
      description:
        "Get access to additional workflow features to accelerate your team.",
      price: "$100",
      priceUnit: "user per month",
      mainFeatures: [
        "All Open Source features",
        "LLM Playground",
        "Human annotation queues",
        "LLM-as-a-judge evaluators",
        "Prompt Experiments",
        "Chat & Email support",
      ],
      cta: "Subscribe",
      ctaCallout: {
        text: "Request trial",
        href: "/request-trial",
      },
    },
    {
      name: "Enterprise",
      id: "tier-self-hosted-enterprise",
      href: "/talk-to-us",
      featured: false,
      price: "Custom",
      description: "Enterprise-grade support and security features.",
      mainFeatures: [
        "All Open Source / Pro features",
        "Project-level RBAC",
        "Enterprise Security Features",
        "SOC2, ISO27001, and InfoSec reviews",
        "Dedicated support engineer",
        "Support SLA",
        "Billing via AWS Marketplace",
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
    tiers: Partial<Record<DeploymentOption, Record<string, boolean | string>>>;
  }[];
};

const sections: Section[] = [
  {
    name: "LLM Application & Agent Tracing",
    href: "/docs/tracing",
    features: [
      {
        name: "Traces and Graphs (Agents)",
        href: "/docs/tracing",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Session Tracking (Chats/Threads)",
        href: "/docs/tracing-features/sessions",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "User Tracking",
        href: "/docs/tracing-features/users",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Token and Cost Tracking",
        href: "/docs/model-usage-and-cost",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Native Frameworks Integrations",
        description:
          "Langfuse integrates natively with many LLM providers and agent frameworks such as LangChain, LlamaIndex, LangGraph, CrewAI, Semantic Kernel, ...",
        href: "/docs/integrations/overview",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "SDKs (Python, JavaScript)",
        href: "/docs/sdk/overview",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "OpenTelemetry (Java, Go, custom)",
        description:
          "Use Langfuse as an OpenTelemetry backend. Thereby you can use any OpenTelemetry compatible SDKs (Java, Go, etc.) to send traces to Langfuse. This also increases compatibility with many frameworks and LLM providers.",
        href: "/docs/opentelemetry/get-started",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Proxy-based Logging (via LiteLLM)",
        href: "/docs/integrations/litellm/tracing",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Custom via API",
        href: "/docs/api",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Included usage",
        description:
          "Events are the collection of created traces, observations, and scores in Langfuse.",
        href: "/docs/tracing-data-model",
        tiers: {
          cloud: {
            Hobby: "50k events",
            Core: "100k events",
            Pro: "100k events",
            Enterprise: "Custom",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Additional usage",
        description:
          "Events are the collection of created traces, observations, and scores in Langfuse.",
        href: "/docs/tracing-data-model",
        tiers: {
          cloud: {
            Hobby: false,
            Core: "$8 / 100k events",
            Pro: "$8 / 100k events",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Multi-modal",
        href: "/docs/tracing-features/multi-modality",
        tiers: {
          cloud: {
            Hobby: "Free while in beta",
            Core: "Free while in beta",
            Pro: "Free while in beta",
            Enterprise: "Free while in beta",
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
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
    href: "/docs/prompts",
    features: [
      {
        name: "Prompt Versioning",
        description: "Manage prompts via UI, API, SDKs",
        href: "/docs/prompts",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
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
            Pro: "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Prompt Release Management",
        description: "Deploy and rollback prompts to different environments",
        href: "/docs/prompts",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Composability",
        description:
          "Create shared snippets that can be reused in different prompts",
        href: "/docs/prompts/get-started#composability",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Caching (server and client)",
        description: "Use prompts with 0 latency and uptime impact",
        href: "/docs/prompts/get-started#caching-in-client-sdks",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Playground",
        description: "Test prompts in a sandbox environment",
        href: "/docs/playground",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Experiments",
        description: "Run structured experiments on new prompt versions",
        href: "/docs/datasets/prompt-experiments",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: {
            "Open Source": false,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Protected Deployment Labels",
        description:
          "Prevent certain prompt labels from being modified or deleted by non-admins/owners",
        href: "/docs/prompts/get-started#protected-prompt-labels",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Pro: false,
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
        href: "/docs/datasets",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Custom Experiments (via SDK)",
        description:
          "Run custom experiments on your Langfuse datasets via the SDK. This can for example be used to benchmark an agent in CI on a daily basis.",
        href: "/docs/datasets",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Evaluation Scores (custom)",
        href: "/docs/scores",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "User Feedback Tracking",
        href: "/docs/scores/user-feedback",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Human Annotation",
        description: "Manually annotate LLM traces in Langfuse",
        href: "/docs/scores/annotation",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Human Annotation Queues",
        description: "Managed human annotation workflows with queues",
        href: "/docs/scores/annotation#annotation-queues",
        tiers: {
          cloud: {
            Hobby: "1 queue",
            Core: "3 queues",
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "External Evaluation Pipelines",
        href: "/docs/scores/external-evaluation-pipelines",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "LLM-as-judge evaluators",
        description:
          "Fully managed LLM-as-judge evaluators within Langfuse. Can be run on any dataset or LLM trace.",
        href: "/docs/scores/model-based-evals",
        tiers: {
          cloud: {
            Hobby: "1 evaluator",
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Pro: true,
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
            Pro: "Unlimited",
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
            Pro: "As licensed",
            Enterprise: "As licensed",
          },
        },
      },
    ],
  },
  {
    name: "API",
    href: "/docs/api",
    features: [
      {
        name: "Extensive Public API",
        href: "/docs/api",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
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
            Hobby: "10 requests / day",
            Core: "20 requests / day",
            Pro: "200 requests / day",
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
        href: "/docs/query-traces#ui",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "PostHog Integration",
        href: "/docs/analytics/integrations/posthog",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Scheduled Batch Export to Blob Storage",
        href: "/docs/query-traces#blob-storage",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Community (GitHub, Discord)",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Chat & Email",
        tiers: {
          cloud: { Hobby: false, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
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
            Pro: "included at >10 users",
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
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
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
            Pro: false,
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
            Pro: false,
            Enterprise: true,
          },
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
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Organization-level RBAC",
        href: "/docs/rbac",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
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
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Project-level RBAC",
        href: "/docs/rbac#project-level-roles",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Data retention management",
        href: "/docs/data-retention",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: TEAMS_ADDON,
            Enterprise: true,
          },
          selfHosted: {
            "Open Source": false,
            Pro: false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Organization Creators",
        href: "/self-hosting/organization-creators",
        tiers: {
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "UI Customization",
        href: "/self-hosting/ui-customization",
        tiers: {
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Audit Logs",
        href: "/changelog/2025-01-21-audit-logs",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Admin API (project management, SCIM)",
        href: "/docs/api#org-scoped-routes",
        tiers: {
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Organization Management API",
        href: "/self-hosting/organization-management-api",
        tiers: {
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
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
            Pro: "Self-serve",
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
            Pro: "Credit card",
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
            Pro: "Monthly",
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
            Pro: ">10 users",
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
            Pro: "Standard T&Cs",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Data processing agreement (GDPR)",
        tiers: {
          cloud: { Hobby: false, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
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
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
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
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
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

  const FeatureCell = ({ value }: { value: boolean | string }) => {
    return typeof value === "string" ? (
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
    ) : (
      <div className="flex justify-center">
        {value === true ? (
          <CheckIcon className="h-5 w-5 text-primary" />
        ) : (
          <MinusIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    );
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
                  <CardHeader className="p-4 lg:p-6 text-left">
                    <CardTitle className="text-lg text-foreground font-semibold">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-left md:min-h-20 lg:min-h-16">
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
                  <CardContent className="p-0 px-4 lg:px-6 mb-4">
                    {tier.ctaCallout ? (
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant={tier.featured ? "default" : "outline"}
                          asChild
                        >
                          <Link href={tier.href}>{tier.cta}</Link>
                        </Button>
                        <Button className="flex-1" variant="secondary" asChild>
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
                        <div className="mt-2 h-[20px]" />
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 lg:p-6 flex-col items-start gap-2">
                    <div>
                      <span className="font-bold text-3xl">{tier.price}</span>
                      {tier.price.includes("$") && (
                        <span className="text-sm leading-4 mt-2">
                          {tier.priceUnit ? `/ ${tier.priceUnit}` : "/ month"}
                        </span>
                      )}
                    </div>
                    <ul className="mt-3 space-y-2.5 text-sm">
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
              <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <DiscountOverview className="mt-10" />
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
      text: "Request startup discount",
      href: "https://forms.gle/eJAYjRWeCZU1Mn6j8",
    },
  },
  {
    name: "Education / Non-profits",
    description: "Up to 100% off, limits apply",
  },
  {
    name: "Open-source projects",
    description: "USD 300 in credits, first year",
  },
];

const DiscountOverview = ({ className }: { className?: string }) => (
  <div
    className={cn("mx-auto max-w-7xl px-6 lg:px-8 pt-20", className)}
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
    question: "What is a billable event?",
    answer:
      "A billable event in Langfuse is any tracing data point you send to our platform - this includes traces (complete LLM interactions), observations (individual steps within a trace like prompts or generations), and scores (evaluations of your AI outputs). For a detailed explanation, see our <a class='underline' href='/docs/tracing-data-model'>Langfuse Data Model docs</a>.",
  },
  {
    question: "Can I self-host Langfuse?",
    answer:
      "Yes, Langfuse is open source and you can run Langfuse <a class='underline' href='/self-hosting/local'>locally using docker compose<a/> or for <a class='underline' href='/self-hosting'>production use via docker<a/> and a standalone database.",
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
    question: "How do I activate my self-hosted Pro or Enterprise plan?",
    answer:
      "Once you've deployed Langfuse OSS, you can activate your Pro or Enterprise plan by adding the license key you received from the Langfuse team to your deployment.",
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
