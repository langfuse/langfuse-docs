"use client";

import Link from "next/link";
import { LaunchWeek5Styles } from "./styles";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";
import { Video } from "@/components/Video";

const cornerBoxBase =
  "relative bg-surface-bg border border-line-structure lw5-corners";

type DayCard = {
  n: string;
  weekday: string;
  date: string;
  hint?: string;
  title?: string;
  href?: string;
};

const DAYS: DayCard[] = [
  {
    n: "01",
    weekday: "Monday",
    date: "May 25",
    title: "Experiments in CI/CD",
    href: "/changelog/2026-05-25-experiment-ci-cd-gates",
  },
  {
    n: "02",
    weekday: "Tuesday",
    date: "May 26",
    title: "Langfuse agent skill",
    href: "/changelog/2026-05-26-langfuse-agent-skill",
  },
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
          <div className="lw5-eyebrow">Langfuse · May 25–29, 2026</div>
          <h1 className="lw5-h1">
            Launch Week <span className="lw5-highlight">#5</span>
          </h1>
          <p className="lw5-body" style={{ fontSize: 17, maxWidth: "48ch" }}>
            Five days. Five drops. New building blocks for taking AI
            applications from prototype to production. Unveiled live at{" "}
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
          ["Monday → Friday", "May 25–29, 2026"],
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
  // Cards arranged clockwise on a circle starting from the top (Day 01).
  // Coordinates are in the same SVG viewBox space (400×400) as the ring and
  // arrows so the layout stays aligned at any container width.
  const CENTER = 200;
  const CARD_RADIUS = 105;
  const ARROW_RADIUS = 150;
  const CARD_SIZE = 110;
  const CARD_HEIGHT = 132;
  const tilts = [-8, 6, -4, 8, -6];
  const cards = [0, 1, 2, 3, 4].map((i) => {
    const angle = (i * 72 * Math.PI) / 180;
    return {
      label: String(i + 1).padStart(2, "0"),
      cx: CENTER + CARD_RADIUS * Math.sin(angle),
      cy: CENTER - CARD_RADIUS * Math.cos(angle),
      rot: tilts[i],
    };
  });
  const arrows = [0, 1, 2, 3, 4].map((i) => {
    const angleDeg = i * 72 + 36;
    const angle = (angleDeg * Math.PI) / 180;
    return {
      x: CENTER + ARROW_RADIUS * Math.sin(angle),
      y: CENTER - ARROW_RADIUS * Math.cos(angle),
      rotation: angleDeg + 90,
    };
  });

  return (
    <div className="relative aspect-square w-full max-w-[440px] mx-auto hidden md:block">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full pointer-events-none"
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

        {/* loop ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ARROW_RADIUS}
          fill="none"
          stroke="var(--line-cta)"
          strokeDasharray="3 6"
          opacity="0.5"
        />

        {/* arrow heads between consecutive cards, pointing clockwise */}
        {arrows.map((a, i) => (
          <g
            key={i}
            transform={`translate(${a.x}, ${a.y}) rotate(${a.rotation})`}
          >
            <polygon points="0,-7 7,7 -7,7" fill="var(--line-cta)" />
          </g>
        ))}

        {/* Day cards — pure SVG so they scale with the viewBox */}
        {cards.map((c) => {
          const left = c.cx - CARD_SIZE / 2;
          const top = c.cy - CARD_HEIGHT / 2;
          return (
            <g
              key={c.label}
              transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
              filter="url(#lw5-card-shadow)"
            >
              <rect
                x={left}
                y={top}
                width={CARD_SIZE}
                height={CARD_HEIGHT}
                fill="white"
                stroke="var(--line-structure)"
              />
              <rect
                x={left}
                y={top}
                width={CARD_SIZE}
                height={CARD_SIZE}
                fill="var(--surface-1)"
              />
              <text
                x={c.cx}
                y={top + 58}
                textAnchor="middle"
                fontFamily="var(--font-analog), serif"
                fontWeight="500"
                fontSize="40"
                fill="var(--text-disabled)"
              >
                {c.label}
              </text>
              {/* lock icon */}
              <g
                transform={`translate(${c.cx - 6}, ${top + 75})`}
                fill="none"
                stroke="var(--text-tertiary)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="-2"
                  y="5"
                  width="16"
                  height="10"
                  rx="1.5"
                  fill="var(--surface-2)"
                />
                <path d="M2 5 V3 a4 4 0 0 1 8 0 V5" />
              </g>
              {/* caption */}
              <text
                x={c.cx}
                y={top + CARD_HEIGHT - 7}
                textAnchor="middle"
                fontFamily="var(--font-mono), monospace"
                fontSize="8"
                letterSpacing="0.8"
                fill="var(--text-tertiary)"
              >
                DAY {c.label}
              </text>
            </g>
          );
        })}

        <defs>
          <filter
            id="lw5-card-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.08"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function Day1Unveiling() {
  return (
    <section id="day-1" className="lw5-section pt-[80px] pb-10 scroll-mt-24">
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="lw5-eyebrow">Day 01 · Monday, May 25, 2026</div>
        <h2 className="lw5-h2 max-w-[26ch]">
          <span className="lw5-highlight">Experiments in CI/CD.</span>
        </h2>
        <p className="lw5-body">
          Run your Langfuse experiments inside GitHub Actions. The new action
          tests every pull request against a Langfuse dataset, fails the
          workflow when scores drop below the threshold you set, and posts the
          result back to the PR as a comment. Every run is tracked in Langfuse
          so you can dig into regressions later.
        </p>
      </div>

      <div className="w-full max-w-[920px] mb-8">
        <Video
          src="https://static.langfuse.com/docs-videos/ci-experiment.mp4"
          aspectRatio={16 / 9}
          className="rounded border border-line-structure"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-primary"
            href="/changelog/2026-05-25-experiment-ci-cd-gates"
          >
            <span>Read the changelog</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-secondary"
            href="/docs/evaluation/experiments/experiments-ci-cd"
          >
            <span>Get started in docs</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-secondary"
            href="https://github.com/langfuse/experiment-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View the action on GitHub</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
      </div>
    </section>
  );
}

function Day2Unveiling() {
  return (
    <section id="day-2" className="lw5-section pt-[80px] pb-10 scroll-mt-24">
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="lw5-eyebrow">Day 02 · Tuesday, May 26, 2026</div>
        <h2 className="lw5-h2 max-w-[26ch]">
          <span className="lw5-highlight">Langfuse agent skill.</span>
        </h2>
        <p className="lw5-body">
          Building an agent is easy. Getting it to production is hard. You set
          up tracing and evaluators, but how do you know what your agent's real
          failure modes are? How do you know your LLM-as-a-judge is actually
          calibrated against your human annotators?
        </p>
        <p className="lw5-body">
          The Langfuse Skill lets you hand your AI coding agent a playbook for
          working with Langfuse. It teaches Claude Code, Cursor, Codex, etc.
          how to instrument an app, query traces, manage prompts, and set up
          evaluators. Drop it into your editor, then describe the job in plain
          language and the agent runs with it.
        </p>
        <p className="lw5-body">
          In the video below, Marlies uses the{" "}
          <Link
            href="/guides/llm-as-a-judge-calibration-skill"
            className="text-text-primary font-medium border-b border-text-primary pb-px"
          >
            LLM-as-a-Judge calibration skill
          </Link>{" "}
          with Codex to produce a full analysis with accuracy, F1, precision,
          recall, and cost, all graphed directly in the new Langfuse
          Experiments view.
        </p>
      </div>

      <div className="w-full max-w-[920px] mb-8">
        <Video
          src="https://static.langfuse.com/docs-videos/agent-skills-launch.mp4"
          aspectRatio={16 / 9}
          className="rounded border border-line-structure"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-primary"
            href="/changelog/2026-05-26-langfuse-agent-skill"
          >
            <span>Read the changelog</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-secondary"
            href="/docs/api-and-data-platform/features/agent-skill"
          >
            <span>Get started in docs</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-secondary"
            href="https://github.com/langfuse/skills"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View skills on GitHub</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
      </div>
    </section>
  );
}

function DayCard({ day }: { day: DayCard }) {
  const live = Boolean(day.href);
  const content = (
    <div className="lw5-day-card h-full" data-state={live ? "live" : "locked"}>
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[.08em] text-text-tertiary">
          Day {day.n}
        </span>
        {live ? (
          <span className="lw5-pill lw5-pill-live">
            <span className="lw5-pulse" />
            Live
          </span>
        ) : (
          <span className="lw5-lock">
            <LockIcon />
          </span>
        )}
      </div>
      <div className="lw5-day-num">{day.n}</div>
      <div className="flex flex-col gap-0.5 mt-auto">
        <div className="text-[14px] text-text-primary font-medium">
          {day.weekday}
        </div>
        <div className="font-mono text-[11px] text-text-tertiary">
          {day.date}, 2026
        </div>
      </div>
      <div className="border-t border-line-structure pt-3 mt-1">
        <div
          className={`font-mono text-[11px] uppercase tracking-[.06em] ${live ? "text-text-primary" : "text-text-tertiary"}`}
        >
          {day.title ?? day.hint ?? "Stay tuned"}
        </div>
      </div>
    </div>
  );

  if (live && day.href) {
    return (
      <Link href={day.href} className="no-underline">
        {content}
      </Link>
    );
  }
  return content;
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
          We'll unwrap a new feature each day and update this page as each one
          ships. Subscribe to the newsletter or follow us so you don't miss a
          drop.
        </p>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {DAYS.map((day) => (
          <DayCard key={day.n} day={day} />
        ))}
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
        <Day2Unveiling />
        <Day1Unveiling />
      </div>
    </div>
  );
}
