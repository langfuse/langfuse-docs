"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Input } from "@/components/ui/input";
import { wordmarkDisplaySize } from "@/components/shared/wordmark";
import canvaLogo from "@/components/home/img/canva.svg";
import intuitLogo from "@/components/home/img/intuit.svg";
import khanLogo from "@/components/home/img/khan.svg";
import merckLogo from "@/components/home/img/merck.svg";
import rampLogo from "@/components/home/img/ramp.svg";
import twilioLogo from "@/components/home/img/twilio.svg";
import { IndiaStyles } from "./styles";

const INDIA_TALK_TO_US_HREF =
  "/talk-to-us?utm_source=india-landing&utm_campaign=india-cloud";

const AGENT_PROMPT = `# Paste directly into your coding agent:
Add Langfuse tracing to this app.
Configure LANGFUSE_BASE_URL via environment variables so we can switch regions when Langfuse Cloud India launches in early 2027.

# Reference context:
https://langfuse.com/llms.txt
https://github.com/langfuse/skills`;

const ENV_SNIPPET = `LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_SECRET_KEY="sk-lf-..."
# Point to your self-hosted Mumbai VPC or EU/US Cloud now,
# then switch to the Mumbai Cloud URL at launch:
LANGFUSE_BASE_URL="https://<your-langfuse-host>"`;

const CUSTOMER_LOGOS: ReadonlyArray<{
  name: string;
  logo: StaticImageData;
  href?: string;
}> = [
  { name: "Canva", logo: canvaLogo, href: "/users/canva" },
  { name: "Ramp", logo: rampLogo, href: "/users/ramp" },
  { name: "Merck", logo: merckLogo, href: "/users/merckgroup" },
  { name: "Khan Academy", logo: khanLogo, href: "/users/khan-academy" },
  { name: "Intuit", logo: intuitLogo },
  { name: "Twilio", logo: twilioLogo },
];

function CodeBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in restricted contexts.
    }
  };

  return (
    <div className="india-code-box rounded-[2px] font-mono text-[11px] leading-[1.65] overflow-hidden">
      <div className="india-code-header flex items-center justify-between px-3 py-1.5">
        <span className="font-mono text-[11px] india-code-comment">.env</span>
        <button
          type="button"
          onClick={onCopy}
          className="px-1.5 py-0.5 bg-transparent border-0 india-code-comment hover:text-surface-bg dark:hover:text-text-primary font-mono text-[11px] cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-3 overflow-auto">
        <div className="india-code-key">LANGFUSE_PUBLIC_KEY</div>
        <div>
          {"  = "}
          <span className="india-code-val">&quot;pk-lf-...&quot;</span>
        </div>
        <div className="india-code-key">LANGFUSE_SECRET_KEY</div>
        <div>
          {"  = "}
          <span className="india-code-val">&quot;sk-lf-...&quot;</span>
        </div>
        <div className="india-code-comment mt-1">
          # Switch to Mumbai Cloud at launch
        </div>
        <div className="india-code-key">LANGFUSE_BASE_URL</div>
        <div>
          {"  = "}
          <span className="india-code-url">
            &quot;https://&lt;your-langfuse-host&gt;&quot;
          </span>
        </div>
      </div>
    </div>
  );
}

function AgentPromptBox() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in restricted contexts.
    }
  };

  return (
    <CornerBox className="india-code-box !bg-surface-code !border-line-code-border p-0 overflow-hidden">
      <div className="india-code-header flex items-center">
        <div className="px-3.5 py-2.5 font-mono text-[11px] border-r border-line-code-border bg-surface-code">
          prompt.txt
        </div>
        <div className="flex-1 border-r border-line-code-border self-stretch" />
        <button
          type="button"
          onClick={onCopy}
          className="px-3 py-2 bg-transparent border-0 india-code-comment hover:text-surface-bg dark:hover:text-text-primary font-mono text-[11px] cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 p-5 font-mono text-[12.5px] leading-[1.75] whitespace-pre-wrap">
        <span className="india-code-comment">
          # Paste directly into your coding agent:
        </span>
        {"\n"}
        Add Langfuse tracing to this app.{"\n"}
        Configure <span className="india-code-key">LANGFUSE_BASE_URL</span> via
        environment variables so we can switch regions when Langfuse Cloud India
        launches in early 2027.
        {"\n\n"}
        <span className="india-code-comment"># Reference context:</span>
        {"\n"}
        <span className="india-code-link">https://langfuse.com/llms.txt</span>
        {"\n"}
        <span className="india-code-link">
          https://github.com/langfuse/skills
        </span>
      </pre>
    </CornerBox>
  );
}

