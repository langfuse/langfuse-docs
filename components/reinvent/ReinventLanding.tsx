"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReinventStyles } from "./styles";

const SIGN_UP_HREF = "https://cloud.langfuse.com/auth/sign-up";

const cornerBoxBase =
  "relative bg-surface-bg border border-line-structure rei-corners";

const events: {
  when: string;
  kind: string;
  title: string;
  where: string;
  href?: string;
  soon?: boolean;
}[] = [
  {
    when: "Nov 30 to Dec 3",
    kind: "Booth",
    title: "ClickHouse booth #706",
    where: "Expo floor, Venetian. Live demos all week.",
  },
  {
    when: "Tue, Dec 1, 11:20 am",
    kind: "Partners LIVE!",
    title: "AWS Partners LIVE! AI segment",
    where: "AWS Partner Zone, booth #1686-E, Venetian",
  },
  {
    when: "Tue, Dec 1, 3:00 pm",
    kind: "Breakout",
    title:
      "Open source agent observability and evals with AgentCore and Langfuse",
    where: "MGM Grand, session AIM278-S",
  },
  {
    when: "Tue, Dec 1, 9:00 pm",
    kind: "Evening",
    title: "House Party with The Chainsmokers, by ClickHouse",
    where: "Intrigue, Wynn",
    href: "https://clickhouse.com/houseparty/reinvent",
  },
  {
    when: "Wed, Dec 2 and Thu, Dec 3",
    kind: "Workshop",
    title: "Observability for AI agents: Strands, OpenTelemetry, and Langfuse",
    where:
      "OPN304. Wed 12:30 pm at Caesars Forum, Forum 101. Thu 3:00 pm at Wynn/Encore, Brahms 4.",
  },
  {
    when: "Date to be announced",
    kind: "Community",
    title: "Langfuse community run",
    where: "Las Vegas. Time and meeting point coming soon.",
    soon: true,
  },
];

const featuredIntegrations: {
  eyebrow: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  comingSoon?: boolean;
}[] = [
  {
    eyebrow: "Agents",
    title: "Strands Box",
    body: "Run a Strands agent in Box and forward the trace through your own collector.",
    comingSoon: true,
  },
  {
    eyebrow: "Agents",
    title: "Amazon Bedrock AgentCore",
    body: "Trace every model call, tool call, and agent step from agents running on AgentCore.",
    href: "/integrations/frameworks/amazon-agentcore",
    linkLabel: "AgentCore guide",
  },
  {
    eyebrow: "AI Gateway",
    title: "Bedrock in the AI Gateway",
    body: "Call Bedrock models through the Langfuse AI Gateway with your own credentials.",
    href: "/docs/gateway/get-started/admin-setup#add-provider-connections",
    linkLabel: "Add a Bedrock connection",
  },
];

const moreIntegrationGroups: {
  eyebrow: string;
  items: { label: string; href: string }[];
}[] = [
  {
    eyebrow: "Agents",
    items: [
      {
        label: "Strands Agents",
        href: "/integrations/frameworks/strands-agents",
      },
      {
        label: "Amazon Bedrock Agents",
        href: "/integrations/model-providers/amazon-bedrock-agents",
      },
    ],
  },
  {
    eyebrow: "Models",
    items: [
      {
        label: "Amazon Bedrock tracing",
        href: "/integrations/model-providers/amazon-bedrock",
      },
      {
        label: "Bedrock for Playground and LLM-as-a-judge",
        href: "/docs/administration/llm-connection",
      },
      {
        label: "Amazon SageMaker via OpenTelemetry",
        href: "/integrations/native/opentelemetry",
      },
    ],
  },
  {
    eyebrow: "Coding agents",
    items: [
      { label: "Kiro IDE", href: "/integrations/developer-tools/kiro" },
      { label: "Kiro CLI", href: "/integrations/developer-tools/kiro-cli" },
    ],
  },
  {
    eyebrow: "Data",
    items: [
      {
        label: "Export to Amazon S3",
        href: "/docs/api-and-data-platform/features/export-to-blob-storage",
      },
      {
        label: "External S3 media",
        href: "/docs/observability/features/multi-modality#external-s3-media",
      },
    ],
  },
];

const deployItems: { label: string; href: string }[] = [
  {
    label: "Self-host on AWS with Terraform",
    href: "/self-hosting/deployment/aws",
  },
  {
    label: "Amazon S3 with AWS KMS encryption",
    href: "/self-hosting/deployment/infrastructure/blobstorage#using-aws-kms-encryption",
  },
  {
    label: "Code evaluators on AWS Lambda",
    href: "/self-hosting/configuration/code-evaluators",
  },
  {
    label: "Halo with Amazon Bedrock",
    href: "/self-hosting/configuration/halo#configure-the-model",
  },
  {
    label: "Sign in with AWS Cognito",
    href: "/self-hosting/security/authentication-and-sso",
  },
];

