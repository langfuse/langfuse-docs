/**
 * Data for the "How we work" section on the careers page.
 *
 * Shared between the React section (`HowWeWorkSection.tsx`) and the plain
 * Markdown renderer (`lib/markdown-component-renderers.js`) so the rendered
 * page and the Markdown output stay in sync.
 *
 * Artifact facts (titles, counts, diff stats) are copied from the real
 * artifacts they cite; update them together with the linked URLs.
 */

export type HowWeWorkStepId = "customer" | "rfc" | "build" | "ship" | "offsite";

export interface HowWeWorkStep {
  id: HowWeWorkStepId;
  number: number;
  label: string;
  /** Short bold caption on the tile (3–7 words). */
  caption: string;
  /** One-sentence explanation used in the Markdown output. */
  description: string;
  /** Handbook page the whole tile links to. */
  href: string;
  /** Real artifact backing the visual, cited in the Markdown output. */
  artifactLabel?: string;
  artifactUrl?: string;
}

export const HOW_WE_WORK_EYEBROW = "How we work";

export const HOW_WE_WORK_HEADLINE =
  "You own it from the customer call to the launch.";

export const HOW_WE_WORK_SUBTITLE =
  "How engineers work at Langfuse, told through one real feature: the evals revamp.";

export const howWeWorkSteps: HowWeWorkStep[] = [
  {
    id: "customer",
    number: 1,
    label: "Customer",
    caption: "Features start with customer calls",
    description:
      "We discuss features with customers before we build them — the evals revamp started in a public GitHub discussion.",
    href: "/handbook/chapters/customers",
    artifactLabel: "GitHub discussion",
    artifactUrl: "https://github.com/orgs/langfuse/discussions/11023",
  },
  {
    id: "rfc",
    number: 2,
    label: "RFC",
    caption: "Async RFC, one intense discussion",
    description:
      "An async RFC goes to the whole team, then we debate the most important points in one intense sync discussion.",
    href: "/handbook/product-engineering/how-we-work/roadmapping",
  },
  {
    id: "build",
    number: 3,
    label: "Build",
    caption: "Then you build. A lot.",
    description: "Then you code — whatever the feature needs.",
    href: "/handbook/product-engineering/how-we-work/how-we-ship",
    artifactLabel: "merged PR",
    artifactUrl: "https://github.com/langfuse/langfuse/pull/15906",
  },
  {
    id: "ship",
    number: 4,
    label: "Ship",
    caption: "Launch it with the GTM team",
    description:
      "You ship it with the GTM team: launch prep, changelog post, marketing materials.",
    href: "/handbook/product-engineering/playbooks/releases",
    artifactLabel: "changelog post",
    artifactUrl: "/changelog/2026-08-22-reusable-evaluators-and-rules",
  },
  {
    id: "offsite",
    number: 5,
    label: "Offsite",
    caption: "Meet the team in Tokyo",
    description:
      "And you fly to a team offsite in a place like Tokyo or Berlin to meet everyone in person.",
    href: "/handbook/how-we-work/remote",
  },
];

/** Facts shown inside the tile visuals; copied from the cited artifacts. */
export const howWeWorkVisualFacts = {
  discussion: {
    title:
      'How to extract dynamic "last user message" from chat history for Evaluation?',
    source: "github.com/orgs/langfuse",
    upvotes: 1,
    comments: 4,
  },
  rfc: {
    title: "RFC: Evals revamp",
    source: "RFC · async review",
    status: "Open for comments",
    // Neutral roles, not names; representative comment text.
    threads: [
      { author: "Engineer", text: "Can evaluators be reused across runs?" },
      { author: "Designer", text: "Show pass rate before going live." },
    ],
  },
  pullRequest: {
    title: "feat(evals): new evaluation UX",
    source: "github.com/langfuse/langfuse",
    number: 15906,
    additions: "+52,651",
    deletions: "−11,684",
    commits: 103,
  },
  changelog: {
    title: "Set up production evaluations with ease",
    source: "langfuse.com/changelog",
    date: "Aug 22, 2026",
    checklist: ["Changelog post", "Launch video", "Social + newsletter"],
  },
  offsite: {
    // Placeholder frame; swap in a real team photo via next/image when
    // one is provided (no stock, no AI-generated people).
    title: "Team photo — Tokyo offsite",
  },
};

export const howWeWorkCtas = [
  { label: "Read the whole handbook", href: "/handbook" },
  {
    label: "How we hire, step by step",
    href: "/handbook/how-we-hire",
  },
];