function Hero() {
  return (
    <section className="india-section pt-10 pb-5">
      <CornerBox
        corners={{ tl: true, tr: true, bl: false, br: false }}
        className="flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2 px-5 py-[10px] text-[13px] text-text-secondary text-center"
      >
        <span className="font-mono text-[12px] text-text-tertiary sm:whitespace-nowrap">
          Coming early 2027
        </span>
        <span className="india-dot hidden sm:inline-block" aria-hidden />
        <span className="sm:whitespace-nowrap">
          Hosted in{" "}
          <b className="text-text-primary font-medium">Mumbai (ap-south-1)</b>
        </span>
        <span className="india-dot hidden sm:inline-block" aria-hidden />
        <span>AWS and ClickHouse Cloud, customer data stays in India</span>
        <span className="india-dot hidden sm:inline-block" aria-hidden />
        <Link
          href="#waitlist"
          className="font-mono text-[12px] text-text-primary border-b border-line-cta whitespace-nowrap"
        >
          Waitlist open
        </Link>
      </CornerBox>

      <div className="relative bg-surface-bg border border-line-structure overflow-hidden grid gap-12 items-center px-5 sm:px-8 py-16 md:py-[88px] -mt-px -mb-px lg:grid-cols-[1.3fr_1fr]">
        <div
          aria-hidden
          className="india-grid-bg absolute inset-0 opacity-90 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 75% 85% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 85% at 50% 50%, black, transparent)",
          }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="india-eyebrow">
            Langfuse Cloud: ap-south-1 (Mumbai)
          </div>
          <h1 className="india-h1">
            Langfuse Cloud,
            <br />
            coming to <span className="india-highlight">India.</span>
          </h1>
          <p className="india-body text-[17px] max-w-[46ch]">
            LLM tracing, prompt management, evaluations, and metrics hosted on{" "}
            <b className="text-text-primary font-medium">
              AWS and ClickHouse Cloud in Mumbai
            </b>
            . Built for teams that need customer data to stay in India,
            launching in early 2027.
          </p>
          <p className="font-analog italic text-[15px] text-text-tertiary m-0 -tracking-[0.005em]">
            Register for the waitlist for launch updates and early access, or
            talk to our India team today.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="default" href="#waitlist">
              Register for waitlist
            </Button>
            <Button
              variant="secondary"
              size="default"
              href={INDIA_TALK_TO_US_HREF}
            >
              Talk to our India team
            </Button>
          </div>
        </div>

        <HeroArt />
      </div>

      <CornerBox
        corners={{ tl: false, tr: false, bl: true, br: true }}
        className="india-fact-grid grid grid-cols-2 md:grid-cols-4"
      >
        {[
          ["Launching early 2027", "Waitlist open now"],
          ["AWS & ClickHouse Cloud", "Hosted in Mumbai (ap-south-1)"],
          ["Enterprise ready", "SOC 2 Type II, ISO 27001"],
          ["Open source core", "MIT, self-host in India today"],
        ].map(([top, bot]) => (
          <div key={top} className="flex flex-col gap-1 px-5 py-[22px]">
            <span className="text-[13px] font-medium text-text-primary leading-[1.4]">
              {top}
            </span>
            <span className="font-mono text-[12px] text-text-tertiary">
              {bot}
            </span>
          </div>
        ))}
      </CornerBox>
    </section>
  );
}

