import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Plus, Minus, X, ExternalLink } from "lucide-react";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const deploymentOptions = {
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

const tiers = {
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
        "2 users included",
        "Community support (Discord & GitHub)",
      ],
      cta: "Sign up",
    },
    {
      name: "Starter",
      id: "tier-starter",
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
      description: "Dedicated support, and security controls for larger teams.",
      mainFeatures: [
        "100k observations / month included, additional: $10 / 100k observations",
        "SSO enforcement, fine-grained RBAC",
        "SOC2, ISO27001",
        "Dedicated support channel",
      ],
      cta: "Sign up",
    },
    {
      name: "Enterprise",
      id: "tier-enterprise",
      href: "/schedule-demo",

      featured: false,
      description:
        "Enterprise-grade support and security features. Contact us for pricing.",
      price: "Talk to us",
      mainFeatures: [
        "All features",
        "Dedicated support engineer",
        "SLAs",
        "Architecture reviews",
        "InfoSec/legal reviews",
        "Billing via AWS Marketplace",
      ],
      cta: "Schedule a demo",
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
        "Unlimited usage",
        "Deployment docs & Helm chart",
        "SSO and basic RBAC",
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
      priceUnit: "user",
      mainFeatures: [
        "All Open Source features",
        "LLM Playground",
        "Human annotation queues",
        "LLM as a judge evaluators",
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
      description:
        "Enterprise-grade support and security features. Contact us for pricing.",
      mainFeatures: [
        "All Open Source / Pro features",
        "Fine-grained RBAC",
        "SOC2, ISO27001, and InfoSec reviews",
        "Dedicated support engineer and SLAs",
        "Billing via AWS Marketplace",
      ],
      cta: "Talk to founders",
      learnMore: "/enterprise",
    },
  ],
} as const;