function Ctas() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        href={SIGN_UP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        size="default"
        wrapperClassName="w-fit"
      >
        Get 90% off Langfuse Cloud ↗
      </Button>
    </div>
  );
}

function GuideLinks({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="m-0 flex list-none flex-col items-start gap-2.5 p-0">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="border-b border-text-primary pb-px font-mono text-[12px] leading-snug text-text-primary"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul className="rei-feature-list">
      {items.map((item) => (
        <li key={item.href}>
          <Link className="rei-link" href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Hero() {
  return (
    <section className="rei-section pb-5 pt-10">
      <div
        className={`${cornerBoxBase} no-bl no-br flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-7 sm:py-7`}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <div className="rei-eyebrow">Las Vegas, Nov 30 to Dec 4, 2026</div>
          <p className="rei-masthead">
            Langfuse at <span className="rei-highlight">AWS re:Invent</span>
          </p>
        </div>
        <p className="rei-body-sm max-w-[38ch] text-pretty sm:text-right">
          Open source observability and evaluations for AI agents built on AWS.
        </p>
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr no-bl no-br relative -mb-px -mt-px grid items-center gap-10 px-5 py-12 sm:px-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 md:py-[64px]`}
      >
        <div
          aria-hidden
          className="rei-blueprint pointer-events-none absolute inset-0 opacity-80"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
          }}
        />

        <div className="relative flex flex-col gap-5">
          <h1 className="rei-h1">
            Ship reliable AI agents on AWS.
            <br />
            <span className="rei-highlight">Get 90% off Langfuse Cloud.</span>
          </h1>
          <p className="rei-body" style={{ fontSize: 17, maxWidth: "42ch" }}>
            Trace, evaluate, and debug the agents you build on AWS. For
            re:Invent, get{" "}
            <b className="font-medium text-text-primary">
              90% off the Core plan base fee for your first 12 months
            </b>
            .
          </p>
          <Ctas />
        </div>

        <HeroArt />
      </div>

      <div
        className={`${cornerBoxBase} rei-accent-top no-tl no-tr relative -mt-px flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7`}
      >
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="rei-pill is-accent w-fit">Find us</span>
          <div className="min-w-0">
            <div className="text-[14px] font-medium leading-[1.4] text-text-primary">
              ClickHouse booth #706, Venetian expo floor
            </div>
            <p className="rei-body-sm">
              Live demos of tracing and evaluations for agents on AWS, Nov 30 to
              Dec 3.
            </p>
          </div>
        </div>
        <Link
          href="#events"
          className="self-start whitespace-nowrap border-b border-text-primary pb-px font-mono text-[12px] text-text-primary sm:self-center"
        >
          See the schedule
        </Link>
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div
      className={`${cornerBoxBase} relative mx-auto flex w-full max-w-[340px] flex-col items-center justify-center gap-6 px-8 py-10 md:aspect-[4/5] md:gap-10 md:py-0`}
    >
      <img
        src="/images/reinvent/langfuse-logo.svg"
        alt="Langfuse by ClickHouse"
        width={2255}
        height={600}
        className="h-auto w-full max-w-[240px]"
      />
      <div
        aria-hidden
        className="font-analog text-[44px] font-medium leading-none text-text-tertiary"
      >
        ×
      </div>
      <img
        src="/images/reinvent/aws-logo.svg"
        alt="AWS"
        width={304}
        height={182}
        className="h-auto w-[130px] md:w-[150px]"
      />
    </div>
  );
}

function Events() {
  return (
    <section id="events" className="rei-section scroll-mt-24 pb-10 pt-[100px]">
      <div className="mb-10 flex flex-col items-start gap-3.5">
        <div className="rei-eyebrow">Schedule, Pacific Time</div>
        <h2 className="rei-h2 max-w-[22ch]">
          Meet Langfuse <span className="rei-highlight">in Las Vegas.</span>
        </h2>
        <p className="rei-body">
          Find us on the expo floor, on stage, in the AWS workshop, and out in
          the evening.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {events.map((event, i) => (
          <div
            key={event.title}
            className={`rei-chip-card flex flex-col gap-3 p-6${
              event.soon ? " rei-accent-top" : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rei-eyebrow">
                {String(i + 1).padStart(2, "0")} {event.kind}
              </span>
              <span className={`rei-pill${event.soon ? " is-accent" : ""}`}>
                {event.when}
              </span>
            </div>
            <div className="font-analog text-[22px] font-medium leading-[1.3] text-text-primary [text-wrap:balance]">
              {event.title}
            </div>
            <p className="rei-body-sm">{event.where}</p>
            {event.href ? (
              <>
                <div className="flex-1" />
                <Link
                  href={event.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start border-b border-text-primary pb-px font-mono text-[12px] text-text-primary"
                >
                  Request a ticket ↗
                </Link>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section
      id="integrations"
      className="rei-section scroll-mt-24 pb-10 pt-[100px]"
    >
      <div className="mb-10 flex flex-col items-start gap-3.5">
        <div className="rei-eyebrow">AWS integrations</div>
        <h2 className="rei-h2 max-w-[24ch]">
          Langfuse works with{" "}
          <span className="rei-highlight">the AWS stack you use.</span>
        </h2>
        <p className="rei-body">
          Start with Strands Box, Bedrock AgentCore, and Bedrock in the AI
          Gateway.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {featuredIntegrations.map((item) => (
          <div
            key={item.title}
            className="rei-chip-card rei-accent-top flex h-full flex-col gap-3.5 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rei-eyebrow">{item.eyebrow}</span>
              {item.comingSoon ? (
                <span className="rei-pill is-accent">Coming soon</span>
              ) : null}
            </div>
            <div className="font-analog text-[22px] font-medium leading-[1.3] text-text-primary [text-wrap:balance]">
              {item.title}
            </div>
            <p className="rei-body-sm">{item.body}</p>
            {item.href && item.linkLabel ? (
              <Link
                href={item.href}
                className="mt-auto self-start border-b border-text-primary pb-px font-mono text-[12px] text-text-primary"
              >
                {item.linkLabel}
              </Link>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rei-chip-card mt-2 flex flex-col gap-5 p-6">
        <div className="rei-eyebrow">More AWS guides</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
          {moreIntegrationGroups.map((group) => (
            <div key={group.eyebrow} className="flex min-w-0 flex-col gap-2.5">
              <div className="rei-eyebrow">{group.eyebrow}</div>
              <GuideLinks items={group.items} />
            </div>
          ))}
        </div>
      </div>

      <RunOnAws />
    </section>
  );
}

function RunOnAws() {
  return (
    <div id="deploy" className="mt-2 scroll-mt-24">
      <div className="grid items-stretch gap-2 md:grid-cols-[1fr_1.5fr]">
        <div
          className={`${cornerBoxBase} relative flex flex-col gap-5 overflow-hidden p-7`}
        >
          <div
            aria-hidden
            className="rei-grid-bg pointer-events-none absolute inset-0 opacity-60"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent 75%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 75%)",
            }}
          />
          <div className="relative flex flex-col gap-3.5">
            <div className="rei-eyebrow">Cloud or self-hosted</div>
            <h2
              className="rei-h2 max-w-[16ch]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              Run Langfuse on AWS.
            </h2>
            <p className="rei-body-sm max-w-[40ch]">
              Langfuse Cloud runs on AWS in the US, EU, Japan, and HIPAA data
              regions. Or deploy Langfuse in your own AWS account.
            </p>
          </div>
          <Link
            href="/security/data-regions"
            className="relative mt-auto self-start border-b border-text-primary pb-px font-mono text-[12px] text-text-primary"
          >
            Data regions ↗
          </Link>
        </div>

        <div className="rei-chip-card flex flex-col gap-3.5 p-6">
          <div className="rei-eyebrow">Self-hosting</div>
          <div className="font-analog text-[22px] font-medium leading-[1.3] text-text-primary [text-wrap:balance]">
            Deploy in your own AWS account
          </div>
          <p className="rei-body-sm">
            The official Terraform module deploys Langfuse to EKS with Aurora
            PostgreSQL, ElastiCache, S3, and ClickHouse.
          </p>
          <LinkList items={deployItems} />
        </div>
      </div>
    </div>
  );
}

function CTABanner() {
  return (
    <section className="rei-section pb-15 pt-[80px]">
      <div
        className={`${cornerBoxBase} rei-stripes-bg flex flex-col items-center gap-[22px] px-8 py-[72px] text-center`}
      >
        <div className="rei-eyebrow">Langfuse at AWS re:Invent</div>
        <h2 className="rei-h2 max-w-[24ch]">
          Ship reliable AI agents on AWS,{" "}
          <span className="rei-highlight">get 90% off Langfuse Cloud.</span>
        </h2>
        <p className="rei-body text-center">
          90% off the Core plan base fee for your first 12 months.
        </p>
        <Ctas />
      </div>
    </section>
  );
}

export function ReinventLanding() {
  return (
    <div className="rei-page">
      <ReinventStyles />
      <div className="mx-auto max-w-[1000px]">
        <Hero />
        <Events />
        <Integrations />
        <CTABanner />
      </div>
    </div>
  );
}