function HeroArt() {
  const cards: ReadonlyArray<{
    emoji: string;
    label: string;
    rot: number;
    x: number;
    y: number;
    z: number;
  }> = [
    { emoji: "🇮🇳", label: "India residency", rot: -9, x: 0, y: 32, z: 1 },
    { emoji: "🏙️", label: "Mumbai", rot: 8, x: 145, y: 10, z: 3 },
    { emoji: "☁️", label: "ap-south-1", rot: -4, x: 195, y: 170, z: 2 },
    { emoji: "🗓️", label: "Early 2027", rot: 9, x: 35, y: 200, z: 1 },
  ];

  return (
    <div
      className="relative h-[380px] w-full max-w-[360px] mx-auto hidden lg:block"
      aria-hidden
    >
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 opacity-[.45] pointer-events-none"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="var(--line-structure)"
          strokeDasharray="2 4"
        />
        <text
          x="200"
          y="202"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--text-tertiary)"
          letterSpacing="0.5"
        >
          ap-south-1
        </text>
      </svg>
      {cards.map((c) => (
        <div
          key={c.label}
          className="absolute w-[140px] bg-surface-bg p-2.5 border border-line-structure india-card-shadow"
          style={{
            left: c.x,
            top: c.y,
            zIndex: c.z,
            transform: `rotate(${c.rot}deg)`,
          }}
        >
          <div className="aspect-square flex items-center justify-center bg-surface-1 text-[58px] leading-none">
            {c.emoji}
          </div>
          <div className="mt-2 font-mono text-[11px] text-text-tertiary text-center">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/productUpdateSignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "india-cloud-waitlist",
          list: "product",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setStatus("error");
        setErrorMessage(
          data.error === "Invalid email address"
            ? "Please enter a valid work email address."
            : "We could not register your email right now. Please try again or talk to our India team.",
        );
        return;
      }

      try {
        posthog.capture("india_cloud_waitlist:submitted", {
          source: "india-landing",
        });
      } catch {
        // Analytics must not block form confirmation.
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not register your email right now. Please try again or talk to our India team.",
      );
    }
  }

  return (
    <section id="waitlist" className="india-section pt-12 pb-10 scroll-mt-24">
      <CornerBox className="grid gap-10 items-center px-6 sm:px-8 py-9 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="india-eyebrow">Early 2027 waitlist</div>
          <h2
            className="india-h2 max-w-[22ch]"
            style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}
          >
            Register for the India region waitlist.
          </h2>
          <p className="india-body-sm m-0 max-w-[52ch]">
            Leave your work email to receive launch updates and early access
            invitations as Langfuse Cloud India opens in Mumbai.
          </p>

          {status === "success" ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-1 px-4 py-3.5 rounded-[2px] border border-line-cta bg-surface-1 flex items-start gap-3 max-w-lg"
            >
              <span
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: "var(--callout-success)" }}
                aria-hidden
              />
              <div className="text-[13.5px] text-text-primary leading-[1.6]">
                <span className="font-medium">
                  You&apos;re on the waitlist.
                </span>{" "}
                We&apos;ll notify you as Langfuse Cloud India approaches launch
                in early 2027. Need a closer timeline?{" "}
                <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
                  Talk to our India team
                </Link>
                .
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 max-w-lg"
              noValidate={false}
            >
              <label htmlFor="india-waitlist-email" className="sr-only">
                Work email
              </label>
              <Input
                id="india-waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setErrorMessage("");
                  }
                }}
                className="flex-1 min-w-0 h-8 bg-surface-bg dark:border-line-cta"
              />
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={status === "submitting"}
                wrapperClassName="w-fit shrink-0"
              >
                {status === "submitting"
                  ? "Registering..."
                  : "Register for waitlist"}
              </Button>
            </form>
          )}

          {status === "error" && errorMessage && (
            <p
              role="alert"
              className="m-0 text-[13px] text-destructive leading-[1.6]"
            >
              {errorMessage}{" "}
              <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
                Talk to our India team
              </Link>
              .
            </p>
          )}

          <p className="m-0 text-[12.5px] text-text-tertiary">
            Planning an enterprise rollout or security review?{" "}
            <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
              Talk to our India team
            </Link>
            .
          </p>
        </div>

        <div className="bg-surface-1 border border-line-structure rounded-[2px] p-6 flex flex-col gap-3">
          <div className="india-eyebrow">Launch summary</div>
          <dl className="m-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Target launch", "Early 2027"],
              ["Cloud region", "Mumbai (ap-south-1)"],
              ["Infrastructure", "AWS & ClickHouse Cloud"],
              ["Data residency", "Stays in India"],
            ].map(([term, desc]) => (
              <div
                key={term}
                className="px-3.5 py-3 bg-surface-bg border border-line-structure rounded-[2px]"
              >
                <dt className="font-mono text-[11px] text-text-tertiary mb-1">
                  {term}
                </dt>
                <dd className="m-0 text-[13.5px] font-medium text-text-primary leading-[1.4]">
                  {desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </CornerBox>
    </section>
  );
}

function WhyIndia() {
  const pillars = [
    {
      index: "01",
      eyebrow: "Data residency",
      title: "Customer data stays in India.",
      body: "Traces, prompts, evaluations, datasets, and media are hosted in Mumbai on AWS (ap-south-1) and ClickHouse Cloud, with disaster-recovery backups kept inside India.",
      visual: "region" as const,
    },
    {
      index: "02",
      eyebrow: "Full feature parity",
      title: "No compromises on capabilities.",
      body: "The same Langfuse Cloud platform used worldwide: observability, prompt management, LLM-as-a-judge evaluations, Playground, experiments, and datasets.",
      visual: "parity" as const,
    },
    {
      index: "03",
      eyebrow: "Enterprise ready",
      title: "Built for regulated teams from day one.",
      body: "SOC 2 Type II, ISO 27001, and GDPR-aligned controls, with a standard DPA and publicly documented subprocessors so security reviews move quickly.",
      visual: "compliance" as const,
    },
  ];

  return (
    <section className="india-section pt-[100px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="india-eyebrow">Why Langfuse Cloud India</div>
        <h2 className="india-h2 max-w-[26ch]">
          The AI engineering platform for teams building in{" "}
          <span className="india-highlight">India.</span>
        </h2>
        <p className="india-body max-w-[58ch]">
          Langfuse is the open-source platform for tracing, evaluating, and
          improving production LLM and agent applications. Langfuse Cloud India
          brings that managed platform to Mumbai so customer data stays in
          India.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.eyebrow}
            className="india-chip-card flex flex-col min-h-[500px]"
          >
            <div className="px-5 pt-5 pb-3.5">
              <div className="flex items-baseline justify-between mb-2.5">
                <div className="india-eyebrow">{p.eyebrow}</div>
                <div className="font-analog text-[30px] text-text-disabled leading-none">
                  {p.index}
                </div>
              </div>
              <div className="font-analog text-[20px] leading-[1.35] text-text-primary font-medium mb-2.5 [text-wrap:balance]">
                {p.title}
              </div>
              <div className="text-[13px] text-text-tertiary leading-[1.75] [text-wrap:pretty]">
                {p.body}
              </div>
            </div>
            <div className="flex-1 border-t border-line-structure bg-surface-bg flex flex-col">
              <PillarVisual kind={p.visual} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PillarVisual({ kind }: { kind: "region" | "parity" | "compliance" }) {
  if (kind === "region") {
    const rows: ReadonlyArray<{
      region: string;
      city: string;
      status: string;
      highlighted: boolean;
    }> = [
      {
        region: "ap-south-1",
        city: "Mumbai",
        status: "Early 2027",
        highlighted: true,
      },
      {
        region: "ap-northeast-1",
        city: "Tokyo",
        status: "Live",
        highlighted: false,
      },
      {
        region: "eu-west-1",
        city: "Ireland",
        status: "Live",
        highlighted: false,
      },
      {
        region: "us-west-2",
        city: "Oregon",
        status: "Live",
        highlighted: false,
      },
    ];

    return (
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div
              key={row.region}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-[2px]"
              style={{
                background: row.highlighted
                  ? "var(--surface-cta-primary)"
                  : "transparent",
                border: `1px solid ${row.highlighted ? "var(--line-cta)" : "var(--line-structure)"}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: row.highlighted
                    ? "var(--callout-success)"
                    : "var(--text-disabled)",
                }}
              />
              <span className="font-mono text-[11px] text-text-primary flex-1">
                {row.region}
              </span>
              <span className="text-[11px] text-text-secondary">
                {row.city}
              </span>
              <span className="font-mono text-[10px] text-text-tertiary">
                {row.status}
              </span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[11px] text-text-tertiary text-right">
          Upcoming region: Mumbai (ap-south-1)
        </div>
      </div>
    );
  }

  if (kind === "parity") {
    const feats = [
      "Traces",
      "Sessions",
      "Users",
      "Prompt management",
      "Versioning",
      "Playground",
      "Evaluations",
      "LLM-as-a-judge",
      "Experiments",
      "Datasets",
      "Metrics",
      "Alerts",
      "Annotation queues",
      "API keys",
      "SSO",
    ];
    return (
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 content-start">
          {feats.map((f) => (
            <span
              key={f}
              className="px-2 py-1 border border-line-structure bg-surface-1 rounded-[2px] font-mono text-[10.5px] text-text-secondary inline-flex items-center gap-1"
            >
              <span style={{ color: "var(--callout-success)" }}>✓</span>
              {f}
            </span>
          ))}
        </div>
        <div className="font-mono text-[11px] text-text-tertiary">
          + Full parity with global Langfuse Cloud
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-5 py-5 flex flex-col gap-2.5 justify-center">
      {[
        ["SOC 2 Type II", "Audited annually"],
        ["ISO 27001", "Certified"],
        ["GDPR & DPA", "Standard addendum available"],
        ["Subprocessors", "Publicly documented"],
      ].map(([title, sub]) => (
        <div
          key={title}
          className="flex items-center gap-3 px-3 py-2.5 border border-line-structure rounded-[2px] bg-surface-1"
        >
          <Seal />
          <div className="flex-1">
            <div className="text-[12px] text-text-primary font-medium leading-[1.4]">
              {title}
            </div>
            <div className="text-[11px] text-text-tertiary font-mono leading-[1.5] mt-0.5">
              {sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Seal() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--line-cta)"
        strokeWidth="1"
        fill="var(--surface-bg)"
      />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="var(--line-cta)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function GetStarted() {
  type Step = {
    n: string;
    title: string;
    body: string;
    action?: [string, string];
    code?: boolean;
  };
  const steps: Step[] = [
    {
      n: "01",
      title: "Register for the waitlist",
      body: "Reserve your spot for the early 2027 Mumbai launch, or connect with our India team to discuss timeline, security questionnaires, and early access.",
      action: ["Join the waitlist", "#waitlist"],
    },
    {
      n: "02",
      title: "Instrument your app today",
      body: "Start now on EU/US Cloud or self-host MIT open-source Langfuse in your own AWS Mumbai VPC. Every SDK reads one base URL environment variable.",
      code: true,
    },
    {
      n: "03",
      title: "Switch to Mumbai at launch",
      body: "When Langfuse Cloud India opens, export your prompts, datasets, and traces, import them into your Mumbai project, and update LANGFUSE_BASE_URL.",
      action: [
        "View migration cookbook",
        "/guides/cookbook/example_data_migration",
      ],
    },
  ];

  return (
    <section
      id="get-started"
      className="india-section pt-[110px] pb-10 scroll-mt-24"
    >
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="india-eyebrow">Get started before launch</div>
        <h2 className="india-h2 max-w-[26ch]">
          Ready for Mumbai in{" "}
          <span className="india-highlight">three steps.</span>
        </h2>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="india-chip-card p-6 flex flex-col gap-3.5 min-h-[280px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="india-step-num">{s.n}</span>
            </div>
            <div className="font-analog text-[22px] leading-[1.3] text-text-primary font-medium">
              {s.title}
            </div>
            <p className="m-0 text-[13.5px] text-text-tertiary leading-[1.75]">
              {s.body}
            </p>
            <div className="flex-1" />
            {s.action && (
              <Link
                href={s.action[1]}
                className="font-mono text-[12px] text-text-primary border-b border-text-primary self-start pb-px"
              >
                {s.action[0]} ↗
              </Link>
            )}
            {s.code && <CodeBox value={ENV_SNIPPET} />}
          </div>
        ))}
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-[1fr_1.4fr]">
        <div className="india-chip-card p-6 flex flex-col">
          <div className="india-eyebrow mb-3">AI coding agents</div>
          <div className="font-analog text-[22px] leading-[1.35] text-text-primary font-medium mb-2.5">
            Let your coding agent wire up tracing.
          </div>
          <p className="india-body-sm m-0">
            We publish the official Langfuse agent skill and{" "}
            <span className="india-code-inline">llms.txt</span> context so
            Claude Code, Cursor, and GitHub Copilot instrument your stack
            cleanly on the first pass.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <Link
              className="india-code-inline"
              href="https://github.com/langfuse/skills"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/langfuse/skills
            </Link>
            <Link className="india-code-inline" href="/llms.txt">
              langfuse.com/llms.txt
            </Link>
          </div>
        </div>

        <AgentPromptBox />
      </div>
    </section>
  );
}

function Customers() {
  return (
    <section className="india-section pt-[110px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="india-eyebrow">Customers</div>
        <h2 className="india-h2 max-w-[28ch]">
          Trusted in production by{" "}
          <span className="india-highlight">AI teams</span> worldwide.
        </h2>
      </div>

      <CornerBox className="india-logo-grid grid grid-cols-3 md:grid-cols-6 mb-4">
        {CUSTOMER_LOGOS.map((c) => {
          const { width, height } = wordmarkDisplaySize(c.logo, 52);
          const content = (
            <Image
              src={c.logo}
              alt={`${c.name} logo`}
              width={c.logo.width}
              height={c.logo.height}
              unoptimized
              className="h-auto w-auto max-w-full opacity-85"
              style={{ width, height }}
            />
          );

          return (
            <div
              key={c.name}
              className="px-4 py-9 flex items-center justify-center"
            >
              {c.href ? (
                <Link
                  href={c.href}
                  aria-label={`Read ${c.name} customer story`}
                  className="flex items-center justify-center hover:opacity-100 transition-opacity"
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </CornerBox>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="india-chip-card flex flex-col gap-4 p-7 bg-surface-1">
          <div className="india-eyebrow">Customer story</div>
          <div className="font-analog text-[23px] leading-[1.45] text-text-primary font-medium [text-wrap:balance]">
            &ldquo;Langfuse enables us to track every prompt, response, cost,
            and latency in real time, turning black-box models into auditable,
            optimizable assets.&rdquo;
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-3 mt-auto border-t border-line-structure">
            <div className="w-9 h-9 rounded-full bg-text-primary text-surface-bg flex items-center justify-center font-analog text-[16px] shrink-0">
              M
            </div>
            <div className="flex-1 min-w-[180px]">
              <div className="text-[13.5px] text-text-primary font-medium">
                Walid Mehanna, Chief Data &amp; AI Officer at Merck
              </div>
              <div className="text-[12px] text-text-tertiary font-mono">
                80+ AI project teams on Langfuse
              </div>
            </div>
            <Button variant="secondary" size="small" href="/users/merckgroup">
              Read customer story
            </Button>
          </div>
        </div>

        <div className="india-chip-card flex flex-col gap-3 p-7">
          <div className="india-eyebrow">India team</div>
          <div className="font-analog text-[24px] leading-[1.3] text-text-primary font-medium">
            Talk to our India team
          </div>
          <p className="india-body-sm m-0">
            Work directly with our local team supporting AI engineering
            organizations across Bengaluru, Mumbai, and across India. Reach out
            for early access, architecture reviews, or self-hosted deployments
            ahead of launch.
          </p>
          <div className="flex-1" />
          <div className="flex flex-wrap gap-1.5">
            <span className="india-code-inline">Early access</span>
            <span className="india-code-inline">Architecture review</span>
            <span className="india-code-inline">Enterprise terms</span>
          </div>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="small"
              href={INDIA_TALK_TO_US_HREF}
            >
              Talk to our India team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Compliance() {
  return (
    <section className="india-section pt-[110px] pb-10">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr] items-stretch">
        <CornerBox className="p-7 relative overflow-hidden flex flex-col gap-5">
          <div
            aria-hidden
            className="india-grid-bg absolute inset-0 opacity-60 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent 70%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col gap-3.5">
            <div className="india-eyebrow">Compliance overview</div>
            <h2
              className="india-h2 max-w-[16ch]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              Customer data stays in India.
            </h2>
            <p className="india-body-sm max-w-[40ch]">
              Traces, prompts, evaluations, datasets, and media are stored in
              Mumbai on AWS and ClickHouse Cloud. Postgres backups stay inside
              India.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-2">
            <DataFact label="Infrastructure" value="AWS" />
            <DataFact label="Database" value="ClickHouse" />
            <DataFact label="AWS region" value="ap-south-1" />
            <DataFact label="City" value="Mumbai" />
          </div>
          <div className="relative flex flex-wrap gap-1 mt-auto pt-1">
            <Button
              variant="secondary"
              size="small"
              href="/security/data-regions"
            >
              Data regions docs
            </Button>
            <Button variant="secondary" size="small" href="/security">
              Security overview
            </Button>
            <Button variant="secondary" size="small" href="/dpa">
              DPA
            </Button>
          </div>
        </CornerBox>

        <div className="flex flex-col gap-4">
          <div className="india-chip-card p-0 overflow-hidden">
            <div className="px-4 py-3.5 flex items-baseline justify-between border-b border-line-structure gap-2">
              <span className="font-analog text-[18px] text-text-primary font-medium">
                Primary subprocessors
              </span>
              <span className="india-eyebrow">In-region: India</span>
            </div>
            <div className="overflow-x-auto">
              <table className="india-table">
                <thead>
                  <tr>
                    <th>Subprocessor</th>
                    <th>Role</th>
                    <th>Data location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AWS</td>
                    <td>Application infrastructure &amp; backups</td>
                    <td>
                      <RegionPill where="Mumbai, India" good />
                    </td>
                  </tr>
                  <tr>
                    <td>ClickHouse Cloud</td>
                    <td>Analytical database (traces &amp; scores)</td>
                    <td>
                      <RegionPill where="Mumbai, India" good />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="india-chip-card p-6 flex flex-col gap-3 flex-1 justify-between">
            <div className="flex flex-col gap-2">
              <div className="india-eyebrow">Need Indian residency today?</div>
              <div className="font-analog text-[20px] leading-[1.35] text-text-primary font-medium">
                Self-host in AWS Mumbai (ap-south-1) now.
              </div>
              <p className="india-body-sm m-0 max-w-[60ch]">
                Langfuse&apos;s core is MIT-licensed open source. Deploy in your
                own AWS Mumbai VPC today using our Terraform module or Helm
                chart, then stay self-hosted or migrate to Langfuse Cloud India
                when it launches in early 2027.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              <Button
                variant="secondary"
                size="small"
                href="/self-hosting/deployment/aws"
              >
                AWS Terraform guide
              </Button>
              <Button variant="secondary" size="small" href="/self-hosting">
                Self-hosting docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DataFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3.5 bg-surface-1 border border-line-structure rounded-[2px]">
      <div className="india-eyebrow mb-1.5">{label}</div>
      <div className="font-analog text-[22px] text-text-primary font-medium leading-none">
        {value}
      </div>
    </div>
  );
}

function RegionPill({ where, good }: { where: string; good?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border border-line-structure font-mono text-[11px] text-text-primary whitespace-nowrap"
      style={{
        background: good ? "var(--surface-cta-primary)" : "var(--surface-1)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{
          background: good ? "var(--callout-success)" : "var(--text-disabled)",
        }}
      />
      {where}
    </span>
  );
}

function Migration() {
  const steps = [
    "Create a project in the Mumbai region once launched",
    "Export prompts, datasets, and traces from your current setup",
    "Import your exported data into the India project",
    "Point LANGFUSE_BASE_URL to the India region",
  ];

  return (
    <section className="india-section pt-20 pb-10">
      <CornerBox className="grid gap-10 items-center px-6 sm:px-8 py-9 md:grid-cols-[1fr_1.3fr]">
        <div>
          <div className="india-eyebrow mb-2.5">Migration</div>
          <h2
            className="india-h2 max-w-[20ch] mb-3.5"
            style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
          >
            Already using Langfuse? Move to Mumbai in 4 steps.
          </h2>
          <p className="india-body-sm m-0 max-w-[44ch]">
            Start on EU or US Cloud or self-host in your own infrastructure
            today. Moving to Langfuse Cloud India at launch is export, import,
            and a single base URL change.
          </p>
          <div className="mt-4">
            <Button
              variant="primary"
              size="small"
              href="/guides/cookbook/example_data_migration"
            >
              Data migration cookbook
            </Button>
          </div>
        </div>

        <ol className="list-none p-0 m-0 grid gap-2 grid-cols-1 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li
              key={s}
              className="px-4 py-4 bg-surface-1 border border-line-structure rounded-[2px] flex gap-3 items-start"
            >
              <span className="font-mono text-[11px] text-text-tertiary w-[22px] flex-shrink-0 pt-0.5">
                0{i + 1}
              </span>
              <span className="text-[14px] text-text-primary leading-[1.65]">
                {s}
              </span>
            </li>
          ))}
        </ol>
      </CornerBox>
    </section>
  );
}

function FAQ() {
  type Item = { q: string; a: React.ReactNode };
  const items: Item[] = [
    {
      q: "When is Langfuse Cloud India launching?",
      a: (
        <p>
          Langfuse Cloud India is launching in <b>early 2027</b>.{" "}
          <Link className="india-link" href="#waitlist">
            Register for the waitlist
          </Link>{" "}
          to receive launch updates and early access invitations, or{" "}
          <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
            talk to our India team
          </Link>{" "}
          if you have a specific production rollout timeline.
        </p>
      ),
    },
    {
      q: "Where is customer data stored?",
      a: (
        <p>
          Customer data—including traces, prompts, evaluations, datasets, and
          media—is hosted in Mumbai on AWS{" "}
          <span className="india-code-inline">ap-south-1</span> and ClickHouse
          Cloud in Mumbai. Postgres disaster-recovery backups also stay within
          India.
        </p>
      ),
    },
    {
      q: "Which subprocessors power the India region?",
      a: (
        <p>
          The primary in-region infrastructure subprocessors are <b>AWS</b> and{" "}
          <b>ClickHouse Cloud</b>, both operating in Mumbai, India. You can
          review the complete, up-to-date list at{" "}
          <Link className="india-link" href="/subprocessors">
            langfuse.com/subprocessors
          </Link>
          .
        </p>
      ),
    },
    {
      q: "Can we keep customer data in India before early 2027?",
      a: (
        <p>
          Yes. Langfuse&apos;s core is MIT-licensed open source, so you can
          self-host the same platform inside your own AWS Mumbai{" "}
          <span className="india-code-inline">ap-south-1</span> VPC today. See
          our{" "}
          <Link className="india-link" href="/self-hosting/deployment/aws">
            AWS Terraform guide
          </Link>{" "}
          and{" "}
          <Link className="india-link" href="/self-hosting">
            self-hosting documentation
          </Link>
          .
        </p>
      ),
    },
    {
      q: "If we start on EU or US Cloud now, can we migrate to Mumbai later?",
      a: (
        <p>
          Yes. Because each Langfuse Cloud region is isolated, migration takes
          four steps: create a project in the India region, export your existing
          data, import it into the Mumbai project, and update{" "}
          <span className="india-code-inline">LANGFUSE_BASE_URL</span>. See the{" "}
          <Link
            className="india-link"
            href="/guides/cookbook/example_data_migration"
          >
            data migration cookbook
          </Link>{" "}
          for ready-to-run scripts.
        </p>
      ),
    },
    {
      q: "How does billing work for teams in India?",
      a: (
        <p>
          Self-serve Cloud plans bill in <b>USD</b> by credit card. Enterprise
          customers with an annual commitment can pay via invoice or AWS
          Marketplace.{" "}
          <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
            Talk to our India team
          </Link>{" "}
          to discuss enterprise procurement and volume pricing.
        </p>
      ),
    },
    {
      q: "How do we connect with the India team for early access?",
      a: (
        <p>
          Join the{" "}
          <Link className="india-link" href="#waitlist">
            waitlist
          </Link>{" "}
          to be notified first, or{" "}
          <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
            talk to our India team
          </Link>{" "}
          to schedule an architecture review, share compliance requirements, or
          request early access.
        </p>
      ),
    },
  ];

  return (
    <section className="india-section pt-[110px] pb-10">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="md:sticky md:top-22 md:self-start">
          <div className="india-eyebrow mb-2.5">FAQ</div>
          <h2
            className="india-h2 max-w-[16ch]"
            style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
          >
            Answers before you ask.
          </h2>
          <p className="india-body-sm mt-3.5">
            Have a question not covered here?{" "}
            <Link className="india-link" href="/docs/ask-ai">
              Ask AI
            </Link>
            , email{" "}
            <Link className="india-link" href="mailto:support@langfuse.com">
              support@langfuse.com
            </Link>
            , or{" "}
            <Link className="india-link" href={INDIA_TALK_TO_US_HREF}>
              talk to our India team
            </Link>
            .
          </p>
        </div>
        <div>
          {items.map((it) => (
            <details key={it.q} className="india-faq-item">
              <summary>{it.q}</summary>
              <div className="india-faq-body">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="india-section pt-20 pb-10">
      <div className="grid gap-2 md:grid-cols-3">
        <CommunityCard
          eyebrow="Events"
          title="Meetups and workshops"
          body="Join Langfuse community meetups, hands-on workshops, and community hours online and in person."
          cta={["Browse events", "/events"]}
          glyph="01"
        />
        <CommunityCard
          eyebrow="Learning"
          title="Langfuse Academy"
          body="Learn the full AI engineering loop across tracing, monitoring, datasets, experiments, and evaluations."
          cta={["Open Academy", "/academy"]}
          glyph="02"
        />
        <CommunityCard
          eyebrow="Resources"
          title="Docs, skills, and llms.txt"
          body="Full guides for Python, TypeScript, and OpenTelemetry, plus agent skills for automated instrumentation."
          cta={["Read docs", "/docs"]}
          glyph="03"
        />
      </div>
    </section>
  );
}

function CommunityCard({
  eyebrow,
  title,
  body,
  cta,
  glyph,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: [string, string];
  glyph: string;
}) {
  return (
    <div className="india-chip-card p-6 flex flex-col gap-3 min-h-[220px]">
      <div className="flex items-baseline justify-between">
        <div className="india-eyebrow">{eyebrow}</div>
        <div className="font-analog text-[28px] text-text-disabled leading-none">
          {glyph}
        </div>
      </div>
      <div className="font-analog text-[22px] leading-[1.35] text-text-primary font-medium">
        {title}
      </div>
      <p className="india-body-sm m-0">{body}</p>
      <div className="flex-1" />
      <Link
        href={cta[1]}
        className="font-mono text-[12px] text-text-primary border-b border-text-primary self-start pb-px"
      >
        {cta[0]} ↗
      </Link>
    </div>
  );
}

function CTABanner() {
  return (
    <section className="india-section pt-[100px] pb-15">
      <CornerBox
        withStripes
        className="px-6 sm:px-8 py-[72px] text-center flex flex-col items-center gap-[22px]"
      >
        <div className="india-eyebrow">
          Langfuse Cloud India: Launching early 2027
        </div>
        <h2 className="india-h2 max-w-[26ch]">
          Keep your AI telemetry in{" "}
          <span className="india-highlight">India.</span>
        </h2>
        <p className="india-body text-center">
          Hosted on AWS and ClickHouse Cloud in Mumbai (ap-south-1). Register
          for the waitlist or talk to our India team.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" size="default" href="#waitlist">
            Register for waitlist
          </Button>
          <Button
            variant="secondary"
            size="default"
            href={INDIA_TALK_TO_US_HREF}
          >
            Talk to our India team
          </Button>
        </div>
      </CornerBox>
    </section>
  );
}

export function IndiaLanding() {
  return (
    <div className="india-page">
      <IndiaStyles />
      <div className="max-w-[1440px] mx-auto">
        <Hero />
        <WaitlistSection />
        <WhyIndia />
        <GetStarted />
        <Customers />
        <Compliance />
        <Migration />
        <FAQ />
        <Community />
        <CTABanner />
      </div>
    </div>
  );
}
