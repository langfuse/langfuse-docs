"use client";

import Link from "next/link";
import { LaunchWeek5Styles } from "./styles";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";

const cornerBoxBase =
  "relative bg-surface-bg border border-line-structure lw5-corners";

type DayCard = {
  n: string;
  weekday: string;
  date: string;
  hint?: string;
};

const DAYS: DayCard[] = [
  { n: "01", weekday: "Monday", date: "May 25", hint: "Ship faster" },
  { n: "02", weekday: "Tuesday", date: "May 26", hint: "Built for agents" },
  { n: "03", weekday: "Wednesday", date: "May 27", hint: "Find anything" },
  { n: "04", weekday: "Thursday", date: "May 28", hint: "Evals as code" },
  { n: "05", weekday: "Friday", date: "May 29", hint: "Never miss a thing" },
];

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="lw5-section pt-10 pb-5">
      <div
        className={`${cornerBoxBase} no-bl no-br flex flex-wrap items-center justify-center gap-x-[18px] gap-y-2 px-5 py-[10px] text-[13px] text-text-secondary`}
      >
        <span className="lw5-pill">
          <span className="lw5-pulse" />
          Live · May 25–29, 2026
        </span>
        <span className="lw5-dot" />
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-text-tertiary whitespace-nowrap">
          5 days · 5 drops
        </span>
        <span className="lw5-dot" />
        <span className="whitespace-nowrap">
          Live demos at{" "}
          <Link
            href="https://clickhouse.com/openhouse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary font-medium border-b border-text-primary pb-px"
          >
            ClickHouse OpenHouse
          </Link>
        </span>
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr no-bl no-br relative overflow-hidden grid gap-14 items-center px-5 sm:px-8 py-16 md:py-[88px] -mt-px -mb-px md:grid-cols-[1.4fr_1fr]`}
      >
        <div
          aria-hidden
          className="lw5-blueprint absolute inset-0 opacity-80 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent)",
          }}
        />

        <div className="relative flex flex-col gap-6">
          <div className="lw5-eyebrow">
            Langfuse · Launch Week 5 · May 25–29, 2026
          </div>
          <h1 className="lw5-h1">
            Engineering
            <br />
            the <span className="lw5-highlight">AI Loop.</span>
          </h1>
          <p className="lw5-body" style={{ fontSize: 17, maxWidth: "48ch" }}>
            Five days. Five drops. New building blocks for taking AI
            applications from prototype to production — unveiled live at{" "}
            <Link
              href="https://clickhouse.com/openhouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary font-medium border-b border-text-primary pb-px"
            >
              ClickHouse OpenHouse
            </Link>
            .
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <div className="lw5-eyebrow">
              Get every drop in your inbox · No spam
            </div>
            <ProductUpdateSignup
              source="Launch Week 5 hero"
              className="lw5-subscribe max-w-md"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="lw5-btn-wrap">
              <Link
                className="lw5-btn lw5-btn-secondary"
                href="https://x.com/langfuse"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Follow @langfuse on X</span>
                <span className="lw5-kbd">↗</span>
              </Link>
            </span>
            <span className="lw5-btn-wrap">
              <Link
                className="lw5-btn lw5-btn-secondary"
                href="https://github.com/langfuse/langfuse"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Star on GitHub</span>
                <span className="lw5-kbd">★</span>
              </Link>
            </span>
            <span className="lw5-btn-wrap">
              <Link
                className="lw5-btn lw5-btn-secondary"
                href="https://www.linkedin.com/company/langfuse/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LinkedIn</span>
                <span className="lw5-kbd">↗</span>
              </Link>
            </span>
          </div>
        </div>

        <HeroArt />
      </div>

      <div
        className={`${cornerBoxBase} no-tl no-tr grid grid-cols-2 md:grid-cols-4 [border-top:none]`}
      >
        {[
          ["5 days", "5 feature drops"],
          ["Live demos", "ClickHouse OpenHouse"],
          ["Open source", "MIT · self-host anytime"],
          ["Every day", "8:00 AM PT · M–F"],
        ].map(([top, bot], i) => (
          <div
            key={top}
            className="flex flex-col gap-1 px-5 py-[22px]"
            style={{
              borderRight: i < 3 ? "1px solid var(--line-structure)" : "none",
              borderTop: "1px solid var(--line-structure)",
            }}
          >
            <span className="text-[13px] font-medium text-text-primary leading-[1.4]">
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
  return (
    <div className="relative h-[340px] w-full hidden md:block">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <pattern
            id="lw5-dots"
            x="0"
            y="0"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="var(--line-cta)" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#lw5-dots)" />

        {/* loop / pipeline ring */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="var(--line-cta)"
          strokeDasharray="3 6"
          opacity="0.5"
        />
        {/* arrow heads at compass points */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 160;
          const y = 200 + Math.sin(rad) * 160;
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${deg + 90})`}>
              <polygon points="0,-6 6,6 -6,6" fill="var(--line-cta)" />
            </g>
          );
        })}
        <text
          x="200"
          y="204"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--text-tertiary)"
          letterSpacing="2"
        >
          THE AI LOOP
        </text>
      </svg>

      {/* Stacked launch cards */}
      {[
        { label: "01", rot: -10, x: 18, y: 26, z: 1 },
        { label: "02", rot: 7, x: 145, y: 8, z: 3 },
        { label: "03", rot: -3, x: 222, y: 152, z: 2 },
        { label: "04", rot: 9, x: 60, y: 196, z: 2 },
        { label: "05", rot: -8, x: 195, y: 250, z: 1 },
      ].map((c) => (
        <div
          key={c.label}
          className="absolute w-[110px] bg-white border border-line-structure"
          style={{
            left: c.x,
            top: c.y,
            zIndex: c.z,
            transform: `rotate(${c.rot}deg)`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div className="aspect-square flex flex-col items-center justify-center gap-1.5 bg-surface-1">
            <div
              className="font-analog text-[44px] font-medium leading-none"
              style={{ color: "var(--text-disabled)" }}
            >
              {c.label}
            </div>
            <span className="lw5-lock">
              <LockIcon />
            </span>
          </div>
          <div className="px-2 py-1 font-mono text-[9px] uppercase tracking-[.06em] text-text-tertiary text-center border-t border-line-structure bg-white">
            DAY {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Schedule() {
  return (
    <section
      id="schedule"
      className="lw5-section pt-[100px] pb-10 scroll-mt-24"
    >
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="lw5-eyebrow">The Week · May 25–29, 2026</div>
        <h2 className="lw5-h2 max-w-[24ch]">
          One drop a day, every day.
          <br />
          <span className="lw5-highlight">Monday through Friday.</span>
        </h2>
        <p className="lw5-body">
          Every day at 8:00 AM Pacific, we unwrap a new feature. We'll update
          this page as each one ships. Subscribe to the newsletter or follow us
          to make sure you don't miss a drop.
        </p>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {DAYS.map((day) => (
          <div key={day.n} className="lw5-day-card" data-state="locked">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[.08em] text-text-tertiary">
                Day {day.n}
              </span>
              <span className="lw5-lock">
                <LockIcon />
              </span>
            </div>
            <div className="lw5-day-num">{day.n}</div>
            <div className="flex flex-col gap-0.5 mt-auto">
              <div className="text-[14px] text-text-primary font-medium">
                {day.weekday}
              </div>
              <div className="font-mono text-[11px] text-text-tertiary">
                {day.date}, 2026 · 8:00 AM PT
              </div>
            </div>
            <div className="border-t border-line-structure pt-3 mt-1">
              <div className="font-mono text-[11px] uppercase tracking-[.06em] text-text-tertiary">
                {day.hint ?? "Stay tuned"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThemePillars() {
  const pillars = [
    {
      n: "I",
      title: "Production-grade by default",
      body: "Treat your AI like real software. Bring engineering rigor to evaluation, deployment, and operations.",
    },
    {
      n: "II",
      title: "Built for agents",
      body: "From multi-step traces to the surfaces and protocols agents speak natively. Tooling that meets agents where they live.",
    },
    {
      n: "III",
      title: "Closer to the data",
      body: "A deeper partnership with ClickHouse — faster queries, tighter integration, and a single sign-on between the two products you already use.",
    },
  ];

  return (
    <section className="lw5-section pt-[100px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-10">
        <div className="lw5-eyebrow">The Theme · WHAT THIS WEEK IS ABOUT</div>
        <h2 className="lw5-h2 max-w-[28ch]">
          The dev loop for AI engineers,
          <br />
          <span className="lw5-highlight">closed end to end.</span>
        </h2>
        <p className="lw5-body">
          Launch Week 5 is about the parts of the AI loop that get serious in
          production: the testing pipeline, the alerts when something drifts,
          the way you actually find a needle in a million traces, and the
          building blocks for the agents you're shipping. We can't tell you
          what's coming yet — but here's the shape of it.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.n} className="lw5-pillar">
            <span className="lw5-pillar-num">Pillar {p.n}</span>
            <div className="font-analog text-[22px] leading-[1.3] text-text-primary font-medium mb-1 [text-wrap:balance]">
              {p.title}
            </div>
            <p className="lw5-body-sm m-0">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OpenHouseCallout() {
  return (
    <section className="lw5-section pt-[100px] pb-10">
      <div
        className={`${cornerBoxBase} grid gap-8 md:grid-cols-[1.5fr_1fr] items-stretch overflow-hidden`}
      >
        <div className="relative px-7 py-9 md:px-10 md:py-12 flex flex-col gap-5">
          <div
            aria-hidden
            className="lw5-grid-bg absolute inset-0 opacity-60 pointer-events-none"
            style={{
              maskImage: "linear-gradient(to right, black, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to right, black, transparent 80%)",
            }}
          />
          <div className="relative flex flex-col gap-4">
            <div className="lw5-eyebrow">In Person · ClickHouse OpenHouse</div>
            <h2
              className="lw5-h2 max-w-[20ch]"
              style={{ fontSize: "clamp(28px, 3.4vw, 48px)" }}
            >
              See every drop live, on stage.
            </h2>
            <p className="lw5-body max-w-[52ch]">
              Launch Week 5 happens alongside{" "}
              <b className="text-text-primary font-medium">
                ClickHouse OpenHouse
              </b>
              , the ClickHouse conference. The Langfuse team will be there in
              person, demoing each launch as it ships — and answering anything
              you want to ask about the roadmap, AI engineering, or how we use
              ClickHouse under the hood.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="lw5-btn-wrap">
                <Link
                  className="lw5-btn lw5-btn-primary"
                  href="https://clickhouse.com/openhouse"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Visit ClickHouse OpenHouse</span>
                  <span className="lw5-kbd">↗</span>
                </Link>
              </span>
              <span className="lw5-btn-wrap">
                <Link
                  className="lw5-btn lw5-btn-secondary"
                  href="/blog/joining-clickhouse"
                >
                  <span>Langfuse + ClickHouse</span>
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="relative bg-surface-1 border-l border-line-structure flex flex-col">
          <div className="lw5-stripes-bg absolute inset-0 opacity-70 pointer-events-none" />
          <div className="relative flex-1 flex flex-col justify-center gap-4 px-7 py-9">
            <div className="flex items-baseline justify-between">
              <span className="lw5-eyebrow">Schedule</span>
              <span className="font-mono text-[10px] text-text-tertiary">
                LIVE
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                ["Mon", "Day 1 demo"],
                ["Tue", "Day 2 demo"],
                ["Wed", "Day 3 demo"],
                ["Thu", "Day 4 demo"],
                ["Fri", "Day 5 demo"],
              ].map(([d, label]) => (
                <div
                  key={d}
                  className="flex items-center gap-3 px-3 py-2 border border-line-structure bg-surface-bg rounded-[2px]"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[.06em] text-text-tertiary w-8">
                    {d}
                  </span>
                  <span className="text-[13px] text-text-primary flex-1">
                    {label}
                  </span>
                  <span className="lw5-lock">
                    <LockIcon />
                  </span>
                </div>
              ))}
            </div>
            <div className="font-mono text-[10px] text-text-tertiary uppercase tracking-[.08em] mt-auto">
              clickhouse.com/openhouse ↗
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Subscribe() {
  return (
    <section
      id="subscribe"
      className="lw5-section pt-[100px] pb-10 scroll-mt-24"
    >
      <div
        className={`${cornerBoxBase} lw5-stripes-bg grid gap-10 items-center px-8 py-12 md:px-12 md:py-16 md:grid-cols-[1.2fr_1fr]`}
      >
        <div className="flex flex-col gap-5">
          <div className="lw5-eyebrow">Stay in the loop</div>
          <h2 className="lw5-h2 max-w-[22ch]">
            Five emails. One per drop.{" "}
            <span className="lw5-highlight">No filler.</span>
          </h2>
          <p className="lw5-body max-w-[52ch]">
            Drop your email and we'll send you a short note each morning of
            Launch Week with what's new, why we built it, and how to try it.
            Unsubscribe anytime.
          </p>
          <ProductUpdateSignup
            source="Launch Week 5 subscribe section"
            className="lw5-subscribe max-w-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="lw5-eyebrow mb-1.5">Or follow us live</div>
          {[
            ["X · @langfuse", "https://x.com/langfuse", "𝕏"],
            ["LinkedIn", "https://www.linkedin.com/company/langfuse/", "in"],
            ["GitHub · ★ Star", "https://github.com/langfuse/langfuse", "★"],
            ["Discord", "/discord", "◇"],
            ["YouTube", "https://www.youtube.com/@langfuse", "▶"],
          ].map(([label, href, glyph]) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 px-4 py-3 border border-line-structure bg-surface-bg rounded-[2px] hover:border-line-cta transition-colors"
            >
              <span className="font-analog text-[18px] text-text-primary w-6 text-center">
                {glyph}
              </span>
              <span className="flex-1 text-[13.5px] text-text-primary font-medium">
                {label}
              </span>
              <span className="font-mono text-[11px] text-text-tertiary">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PastLaunchWeeks() {
  const weeks = [
    {
      n: "01",
      date: "April 2024",
      title: "Langfuse 2.0",
      body: "Our first launch week — the LLM Playground, decorators, Datasets v2, and model-based evaluations.",
      href: "/blog/launch-week-1",
    },
    {
      n: "02",
      date: "November 2024",
      title: "Next-gen models",
      body: "Prompt experiments, LLM-as-a-judge, multi-modal traces, and tighter integration into the dev loop.",
      href: "/blog/2024-11-17-launch-week-2",
    },
    {
      n: "03",
      date: "May 2025",
      title: "Open and customizable",
      body: "Customizable dashboards, a new SDK generation, and the steps that opened up Langfuse to a wider stack.",
      href: "/blog/2025-05-19-launch-week-3",
    },
    {
      n: "04",
      date: "November 2025",
      title: "Built for agents",
      body: "Agent graphs, trace log views, score analytics, dataset folders — a week focused on debugging modern agents.",
      href: "/blog/2025-10-29-launch-week-4",
    },
  ];

  return (
    <section className="lw5-section pt-[100px] pb-10">
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="lw5-eyebrow">Previously · Launch Weeks 1 → 4</div>
        <h2 className="lw5-h2 max-w-[28ch]">A track record of shipping.</h2>
        <p className="lw5-body">
          We've shipped a launch week every six months since 2024. Each one adds
          a chapter to how Langfuse fits into modern AI engineering.
        </p>
      </div>

      <div
        className={`${cornerBoxBase} lw5-past-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4`}
      >
        {weeks.map((w) => (
          <Link
            key={w.n}
            href={w.href}
            className="block px-6 py-7 hover:bg-surface-1 transition-colors no-underline"
          >
            <div className="flex items-baseline justify-between mb-5">
              <span
                className="font-analog text-[36px] font-medium leading-none"
                style={{ color: "var(--text-disabled)" }}
              >
                {w.n}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[.08em] text-text-tertiary">
                {w.date}
              </span>
            </div>
            <div className="font-analog text-[18px] leading-[1.35] text-text-primary font-medium mb-2">
              {w.title}
            </div>
            <p className="lw5-body-sm m-0">{w.body}</p>
            <div className="font-mono text-[11px] text-text-tertiary mt-4">
              Read the recap ↗
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="lw5-section pt-[80px] pb-16">
      <div
        className={`${cornerBoxBase} lw5-stripes-bg px-8 py-[72px] text-center flex flex-col items-center gap-[22px]`}
      >
        <div className="lw5-eyebrow">Launch Week 5 · May 25–29, 2026</div>
        <h2 className="lw5-h2 max-w-[26ch]">
          Don't blink.{" "}
          <span className="lw5-highlight">Five drops, coming fast.</span>
        </h2>
        <p className="lw5-body text-center">
          Subscribe, follow, or just come back every morning at 8 AM PT.
        </p>
        <div className="lw5-subscribe w-full flex justify-center">
          <ProductUpdateSignup
            source="Launch Week 5 final CTA"
            className="max-w-md"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="lw5-btn-wrap">
            <Link
              className="lw5-btn lw5-btn-primary"
              href="https://x.com/langfuse"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Follow @langfuse</span>
              <span className="lw5-kbd">↗</span>
            </Link>
          </span>
          <span className="lw5-btn-wrap">
            <Link
              className="lw5-btn lw5-btn-secondary"
              href="https://clickhouse.com/openhouse"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>See us at OpenHouse</span>
              <span className="lw5-kbd">↗</span>
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}

export function LaunchWeek5Landing() {
  return (
    <div className="lw5-page">
      <LaunchWeek5Styles />
      <div className="max-w-[1440px] mx-auto">
        <Hero />
        <Schedule />
        <ThemePillars />
        <OpenHouseCallout />
        <Subscribe />
        <PastLaunchWeeks />
        <FinalCTA />
      </div>
    </div>
  );
}
