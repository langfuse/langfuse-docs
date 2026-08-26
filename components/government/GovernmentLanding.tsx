"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { GovernmentStyles } from "./styles";

const cornerBoxBase =
  "relative bg-surface-bg border border-line-structure gov-corners";

const DOCKER_QUICKSTART = `git clone https://github.com/langfuse/langfuse.git
cd langfuse
docker compose up`;

function CodeBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked in some browsers; the command is still visible.
    }
  };
  return (
    <div className="overflow-hidden rounded-[2px] border border-line-cta bg-text-primary">
      <div className="flex items-center justify-between border-b border-line-cta bg-text-secondary px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[.08em] text-surface-2">
          terminal
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="cursor-pointer border-0 bg-transparent px-1.5 py-0.5 font-mono text-[10px] text-surface-2 hover:text-surface-bg"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="m-0 overflow-auto p-4 font-mono text-[12.5px] leading-[1.75] text-surface-bg">
        <span className="text-surface-2">$ </span>
        git clone https://github.com/langfuse/langfuse.git
        {"\n"}
        <span className="text-surface-2">$ </span>
        cd langfuse
        {"\n"}
        <span className="text-surface-2">$ </span>
        docker compose up
      </pre>
    </div>
  );
}

function Ctas({ size = "default" }: { size?: "default" | "small" }) {
  const btn = size === "small" ? "gov-btn gov-btn-small" : "gov-btn";
  return (
    <div className="flex flex-wrap gap-2">
      <span className="gov-btn-wrap">
        <Link className={`${btn} gov-btn-primary`} href="/talk-to-us">
          <span>Talk to a public-sector expert</span>
          <span className="gov-kbd">↗</span>
        </Link>
      </span>
      <span className="gov-btn-wrap">
        <Link className={`${btn} gov-btn-secondary`} href="/self-hosting">
          <span>Explore self-hosting</span>
        </Link>
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section className="gov-section pb-5 pt-10">
      <div
        className={`${cornerBoxBase} no-bl no-br flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-7 sm:py-7`}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <div className="gov-eyebrow">Open source · Self-hosted</div>
          <p className="gov-masthead">
            Langfuse for <span className="gov-highlight">Government</span>
          </p>
        </div>
        <p className="gov-body-sm m-0 max-w-[38ch] text-pretty sm:text-right">
          Observability and evaluations for public-sector AI, in your
          environment.
        </p>
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr no-bl no-br relative -mt-px -mb-px grid items-center gap-10 px-5 py-12 sm:px-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 md:py-[64px]`}
      >
        <div
          aria-hidden
          className="gov-blueprint pointer-events-none absolute inset-0 opacity-80"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
          }}
        />

        <div className="relative flex flex-col gap-5">
          <div className="gov-eyebrow">
            Government · Public sector · Internet optional
          </div>
          <h1 className="gov-h1">
            Build accountable AI.
            <br />
            Keep it <span className="gov-highlight">under your control.</span>
          </h1>
          <p className="gov-body" style={{ fontSize: 17, maxWidth: "42ch" }}>
            Open-source tracing and evaluations for government AI. Run it{" "}
            <b className="font-medium text-text-primary">
              air-gapped, on-premises, or in a private cloud
            </b>
            . Prompts, traces, and scores stay in your environment. You run the
            software.
          </p>
          <ul className="gov-claim-row">
            <li>Your environment</li>
            <li>Open source</li>
            <li>Your traces</li>
          </ul>
          <Ctas />
        </div>

        <HeroArt />
      </div>

      <div
        className={`${cornerBoxBase} gov-proof-grid no-tl no-tr grid grid-cols-2 [border-top:none] md:grid-cols-4`}
      >
        {[
          ["Open-source core", "MIT · no usage limits"],
          ["Internet optional", "Air-gapped ready"],
          ["100,000+ engineers", "Building on Langfuse"],
          ["10+ billion", "Observations / month"],
        ].map(([top, bot]) => (
          <div key={top} className="flex flex-col gap-1 px-5 py-[22px]">
            <span className="text-[13px] font-medium leading-[1.4] text-text-primary">
              {top}
            </span>
            <span className="font-mono text-[12px] text-text-tertiary">
              {bot}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroArt() {
  const [lifted, setLifted] = useState<string | null>(null);
  const cards: {
    title: string;
    caption: string;
    rot: number;
    x: number;
    y: number;
    z: number;
    scale: number;
    featured?: boolean;
    icon: "lock" | "server" | "building";
  }[] = [
    {
      title: "Air-gapped",
      caption: "No outbound network",
      rot: -9,
      x: 4,
      y: 42,
      z: 1,
      scale: 1,
      icon: "lock",
    },
    {
      title: "On-premises",
      caption: "Your cluster",
      rot: 8,
      x: 168,
      y: 18,
      z: 2,
      scale: 1,
      icon: "server",
    },
    {
      title: "Government",
      caption: "Public sector",
      rot: -3.5,
      x: 62,
      y: 150,
      z: 4,
      scale: 1.04,
      featured: true,
      icon: "building",
    },
  ];

  return (
    <>
      <div
        className={`gov-hero-art relative mx-auto hidden h-[420px] w-full max-w-[380px] md:block${
          lifted ? " is-engaged" : ""
        }`}
        aria-hidden
        onMouseLeave={() => setLifted(null)}
      >
        <svg
          viewBox="0 0 400 400"
          className="pointer-events-none absolute inset-0 opacity-45"
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
            y="206"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="var(--text-tertiary)"
            letterSpacing="1.8"
          >
            GOVERNMENT
          </text>
        </svg>
        {cards.map((c) => (
          <div
            key={c.title}
            className={`gov-polaroid${c.featured ? " is-featured" : ""}${
              lifted === c.title ? " is-lifted" : ""
            }`}
            onMouseEnter={() => setLifted(c.title)}
            style={
              {
                "--x": `${c.x}px`,
                "--y": `${c.y}px`,
                "--z": String(c.z),
                "--rest-rot": `${c.rot}deg`,
                "--rest-scale": String(c.scale),
              } as CSSProperties
            }
          >
            <div className="gov-polaroid-well">
              <EnvIcon kind={c.icon} />
            </div>
            <div className="mt-2 text-center font-mono text-[11px] font-medium uppercase tracking-[.07em] text-text-primary">
              {c.title}
            </div>
            <div className="text-center font-mono text-[10px] text-text-tertiary">
              {c.caption}
            </div>
          </div>
        ))}
      </div>
      <div
        className="relative mt-1 flex justify-center gap-2.5 md:hidden"
        aria-hidden
      >
        {cards.map((c) => (
          <div
            key={c.title}
            className={`gov-card-shadow w-[31%] min-w-[96px] max-w-[128px] border border-line-structure bg-surface-bg p-2 ${
              c.featured ? "relative" : ""
            }`}
          >
            {c.featured ? (
              <span className="absolute inset-x-0 top-0 h-[3px] bg-surface-cta-primary" />
            ) : null}
            <div className="gov-polaroid-well">
              <EnvIcon kind={c.icon} />
            </div>
            <div className="mt-1.5 text-center font-mono text-[9px] font-medium uppercase tracking-[.06em] text-text-primary">
              {c.title}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function EnvIcon({ kind }: { kind: "lock" | "server" | "building" }) {
  const common = {
    width: 42,
    height: 42,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-primary)",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "lock") {
    return (
      <svg {...common} aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }
  if (kind === "server") {
    return (
      <svg {...common} aria-hidden>
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <circle cx="7" cy="7" r="0.8" fill="var(--text-primary)" />
        <circle cx="7" cy="17" r="0.8" fill="var(--text-primary)" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M2 10h20L12 3.5z" />
      <path d="M4 10v10" />
      <path d="M20 10v10" />
      <path d="M3 20h18" />
      <path d="M8 20v-7" />
      <path d="M12 20v-7" />
      <path d="M16 20v-7" />
      <path d="M8 13h8" />
    </svg>
  );
}

function ProductLoop() {
  const pillars = [
    {
      n: "01",
      eyebrow: "Observe",
      title: "See what happened",
      body: "Trace every model call, tool invocation, retrieval step, and agent decision. Investigate failures with the full context of each request, session, model, prompt, latency, and cost.",
      href: "/docs/observability/overview",
      label: "Observability docs",
    },
    {
      n: "02",
      eyebrow: "Evaluate",
      title: "Measure what works",
      body: "Score outputs with LLM-as-a-judge, deterministic checks, human review, and user feedback. Turn production failures into datasets and regression tests before the next release.",
      href: "/docs/evaluation/overview",
      label: "Evaluation docs",
    },
    {
      n: "03",
      eyebrow: "Contain",
      title: "Contain failures early",
      body: "Monitor quality, security scores, latency, and cost. Set thresholds and send alerts to webhooks, Slack, or GitHub Actions so you can respond before a bad run repeats.",
      href: "/docs/observability/features/alerts",
      label: "Alerts docs",
    },
  ];

  return (
    <section id="observe" className="gov-section scroll-mt-24 pb-10 pt-[100px]">
      <div className="mb-10 flex flex-col items-start gap-3.5">
        <div className="gov-eyebrow">Observability · Evaluations · Alerts</div>
        <h2 className="gov-h2 max-w-[24ch]">
          See what happened.{" "}
          <span className="gov-highlight">Score what works.</span>
        </h2>
        <p className="gov-body">
          You need to see how an agent reached an answer, score whether it is
          reliable, and change it without moving sensitive data out of your
          environment.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.n}
            className="gov-chip-card flex min-h-[280px] flex-col gap-3.5 p-6"
          >
            <div className="flex items-center justify-between">
              <span className="gov-step-num">{p.n}</span>
              <span className="gov-eyebrow">{p.eyebrow}</span>
            </div>
            <div className="font-analog text-[22px] font-medium leading-[1.3] text-text-primary">
              {p.title}
            </div>
            <p className="m-0 text-[13.5px] leading-[1.8] text-text-tertiary">
              {p.body}
            </p>
            <div className="flex-1" />
            <Link
              href={p.href}
              className="self-start border-b border-text-primary pb-px font-mono text-[12px] text-text-primary"
            >
              {p.label} ↗
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Deployment() {
  const cards: {
    n: string;
    title: string;
    body: ReactNode;
    href: string;
    label: string;
    enterprise?: boolean;
  }[] = [
    {
      n: "01",
      title: "Run inside your security boundary",
      body: (
        <>
          Deploy Langfuse in a VPC, on premises, or in a fully air-gapped
          Kubernetes environment. Internet access is optional. Bring your own
          infrastructure, networking, storage, and operational controls.
        </>
      ),
      href: "/self-hosting/security/networking",
      label: "Networking docs",
    },
    {
      n: "02",
      title: "Inspect and control the software",
      body: (
        <>
          The Langfuse repository is public. Tracing, evaluations, prompt
          management, experiments, and annotation are MIT-licensed, with no
          usage limits. Enterprise extensions live in marked directories and
          turn on with a license key.
        </>
      ),
      href: "/handbook/chapters/open-source",
      label: "Open-source licensing",
    },
    {
      n: "03",
      title: "Same architecture as Langfuse Cloud",
      body: (
        <>
          Self-hosted Langfuse uses the same codebase and architecture as
          Langfuse Cloud. Asynchronous ingestion absorbs traffic spikes, events
          are persisted before processing, and background migrations reduce
          disruption during upgrades.
        </>
      ),
      href: "/self-hosting#architecture",
      label: "Architecture overview",
    },
    {
      n: "04",
      title: "Keep AI systems accountable",
      enterprise: true,
      body: (
        <>
          Application traces create a detailed record of model calls and agent
          actions. Enterprise audit logs add immutable records of who changed
          what, when, and with which before-and-after state. SSO, role-based
          access control, SCIM, retention policies, and server-side data masking
          support centralized governance.
        </>
      ),
      href: "/docs/administration/audit-logs",
      label: "Audit logs",
    },
  ];

  return (
    <section id="deploy" className="gov-section scroll-mt-24 pb-10 pt-[100px]">
      <div className="mb-10 flex flex-col items-start gap-3.5">
        <div className="gov-eyebrow">Self-hosting · Governance</div>
        <h2 className="gov-h2 max-w-[22ch]">
          Run it where you{" "}
          <span className="gov-highlight">already operate.</span>
        </h2>
        <p className="gov-body">
          Langfuse runs behind a firewall, on a classified network, or in an
          approved cloud account. The product and data model stay the same.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.n} className="gov-chip-card flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="gov-eyebrow">{c.n}</span>
              {c.enterprise ? (
                <span className="gov-ee-pill">Enterprise</span>
              ) : null}
            </div>
            <div className="font-analog text-[22px] font-medium leading-[1.3] text-text-primary [text-wrap:balance]">
              {c.title}
            </div>
            <p className="gov-body-sm m-0">{c.body}</p>
            <div className="flex-1" />
            <Link
              href={c.href}
              className="self-start border-b border-text-primary pb-px font-mono text-[12px] text-text-primary"
            >
              {c.label} ↗
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Security() {
  const items = [
    {
      title: "Data stays where you put it",
      body: "Run the platform and its open-source dependencies in infrastructure you control.",
    },
    {
      title: "Sensitive data can be masked before storage",
      body: (
        <>
          Redact data in the SDK before transmission, or apply{" "}
          <Link className="gov-link" href="/self-hosting/security/data-masking">
            centralized ingestion masking
          </Link>{" "}
          in self-hosted Enterprise deployments.
        </>
      ),
    },
    {
      title: "Open standards reduce lock-in",
      body: (
        <>
          Instrument with{" "}
          <Link className="gov-link" href="/integrations/native/opentelemetry">
            OpenTelemetry
          </Link>
          , or use Langfuse SDKs and integrations across models, frameworks, and
          languages.
        </>
      ),
    },
    {
      title: "Your team controls upgrades",
      body: "Use versioned releases and deploy changes on your schedule.",
    },
  ];

  return (
    <section
      id="security"
      className="gov-section scroll-mt-24 pb-10 pt-[100px]"
    >
      <div className="grid items-stretch gap-4 md:grid-cols-[1fr_1.5fr]">
        <div
          className={`${cornerBoxBase} relative flex flex-col gap-5 overflow-hidden p-7`}
        >
          <div
            aria-hidden
            className="gov-grid-bg pointer-events-none absolute inset-0 opacity-60"
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent 75%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black, transparent 75%)",
            }}
          />
          <div className="relative flex flex-col gap-3.5">
            <div className="gov-eyebrow">Security · Data control</div>
            <h2
              className="gov-h2 max-w-[16ch]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              Keep data in your environment.
            </h2>
            <p className="gov-body-sm max-w-[40ch]">
              Application teams can debug and evaluate agents. Security teams
              keep telemetry, prompts, and evaluation data in the approved
              boundary.
            </p>
          </div>
          <div
            id="fips"
            className="relative mt-auto flex flex-col gap-3 border border-line-structure bg-surface-1 p-4"
          >
            <div className="gov-eyebrow">FIPS images</div>
            <p className="gov-body-sm m-0">
              For deployments with FIPS requirements, compliant Langfuse Docker
              images are available upon request.
            </p>
            <Link
              className="gov-btn gov-btn-primary gov-btn-small !shadow-none self-start"
              href="/talk-to-us"
            >
              <span>Book a meeting</span>
              <span className="gov-kbd">↗</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="gov-chip-card flex flex-col gap-2 p-5"
            >
              <div className="font-analog text-[18px] font-medium leading-[1.35] text-text-primary [text-wrap:balance]">
                {item.title}
              </div>
              <p className="gov-body-sm m-0">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section
      id="get-started"
      className="gov-section scroll-mt-24 pb-10 pt-[100px]"
    >
      <div
        className={`${cornerBoxBase} grid items-center gap-10 px-6 py-9 md:grid-cols-[1fr_1.15fr] md:px-8`}
      >
        <div className="flex flex-col gap-4">
          <div className="gov-eyebrow">Get started · MIT licensed</div>
          <h2
            className="gov-h2 max-w-[18ch]"
            style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
          >
            Start locally.{" "}
            <span className="gov-highlight">Deploy in production.</span>
          </h2>
          <p className="gov-body-sm m-0 max-w-[44ch]">
            Run Langfuse locally with Docker Compose in minutes. The repository
            is public and the core is MIT-licensed. Move to Kubernetes or
            Terraform without changing the product or data model.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Link className="gov-code-inline" href="/self-hosting">
              Deployment guide
            </Link>
            <Link
              className="gov-code-inline"
              href="https://github.com/langfuse/langfuse"
            >
              github.com/langfuse/langfuse
            </Link>
            <Link
              className="gov-code-inline"
              href="/self-hosting/deployment/kubernetes-helm"
            >
              Helm chart
            </Link>
            <Link
              className="gov-code-inline"
              href="/self-hosting/deployment/aws"
            >
              AWS Terraform
            </Link>
            <Link
              className="gov-code-inline"
              href="/self-hosting/deployment/azure"
            >
              Azure Terraform
            </Link>
            <Link
              className="gov-code-inline"
              href="/self-hosting/deployment/gcp"
            >
              GCP Terraform
            </Link>
          </div>
        </div>

        <CodeBox value={DOCKER_QUICKSTART} />
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="gov-section pb-15 pt-[80px]">
      <div
        className={`${cornerBoxBase} gov-stripes-bg flex flex-col items-center gap-[22px] px-8 py-[72px] text-center`}
      >
        <div className="gov-eyebrow">Langfuse for Government</div>
        <h2 className="gov-h2 max-w-[22ch]">
          Run Langfuse in{" "}
          <span className="gov-highlight">your environment.</span>
        </h2>
        <p className="gov-body text-center">
          Talk through tracing, evaluations, and self-hosting for government AI.
          Sensitive data stays in infrastructure you control.
        </p>
        <Ctas />
      </div>
    </section>
  );
}

export function GovernmentLanding() {
  return (
    <div className="gov-page">
      <GovernmentStyles />
      <div className="mx-auto max-w-[1000px]">
        <Hero />
        <ProductLoop />
        <Deployment />
        <Security />
        <GetStarted />
        <CTABanner />
      </div>
    </div>
  );
}
