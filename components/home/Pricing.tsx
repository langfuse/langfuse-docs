import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Plus, Minus, ExternalLink } from "lucide-react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { Header } from "../Header";
import { HomeSection } from "./components/HomeSection";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
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
  priceDiscountCta?: {
    name: string;
    href: string;
  };
  learnMore?: string;
};

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
        "50k observations / month included",
        "30 days data access",
        "2 users",
        "Community support (Discord & GitHub)",
      ],
      cta: "Sign up",
    },
    {
      name: "Pro",
      id: "tier-pro",
      href: "https://cloud.langfuse.com",
      featured: true,
      description:
        "For production projects. Includes access to full history and higher usage.",
      price: "$59",
      priceDiscountCta: {
        name: "Discounts available",
        href: "/pricing#discounts",
      },
      mainFeatures: [
        "Everything in Hobby",
        "100k observations / month included, additional: $10 / 100k observations",
        "Unlimited data access",
        "Unlimited users",
        "Unlimited evaluators",
        "Support via Email/Chat",
      ],
      cta: "Sign up",
    },
    {
      name: "Team",
      id: "tier-team",
      href: "https://cloud.langfuse.com",
      featured: false,
      price: "$499",
      description: "Dedicated support, and security controls for larger teams.",
      mainFeatures: [
        "Everything in Pro",
        "100k observations / month included, additional: $10 / 100k observations",
        "Custom SSO, SSO enforcement",
        "Fine-grained RBAC",
        "SOC2, ISO27001",
        "Support via Slack",
      ],
      cta: "Sign up",
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "/schedule-demo",

      featured: false,
      description: "Enterprise-grade support and security features.",
      price: "Custom",
      mainFeatures: [
        "Everything in Team",
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
        "Custom SSO and basic RBAC",
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
    },
    {
      name: "Enterprise",
      id: "tier-self-hosted-enterprise",
      href: "/schedule-demo",
      featured: false,
      price: "Custom",
      description: "Enterprise-grade support and security features.",
      mainFeatures: [
        "All Open Source / Pro features",
        "Fine-grained RBAC",
        "Enterprise Security Features",
        "SOC2, ISO27001, and InfoSec reviews",
        "Dedicated support engineer",
        "Support SLA",
        "Billing via AWS Marketplace",
      ],
      cta: "Talk to sales",
      learnMore: "/enterprise",
    },
  ],
} as const;

type Section = {
  name: string;
  href?: string;
  features: {
    name: string;
    href?: string;
    tiers: Partial<Record<DeploymentOption, Record<string, boolean | string>>>;
  }[];
};