const sections = [
  {
    name: "Tracing",
    href: "/docs/tracing",
    features: [
      {
        name: "Integrations/SDKs",
        href: "/docs/integrations/overview",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Custom via API",
        href: "/docs/api",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Included usage",
        tiers: {
          cloud: {
            Hobby: "50k observations",
            Starter: "100k observations",
            Pro: "100k observations",
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
            Starter: "$10 / 100k observations",
            Pro: "$10 / 100k observations",
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Multi-modal",
        tiers: {
          cloud: {
            Hobby: "Pricing tba, free while in beta",
            Starter: "Pricing tba, free while in beta",
            Pro: "Pricing tba, free while in beta",
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
            Starter: "Unlimited",
            Pro: "Unlimited",
          },
          selfHosted: {
            "Open Source": "Unlimited",
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
            Hobby: "4,000 requests / min",
            Starter: "4,000 requests / min",
            Pro: "20,000 requests / min",
          },
          selfHosted: {
            "Open Source": "Unlimited",
            Pro: "Unlimited",
            Enterprise: "Unlimited",
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
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Evaluation / User-feedback",
        href: "/docs/scores",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Management",
        href: "/docs/prompts",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
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
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Prompt Experiments",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
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
            Starter: true,
            Pro: true,
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
            Starter: "3 queues",
            Pro: true,
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
            Starter: "Unlimited",
            Pro: "Unlimited",
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
          cloud: { Hobby: "2", Starter: "Unlimited", Pro: "Unlimited" },
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
        name: "Extensive GET API",
        tiers: {
          cloud: {
            Hobby: true,
            Starter: true,
            Pro: true,
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
            Starter: "1,000 requests / min",
            Pro: "1,000 requests / min",
          },
          selfHosted: {
            "Open Source": "n/a",
            Pro: "n/a",
            Enterprise: "n/a",
          },
        },
      },
    ],
  },
  {
    name: "Support",
    features: [
      {
        name: "Community (GitHub, Discord)",
        tiers: {
          cloud: { Hobby: true, Starter: true, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Chat & Email",
        tiers: {
          cloud: { Hobby: false, Starter: true, Pro: true },
          selfHosted: { "Open Source": false, Pro: true, Enterprise: true },
        },
      },
      {
        name: "Private Slack/Discord channel",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: {
            "Open Source": false,
            Pro: "Add-on, included at >10 users",
            Enterprise: true,
          },
        },
      },
      {
        name: "Dedicated Support Engineer",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "SLAs",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: "Enterprise" },
          selfHosted: {
            "Open Source": false,
            Pro: false,
            Enterprise: "Add-on",
          },
        },
      },
      {
        name: "Architectural guidance",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: "Enterprise" },
          selfHosted: {
            "Open Source": false,
            Pro: false,
            Enterprise: "Add-on",
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
            Starter: "US or EU",
            Pro: "US or EU",
          },
          selfHosted: {
            "Open Source": "Own infrastructure",
            Pro: "Own infrastructure",
            Enterprise: "Own infrastructure",
          },
        },
      },
      {
        name: "SSO via Google, AzureAD, GitHub",
        tiers: {
          cloud: {
            Hobby: true,
            Starter: true,
            Pro: true,
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
            Starter: true,
            Pro: true,
          },
          selfHosted: {
            "Open Source": true,
            Pro: true,
            Enterprise: true,
          },
        },
      },
      {
        name: "Enterprise SSO (e.g. Okta, Auth0)",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": true, Pro: true, Enterprise: true },
        },
      },
      {
        name: "SSO enforcement",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Project-level RBAC",
        href: "/docs/rbac",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Audit Logs",
        href: "/changelog/2025-01-21-audit-logs",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Data retention management",
        href: "/docs/data-retention",
        tiers: {
          cloud: {
            Hobby: false,
            Starter: false,
            Pro: true,
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
    name: "Billing",
    features: [
      {
        name: "Payment methods",
        tiers: {
          cloud: {
            Hobby: "n/a",
            Starter: "credit card",
            Pro: "credit card, invoice",
          },
          selfHosted: {
            "Open Source": "n/a",
            Pro: "credit card",
            Enterprise: "credit card, invoice",
          },
        },
      },
      {
        name: "Billing via AWS Marketplace",
        tiers: {
          cloud: { Hobby: "n/a", Starter: false, Pro: "Enterprise" },
          selfHosted: {
            "Open Source": "n/a",
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
        name: "Data processing agreement (GDPR)",
        tiers: {
          cloud: { Hobby: false, Starter: true, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "SOC2 Type II & ISO27001 reports",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: true },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "InfoSec reviews",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: "Enterprise" },
          selfHosted: { "Open Source": false, Pro: false, Enterprise: true },
        },
      },
      {
        name: "Customized contracts",
        tiers: {
          cloud: { Hobby: false, Starter: false, Pro: "Enterprise" },
          selfHosted: {
            "Open Source": false,
            Pro: false,
            Enterprise: "Add-on",
          },
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
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:items-stretch mb-10">
              {selectedTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    tier.featured && "border-primary",
                    "relative h-full flex flex-col"
                  )}
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="mb-7">{tier.name}</CardTitle>
                    <span className="font-bold text-5xl">
                      {tier.price}
                      {tier.price.includes("$") && (
                        <div className="text-sm leading-4 mt-2">
                          <p className="text-primary">
                            USD {tier.priceUnit ? `/ ${tier.priceUnit}` : ""} /
                            month
                          </p>
                        </div>
                      )}
                    </span>
                    <CardDescription className="text-center">
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
                  <CardContent className="flex-grow">
                    <ul className="mt-7 space-y-2.5 text-sm">
                      {tier.mainFeatures.map((feature) => (
                        <li key={feature} className="flex space-x-2">
                          <Check className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full"
                      variant={tier.featured ? "default" : "outline"}
                      asChild
                    >
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Feature comparison (up to lg) */}
            <section
              aria-labelledby="mobile-comparison-heading"
              className="lg:hidden"
            >
              <h2 id="mobile-comparison-heading" className="sr-only">
                Feature comparison
              </h2>

              <div className="mx-auto max-w-2xl space-y-16">
                {selectedTiers.map((tier) => (
                  <div key={tier.id} className="border-t">
                    <div className="mb-4">
                      <h4 className="text-xl font-medium">{tier.name}</h4>
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
                            {section.features.map((feature) => (
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
                                  {typeof feature.tiers[variant][tier.name] ===
                                  "string" ? (
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
              className="hidden lg:block"
            >
              <h2 id="comparison-heading" className="sr-only">
                Feature comparison
              </h2>

              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="w-3/12 text-primary">
                      Features
                    </TableHead>
                    {selectedTiers.map((tier) => (
                      <TableHead
                        key={tier.id}
                        className="w-2/12 text-primary text-lg font-medium text-center"
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
                        <TableCell colSpan={5} className="font-bold">
                          {section.name}
                          {section.href && <InfoLink href={section.href} />}
                        </TableCell>
                      </TableRow>
                      {section.features.map((feature) => (
                        <TableRow
                          key={feature.name}
                          className="text-muted-foreground"
                        >
                          <TableCell>
                            {feature.name}
                            {feature.href && <InfoLink href={feature.href} />}
                          </TableCell>
                          {selectedTiers.map((tier) => (
                            <TableCell key={tier.id}>
                              {typeof feature.tiers[variant][tier.name] ===
                              "string" ? (
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

            {/* Feature comparison (xs to lg) */}
            <section
              aria-labelledby="mobile-comparison-heading"
              className="lg:hidden"
            >
              <h2 id="mobile-comparison-heading" className="sr-only">
                Feature comparison
              </h2>

              <div className="mx-auto max-w-2xl space-y-16">
                {selectedTiers.map((tier) => (
                  <div key={tier.id} className="border-t border-gray-900/10">
                    <div className="mb-4">
                      <h4 className="text-xl font-medium">{tier.name}</h4>
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
                            {section.features.map((feature) => (
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
                                  {typeof feature.tiers[variant][tier.name] ===
                                  "string" ? (
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
      "You can manage your subscription through the organization settings in Langfuse Cloud or by using this <a class='underline' href='https://billing.stripe.com/p/login/6oE9BXd4u8PR2aYaEE'>Customer Portal</a> for both Langfuse Cloud and Self-Hosted subscriptions.",
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
