"use client";

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
import { CornerBox } from "@/components/ui/corner-box";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
import { trustedByData } from "@/data/trusted-by";
import Image from "next/image";

// Reusable graduated pricing text with calculator link
const GraduatedPricingText = () => {
  return (
    <>
      $8/100k units. Lower with volume (
      <Link href="#pricing-calculator" className="underline hover:text-primary">
        pricing calculator
      </Link>
      )
    </>
  );
};

type DeploymentOption = "cloud" | "selfHosted";

type Tier = {
  name: string;
  id: string;
  href: string;
  featured: boolean;
  pillClassName?: string;
  description: string;
  pill?: React.ReactNode;
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
  calloutLink?: {
    text: string;
    href: string;
  };
  addOn?: {
    name: string;
    price?: string;
    mainFeatures: string[];
    cta?: {
      text: string;
      href: string;
    };
    calloutLink?: {
      text: string;
      href: string;
    };
  };
  learnMore?: string;
};

const TEAMS_ADDON = "Teams add-on";
const YEARLY_COMMITMENT = "Yearly Commitment";

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
        "Community support via GitHub",
      ],
      cta: "Sign up",
    },
    {
      name: "Core",
      id: "tier-core",
      href: "https://cloud.langfuse.com",
      featured: true,
      pill: "Unlimited Users",
      description:
        "For production projects. Longer data access and unlimited users.",
      price: "$29",
      priceDiscountCta: {
        name: "Discounts available",
        href: "/pricing#discounts",
      },
      calloutLink: {
        text: "Discounts: Startups, EDU, OSS",
        href: "/pricing#discounts",
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
      pill: "Unlimited Users",
      price: "$199",
      description:
        "For scaling projects. Unlimited history, high rate limits, all features.",
      calloutLink: {
        text: "Discounts: Startups, EDU, OSS",
        href: "/pricing#discounts",
      },
      mainFeatures: [
        "Everything in Core",
        <>
          100k units / month included, additional: <GraduatedPricingText />
        </>,
        "3 years data access",
        "Data retention management",
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
          "Support via Dedicated Slack / MS Teams Channel",
        ],
      },
      cta: "Sign up",
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "/talk-to-us",
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
          "Architecture reviews",
          "Billing via AWS Marketplace",
          "Billing via Invoice",
          "Vendor Onboarding",
        ],
      },
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
      href: "https://langfuse.app.n8n.cloud/form/edaa0e7f-0244-4b3e-92d6-870179e066f2",
      featured: false,
      pillClassName: "bg-[#FAFF6A] text-[#1A1A1A]",
      description:
        "Dedicated Langfuse deployment with enterprise capabilities and support.",
      pill: (
        <>
          <span className="inline-flex rounded-sm p-0.5">
            <Image
              src="/images/logos/clickhouse_icon.svg"
              alt=""
              width={14}
              height={14}
              className="size-3.5 rounded-[2px]"
            />
          </span>
          ClickHouse Cloud / BYOC / Private
        </>
      ),
      price: "Custom Pricing",
      mainFeatures: [
        "All Open Source features plus management APIs, project-level RBAC, data retention policies, and audit logs",
        "Bundled with ClickHouse Cloud, ClickHouse BYOC, or ClickHouse Private",
        "Langfuse pricing is additive to your ClickHouse commercial plan",
        "Dedicated support engineer for deployment and hosting guidance",
        "Solutions architect support during evaluation and rollout",
        "Direct access to the product team for feedback",
        "SOC 2 Type II and ISO 27001 reports",
        "Support SLA",
        "Billing via AWS Marketplace or invoice",
      ],
      cta: "Talk to sales",
      calloutLink: {
        text: "Enterprise FAQ",
        href: "/enterprise",
      },
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
        href: "/docs/opentelemetry/get-started",
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
        href: "/api-and-data-platform/features/public-api",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Included usage",
        description:
          "Billable units are the collection of created traces, observations, and scores in Langfuse.",
        href: "/docs/administration/billable-units",
        tiers: {
          cloud: {
            Hobby: "50k units",
            Core: "100k units",
            Pro: "100k units",
            Enterprise: "100k units",
          },
          selfHosted: { "Open Source": "Unlimited", Enterprise: "Unlimited" },
        },
      },
      {
        name: "Additional usage",
        description:
          "Billable units are the collection of created traces, observations, and scores in Langfuse. Pricing follows graduated tiers with lower rates at higher volumes.",
        href: "/docs/administration/billable-units",
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
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: "Available with " + YEARLY_COMMITMENT,
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
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Access to historical data",
        tiers: {
          cloud: {
            Hobby: "30 days",
            Core: "90 days",
            Pro: "3 years",
            Enterprise: "3 years",
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
    href: "/docs/prompt-management/get-started",
    features: [
      {
        name: "Prompt Versioning",
        description: "Manage prompts via UI, API, SDKs",
        href: "/docs/prompt-management/get-started",
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
          selfHosted: { "Open Source": "Unlimited", Enterprise: "Unlimited" },
        },
      },
      {
        name: "Prompt Release Management",
        description: "Deploy and rollback prompts to different environments",
        href: "/docs/prompt-management/features/prompt-version-control",
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
        href: "/docs/evaluation/dataset-runs/native-run",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Webhooks & Slack",
        description:
          "Trigger webhooks for prompt changes and integrate with Slack",
        href: "/docs/prompt-management/features/webhooks-slack-integrations",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": false, Enterprise: true },
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
        name: "Experiments via SDK",
        description:
          "Experiment on your Datasets via the SDK. This can for example be used to benchmark an agent in CI on a daily basis.",
        href: "/docs/evaluation/experiments/experiments-via-sdk",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Experiments via UI",
        description:
          "Test different versions of your prompts or models in the UI using Datasets you manage in Langfuse.",
        href: "/docs/evaluation/experiments/experiments-via-ui",
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
        href: "/faq/all/user-feedback",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "External Evaluation Pipelines",
        href: "/guides/cookbook/example_external_evaluation_pipelines",
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
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Human Annotation",
        description: "Manually annotate LLM traces in Langfuse",
        href: "/docs/scores/annotation",
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": "Unlimited", Enterprise: "Unlimited" },
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
          selfHosted: { "Open Source": "Unlimited", Enterprise: "Unlimited" },
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
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
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
        href: "/enterprise#faq",
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
        href: "/docs/api-and-data-platform/features/query-via-sdk#ui",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "PostHog Integration",
        href: "/integrations/analytics/posthog",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Mixpanel Integration",
        href: "/integrations/analytics/mixpanel",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "Scheduled Batch Export to Blob Storage",
        href: "/docs/api-and-data-platform/features/query-via-sdk#blob-storage",
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
    name: "Deployment",
    href: "/self-hosting",
    features: [
      {
        name: "ClickHouse deployment model",
        description:
          "Open Source assumes you operate ClickHouse yourself. Enterprise is bundled with ClickHouse Cloud, ClickHouse BYOC, or ClickHouse Private.",
        tiers: {
          selfHosted: {
            "Open Source": "Self-managed ClickHouse OSS",
            Enterprise: "Bundled: ClickHouse Cloud / BYOC / Private",
          },
        },
      },
      {
        name: "Deployment templates",
        description:
          "Use Langfuse deployment docs and templates for supported self-hosted setups.",
        href: "/self-hosting",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Local (Docker Compose)",
        href: "/self-hosting/deployment/docker-compose",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Kubernetes (Helm)",
        href: "/self-hosting/deployment/kubernetes-helm",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "AWS (Terraform)",
        href: "/self-hosting/deployment/aws",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Azure (Terraform)",
        href: "/self-hosting/deployment/azure",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
        },
      },
      {
        name: "GCP (Terraform)",
        href: "/self-hosting/deployment/gcp",
        tiers: {
          selfHosted: {
            "Open Source": true,
            Enterprise: true,
          },
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
        name: "Community (GitHub)",
        href: "/support#community",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": true, Enterprise: true },
        },
      },
      {
        name: "In-app support",
        href: "/support#in-app",
        tiers: {
          cloud: { Hobby: false, Core: true, Pro: true, Enterprise: true },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Private Slack / MS Teams channel",
        href: "/support#slack",
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
        name: "Dedicated Support Engineer",
        href: "/support#onboarding",
        description:
          "Includes deployment and hosting guidance for your dedicated Langfuse environment.",
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
        name: "Onboarding & Architectural guidance",
        href: "/support#onboarding",
        description:
          "Deployment, hosting, and rollout guidance for production self-hosted environments.",
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
        name: "Solutions architect support",
        description:
          "Pre-sales and rollout support for architecture planning and deployment readiness.",
        tiers: {
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Product team feedback channel",
        description:
          "Direct access to the Langfuse product team for roadmap and product feedback.",
        tiers: {
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
        },
      },
      {
        name: "Response time SLO",
        description:
          "Target response time for support requests via supported channels",
        tiers: {
          cloud: {
            Hobby: "n/a",
            Core: "48h",
            Pro: "48h, Teams add-on: 24h",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "Support SLA",
        href: "/enterprise#faq",
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
  {
    name: "Security",
    href: "/docs/security",
    features: [
      {
        name: "Data region",
        href: "/security/data-regions",
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
        name: "Sign in with Google, AzureAD, GitHub",
        tiers: {
          cloud: {
            Hobby: true,
            Core: true,
            Pro: true,
            Enterprise: true,
          },
          selfHosted: { "Open Source": true, Enterprise: true },
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
          selfHosted: { "Open Source": true, Enterprise: true },
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
        name: "Client-side data masking",
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
        name: "Server-side data masking",
        href: "/self-hosting/security/data-masking",
        tiers: {
          selfHosted: {
            "Open Source": false,
            Enterprise: true,
          },
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
            Pro: true,
            Enterprise: true,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "SCIM API for automated user provisioning",
        href: "/docs/administration/scim-and-org-api",
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
        name: "Organization Creators",
        href: "/self-hosting/administration/organization-creators",
        tiers: {
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "UI Customization",
        href: "/self-hosting/administration/ui-customization",
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
        name: "Instance Management API",
        href: "/self-hosting/administration/instance-management-api",
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
            Enterprise: "Self-serve, Contact sales for " + YEARLY_COMMITMENT,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
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
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Contract duration",
        tiers: {
          cloud: {
            Hobby: false,
            Core: "Monthly",
            Pro: "Monthly",
            Enterprise: YEARLY_COMMITMENT,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Billing via AWS Marketplace",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: YEARLY_COMMITMENT,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
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
            Hobby: "Standard T&Cs & DPA",
            Core: "Standard T&Cs & DPA",
            Pro: "Standard T&Cs & DPA",
            Enterprise: "Talk to Sales",
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
      {
        name: "Data processing agreement (GDPR)",
        href: "/security/dpa",
        tiers: {
          cloud: { Hobby: true, Core: true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "SOC2 Type II & ISO27001 reports",
        href: "/security",
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
        href: "/security/hipaa",
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
        href: "/security",
        tiers: {
          cloud: {
            Hobby: false,
            Core: false,
            Pro: false,
            Enterprise: YEARLY_COMMITMENT,
          },
          selfHosted: { "Open Source": false, Enterprise: true },
        },
      },
    ],
  },
];

// Helper component for feature details display
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
        <InfoIcon className="inline-block ml-1 size-3" />
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

// Helper component for feature cell rendering
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
              <InfoIcon className="inline-block ml-1 size-3" />
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              Available as part of the Teams add-on on the Pro plan.
            </HoverCardContent>
          </HoverCard>
        )}
        {value.includes(YEARLY_COMMITMENT) && (
          <HoverCard>
            <HoverCardTrigger>
              <InfoIcon className="inline-block ml-1 size-3" />
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
          <CheckIcon className="w-5 h-5 text-primary" />
        ) : (
          <MinusIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
    );
  } else {
    return (
      <div className="text-sm leading-6 text-center break-words">{value}</div>
    );
  }
};

// Pricing Plans component - renders the card grid
export function PricingPlans({ variant }: { variant: DeploymentOption }) {
  const selectedTiers = tiers[variant];

  return (
    <div
      className={cn(
        "mt-12",
        selectedTiers.length === 1
          ? "flex justify-center"
          : "grid grid-cols-1 gap-y-6 gap-x-6 md:grid-cols-2 md:gap-x-2 lg:gap-x-6 lg:items-stretch",
        selectedTiers.length === 4 && "lg:grid-cols-4",
        selectedTiers.length === 3 && "lg:grid-cols-3",
        selectedTiers.length === 2 && "lg:grid-cols-2",
      )}
    >
      {selectedTiers.map((tier) => {
        return (
          <Card
            key={tier.id}
            hoverStripes
            className={cn(
              "relative h-full flex flex-col",
              selectedTiers.length === 1 && "w-full max-w-lg",
            )}
          >
            {tier.pill && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-center whitespace-nowrap rounded-full",
                    tier.pillClassName ?? "bg-primary text-primary-foreground",
                  )}
                >
                  {tier.pill}
                </div>
              </div>
            )}

            <CardHeader className="p-4 text-left lg:p-6">
              <CardTitle className="text-lg font-semibold text-foreground">
                {tier.name}
              </CardTitle>
              <CardDescription className="text-left max-w-[24ch]">
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
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="ml-1 text-sm leading-4">
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
                      variant={tier.featured ? "primary" : "secondary"}
                      href={tier.href}
                      wrapperClassName="flex-1"
                      className={cn(
                        "justify-center!",
                        !tier.featured &&
                          "group-hover:border-line-structure hover:border-line-cta"
                      )}
                    >
                      {tier.cta}
                    </Button>
                    <Button
                      variant="secondary"
                      href={tier.ctaCallout.href}
                      wrapperClassName="flex-1"
                      className="justify-center! group-hover:border-line-structure hover:border-line-cta"
                    >
                      {tier.ctaCallout.text}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant={tier.featured ? "primary" : "secondary"}
                    href={tier.href}
                    className={cn(
                      "justify-center!",
                      !tier.featured &&
                        "group-hover:border-line-structure hover:border-line-cta"
                    )}
                  >
                    {tier.cta}
                  </Button>
                )}
              </div>

              {/* Callouts for different tiers - always render container for alignment */}
              <div className="px-0 py-6 h-[30px] flex items-center justify-center">
                {tier.calloutLink ? (
                  <div className="text-xs text-center text-muted-foreground whitespace-nowrap">
                    <Link
                      href={tier.calloutLink.href}
                      className="underline underline-offset-2 decoration-auto text-muted-foreground hover:text-primary"
                    >
                      {tier.calloutLink.text}
                    </Link>
                  </div>
                ) : null}
              </div>
            </CardContent>

            {/* Trusted by section for cloud tiers */}
            {variant === "cloud" && (
              <>
                <div className="border-t border-line-structure"></div>
                <TrustedBy customers={trustedByData.cloud[tier.name]} />
              </>
            )}
            <div className="border-t border-line-structure"></div>
            <CardFooter className="flex-col gap-2 items-start p-4 lg:p-6">
              <ul className="space-y-2.5 text-sm">
                {tier.mainFeatures.map((feature, index) => (
                  <li key={index} className="flex space-x-2">
                    <Check className="shrink-0 mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {tier.addOn && (
                <div className="relative mt-3 w-full">
                  <div className="absolute top-0 left-1/2 z-10 px-2 text-xs -translate-x-1/2 -translate-y-1/2 bg-surface-bg text-muted-foreground">
                    + optional
                  </div>
                  <CornerBox className="p-3 pt-4 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-primary">
                      {tier.addOn.name}
                    </span>
                    {tier.addOn.price && (
                      <span className="text-sm font-bold text-primary">
                        {tier.addOn.price}
                      </span>
                    )}
                  </div>
                  <ul className="mt-1 space-y-1 text-sm">
                    {tier.addOn.mainFeatures.map((feature) => (
                      <li key={feature} className="flex space-x-2">
                        <Check className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.addOn.cta && (
                    <Button
                      variant="secondary"
                      size="small"
                      href={tier.addOn.cta.href}
                      wrapperClassName="mt-3"
                      className="justify-center! group-hover:border-line-structure hover:border-line-cta"
                    >
                      {tier.addOn.cta.text}
                    </Button>
                  )}
                  {tier.addOn.calloutLink && (
                    <div className="mt-2 text-xs text-center text-muted-foreground">
                      <Link
                        href={tier.addOn.calloutLink.href}
                        className="underline hover:text-primary"
                      >
                        {tier.addOn.calloutLink.text}
                      </Link>
                    </div>
                  )}
                  </CornerBox>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

// Pricing Table component - renders the comparison tables
export function PricingTable({
  variant,
  isPricingPage = false,
}: {
  variant: DeploymentOption;
  isPricingPage?: boolean;
}) {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [headerWidth, setHeaderWidth] = useState<number>(0);
  const [headerLeft, setHeaderLeft] = useState<number>(0);
  const [containerLeft, setContainerLeft] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  const selectedTiers = tiers[variant];
  const visibleSections = sections.filter((section) =>
    section.features.some((feature) => variant in feature.tiers),
  );

  useEffect(() => {
    if (!isPricingPage) return;

    const getContainer = () =>
      document.getElementById("home-main-area") ??
      tableRef.current?.parentElement ??
      null;

    const calculateWidths = () => {
      if (headerRef.current && tableRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        setHeaderWidth(tableRect.width);
        setHeaderLeft(tableRect.left);

        const container = getContainer();
        if (container) {
          const containerRect = container.getBoundingClientRect();
          setContainerLeft(containerRect.left);
          setContainerWidth(containerRect.width);
        }

        const headerCells = headerRef.current.querySelectorAll("th");
        const widths = Array.from(headerCells).map(
          (cell) => (cell as HTMLElement).getBoundingClientRect().width,
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
      /** Keep aligned with `--lf-nav-primary-height` in `src/overrides.css`. */
      const navbarHeight = 60;

      // Keep the sticky header aligned with the table / container horizontal
      // position (layout may shift if content above the table changes size).
      setHeaderLeft(tableRect.left);
      setHeaderWidth(tableRect.width);

      const container = getContainer();
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setContainerLeft(containerRect.left);
        setContainerWidth(containerRect.width);
      }

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

  return (
    <>
      {/* Feature comparison (up to lg) */}
      <section
        aria-labelledby="mobile-comparison-heading"
        className="mt-20 lg:hidden"
      >
        <h2 id="mobile-comparison-heading" className="sr-only">
          Feature comparison
        </h2>

        <div
          className={cn(
            "mx-auto space-y-16",
            selectedTiers.length === 1 ? "max-w-xl" : "max-w-2xl",
          )}
        >
          {selectedTiers.map((tier) => (
            <div key={tier.id}>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h4>
                <p className="mt-2 text-sm text-muted-foreground max-w-[24ch]">
                  {tier.description}
                </p>
              </div>
              <Table>
                <TableBody>
                  {visibleSections.map((section) => (
                    <React.Fragment key={section.name}>
                      <TableRow className="bg-surface-1 hover:bg-surface-1">
                        <TableHead
                          colSpan={2}
                          className="w-full font-bold text-primary"
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
                                  feature.tiers[variant]?.[tier.name] ?? false
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
        className={cn(
          "hidden lg:block mt-20",
          selectedTiers.length === 1 && "max-w-4xl mx-auto",
        )}
        ref={tableRef}
      >
        <h2 id="comparison-heading" className="sr-only">
          Feature comparison
        </h2>

        {mounted &&
          isHeaderFixed &&
          columnWidths.length > 0 &&
          createPortal(
            <div
              className="fixed z-40 border-b border-line-structure bg-surface-2"
              style={{
                top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height))",
                left: containerWidth > 0 ? containerLeft : headerLeft,
                width: containerWidth > 0 ? containerWidth : headerWidth,
              }}
            >
              <table
                className="bg-transparent border-none"
                style={{
                  width: headerWidth,
                  marginLeft:
                    containerWidth > 0
                      ? Math.max(0, headerLeft - containerLeft)
                      : 0,
                  marginRight: 0,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{ width: columnWidths[0] }}
                      className="font-medium text-left bg-transparent border-none"
                      scope="col"
                    ></th>
                    {selectedTiers.map((tier, index) => (
                      <th
                        key={tier.id}
                        style={{ width: columnWidths[index + 1] }}
                        className="py-2 text-lg font-semibold text-center bg-transparent border-none text-foreground"
                        scope="col"
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>,
            document.body,
          )}

        <div className="relative">
          <Table
            className={cn(selectedTiers.length === 1 ? "w-full" : "w-full")}
          >
            <thead ref={headerRef} className="bg-surface-2">
              <tr>
                <th
                  className={cn(
                    "text-left font-medium",
                    selectedTiers.length === 1 ? "w-7/12" : "w-3/12",
                  )}
                  scope="col"
                ></th>
                {selectedTiers.map((tier) => (
                  <th
                    key={tier.id}
                    className={cn(
                      "p-2 text-center text-lg text-foreground font-semibold",
                      selectedTiers.length === 1 ? "w-5/12" : "w-2/12",
                    )}
                    scope="col"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <TableBody>
              {visibleSections.map((section) => (
                <React.Fragment key={section.name}>
                  <TableRow className="bg-surface-1 hover:bg-surface-1">
                    <TableCell
                      colSpan={selectedTiers.length + 1}
                      className="font-medium"
                    >
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
                                feature.tiers[variant]?.[tier.name] ?? false
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
  );
}