const sections: Section[] = [
  {
    name: "Tracing",
    href: "/docs/tracing",
    features: [
      {
        name: "Integrations/SDKs",
        href: "/docs/integrations/overview",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Custom via API",
        href: "/docs/api",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Included usage",
        tiers: {
          cloud: {
            Hobby: "50k observations",
            Pro: "100k observations",
            Team: "100k observations",
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
        tiers: {
          cloud: {
            Hobby: false,
            Pro: "$10 / 100k observations",
            Team: "$10 / 100k observations",
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
            Pro: "Free while in beta",
            Team: "Free while in beta",
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
            Pro: "Unlimited",
            Team: "Unlimited",
            Enterprise: "Unlimited",
          },
        },
      },
      {
        name: "Ingestion throughput",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "4,000 requests / min",
            Pro: "4,000 requests / min",
            Team: "20,000 requests / min",
            Enterprise: "Custom",
          },
        },
      },
    ],
  },
  {
    name: "Core Platform Features",
    features: [
      {
        name: "Datasets",
        href: "/docs/datasets",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Evaluation / User-feedback",
        href: "/docs/scores",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Management",
        href: "/docs/prompts",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
    ],
  },
  {
    name: "Add-on Features",
    features: [
      {
        name: "Playground",
        href: "/docs/playground",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Experiments",
        href: "/docs/datasets/prompt-experiments",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: {
            "Open Source": false,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "LLM-as-judge evaluators",
        href: "/docs/scores/model-based-evals",
        tiers: {
          cloud: {
            Hobby: "1 evaluator",
            Pro: true,
            Team: true,
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
        name: "Human Annotation Queues",
        href: "/docs/scores/annotation#annotation-queues",
        tiers: {
          cloud: {
            Hobby: "1 queue",
            Pro: "3 queues",
            Team: true,
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
            Pro: "Unlimited",
            Team: "Unlimited",
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
            Pro: "Unlimited",
            Team: "Unlimited",
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
        tiers: {
          cloud: {
            Hobby: true,
            Pro: true,
            Team: true,
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
        name: "Rate limit",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: {
            Hobby: "1,000 requests / min",
            Pro: "1,000 requests / min",
            Team: "1,000 requests / min",
            Enterprise: "Custom",
          },
        },
      },
      {
        name: "SLA",
        href: "/faq/all/api-limits",
        tiers: {
          cloud: { Hobby: false, Pro: false, Team: false, Enterprise: true },
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
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Community (GitHub, Discord)",
        tiers: {
          cloud: { Hobby: true, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Chat & Email",
        tiers: {
          cloud: { Hobby: false, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Private Slack/Discord channel",
        tiers: {
          cloud: { Hobby: false, Pro: false, Team: true, Enterprise: true },
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
          cloud: { Hobby: false, Pro: false, Team: false, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Support SLA",
        tiers: {
          cloud: {
            Hobby: false,
            Pro: false,
            Team: false,
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
            Pro: false,
            Team: false,
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
            Pro: "US or EU",
            Team: "US or EU",
            Enterprise: "US or EU",
          },
        },
      },
      {
        name: "SSO via Google, AzureAD, GitHub",
        tiers: {
          cloud: {
            Hobby: true,
            Pro: true,
            Team: true,
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
            Pro: true,
            Team: true,
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
          cloud: { Hobby: false, Pro: false, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "SSO enforcement",
        tiers: {
          cloud: { Hobby: false, Pro: false, Team: true, Enterprise: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Project-level RBAC",
        href: "/docs/rbac#project-level-roles",
        tiers: {
          cloud: { Hobby: false, Pro: false, Team: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Data retention management",
        href: "/docs/data-retention",
        tiers: {
          cloud: {
            Hobby: false,
            Pro: false,
            Team: true,
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
          cloud: { Hobby: false, Pro: false, Team: false, Enterprise: true },
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
            Pro: "Self-serve",
            Team: "Self-serve",
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
            Pro: "Credit card",
            Team: "Credit card",
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
            Pro: "Monthly",
            Team: "Monthly",
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
            Pro: false,
            Team: false,
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
            Pro: "Standard T&Cs & DPA",
            Team: "Standard T&Cs & DPA",
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
          cloud: { Hobby: false, Pro: true, Team: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "SOC2 Type II & ISO27001 reports",
        tiers: {
          cloud: { Hobby: false, Pro: false, Team: true, Enterprise: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "InfoSec/legal reviews",
        tiers: {
          cloud: {
            Hobby: false,
            Pro: false,
            Team: false,
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

  const InfoLink = ({ href }: { href: string }) => (
    <Link href={href} className="inline-block" target="_blank">
      <ExternalLink className="size-4 ml-2 pt-0.5" />
    </Link>
  );

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
                    <Button
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                      asChild
                    >
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
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
                                  <TableCell
                                    colSpan={2}
                                    className="w-10/12 text-primary font-bold"
                                  >
                                    {section.name}
                                    {section.href && (
                                      <InfoLink href={section.href} />
                                    )}
                                  </TableCell>
                                </TableRow>
                                {section.features
                                  .filter((f) => variant in f.tiers)
                                  .map((feature) => (
                                    <TableRow
                                      key={feature.name}
                                      className="text-muted-foreground"
                                    >
                                      <TableCell className="w-11/12">
                                        {feature.name}
                                        {feature.href && (
                                          <InfoLink href={feature.href} />
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {typeof feature.tiers[variant][
                                          tier.name
                                        ] === "string" ? (
                                          <div className="text-sm leading-6 text-center">
                                            {feature.tiers[variant][tier.name]}
                                          </div>
                                        ) : (
                                          <div className="flex justify-center">
                                            {feature.tiers[variant][
                                              tier.name
                                            ] === true ? (
                                              <CheckIcon className="h-5 w-5 text-primary" />
                                            ) : (
                                              <MinusIcon className="h-5 w-5 text-muted-foreground" />
                                            )}
                                          </div>
                                        )}
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
                >
                  <h2 id="comparison-heading" className="sr-only">
                    Feature comparison
                  </h2>

                  <Table className="w-full">
                    <TableHeader className="bg-background">
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableHead className="w-3/12" />
                        {selectedTiers.map((tier) => (
                          <TableHead
                            key={tier.id}
                            className="w-2/12 text-center text-lg text-foreground font-semibold"
                          >
                            {tier.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.map((section) => (
                        <React.Fragment key={section.name}>
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={5} className="font-medium">
                              {section.name}
                              {section.href && <InfoLink href={section.href} />}
                            </TableCell>
                          </TableRow>
                          {section.features
                            .filter((f) => variant in f.tiers)
                            .map((feature) => (
                              <TableRow
                                key={feature.name}
                                className="text-muted-foreground"
                              >
                                <TableCell>
                                  {feature.name}
                                  {feature.href && (
                                    <InfoLink href={feature.href} />
                                  )}
                                </TableCell>
                                {selectedTiers.map((tier) => (
                                  <TableCell key={tier.id}>
                                    {typeof feature.tiers[variant][
                                      tier.name
                                    ] === "string" ? (
                                      <div className="text-sm leading-6 text-center">
                                        {feature.tiers[variant][tier.name]}
                                      </div>
                                    ) : (
                                      <div className="flex justify-center">
                                        {feature.tiers[variant][tier.name] ===
                                        true ? (
                                          <CheckIcon className="h-5 w-5 text-primary" />
                                        ) : (
                                          <MinusIcon className="h-5 w-5 text-muted-foreground" />
                                        )}
                                      </div>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
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
    question: "What is an observation?",
    answer:
      "Traces in Langfuse include a set of observations. An observation is a single event that occurred in your system. For example, a single LLM call, a single HTTP request, a single log object, or a database query. Check out the <a class='underline' href='/docs/tracing'>Langfuse Tracing docs<a/> for more details.",
  },
  {
    question: "Can I self-host Langfuse?",
    answer:
      "Yes, Langfuse is open source and you can run Langfuse <a class='underline' href='/self-hosting/local'>locally using docker compose<a/> or for <a class='underline' href='/self-hosting'>production use via docker<a/> and a standalone database.",
  },
  {
    question: "Where is the data stored?",
    answer:
      "Langfuse Cloud is hosted on AWS and data is stored in the US or EU depending on your selection. See our <a class='underline' href='/docs/data-security-privacy'>security and privacy documentation</a> for more details.",
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
