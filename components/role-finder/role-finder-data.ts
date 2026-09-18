/**
 * Role-finder quiz configuration — edit this file to change questions, roles,
 * branching, pitches, or bullets. No engine code needs to be touched.
 *
 * How live job-board sync works:
 *   Each role has `titleMatch` fragments. The server component (`./index.tsx`)
 *   fetches listed ClickHouse jobs whose title contains "langfuse" (plus any
 *   jobs still on the Langfuse board) and matches them by those fragments.
 *   Live title + apply URL are merged in; unmatched roles are marked closed.
 *   The `title` and `url` below are only fallbacks used if the board can't be
 *   fetched. The `pitch`, `youll` bullets, questions, and tree are curated
 *   content that lives only here.
 *
 * To add a role: add an entry to ROLES (with title-match terms) and route to
 * it from the TREE via `{ result: "<key>" }`. To remove one: delete it from
 * ROLES and remove any options that point at it.
 */

import {
  LANGFUSE_CAREERS_BOARD_URL,
  type RoleTitleMatch,
} from "@/lib/ashby-jobs";
import { formatSdkInstallsPerMonth } from "@/lib/usage-stats";

export type RoleKey =
  | "product"
  | "growth"
  | "integrations"
  | "sdk"
  | "data_infra"
  | "iam_billing"
  | "cloud"
  | "devrel";

export type Role = {
  /** Optional Ashby posting id — used when it still matches a live posting. */
  ashbyId?: string;
  /** Title fragments used to match a live ClickHouse/Langfuse posting. */
  titleMatch: RoleTitleMatch;
  /** Fallback title (used only if the live board can't be fetched). */
  title: string;
  /** Fallback apply URL (used only if the live board can't be fetched). */
  url: string;
  /** One-line pitch for the role. */
  pitch: string;
  /** "What you'll do" bullets (3 recommended). */
  youll: string[];
};

/** A result leaf in the tree: the recommended role + optional caveats/alternates. */
export type QuizResult = {
  result: RoleKey;
  /** Honest caveat shown on the result screen. */
  note?: string;
  /** Secondary roles surfaced under "also worth a look". */
  also?: RoleKey[];
};

/** An answer option: advances to another question id, or ends on a result. */
export type Option = {
  label: string;
  next: string | QuizResult;
};

export type Question = {
  q: string;
  options: Option[];
};

export const ROOT_QUESTION_ID = "start";

/** General careers board, used as a fallback when a specific role has closed. */
export const CAREERS_FALLBACK_URL = LANGFUSE_CAREERS_BOARD_URL;

export const ROLES: Record<RoleKey, Role> = {
  product: {
    titleMatch: {
      anyOf: ["product engineer"],
      exclude: ["growth", "integration", "marketing"],
    },
    title: "Senior Product Engineer",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Build user-facing features end-to-end in TypeScript/React, with taste for UI detail, API design, and clear docs.",
    youll: [
      "Ship products from scratch end-to-end",
      "Own projects with strong conviction",
      "Care deeply about developer experience & UI craft",
    ],
  },
  growth: {
    titleMatch: { anyOf: ["growth"] },
    title: "Senior Product Engineer (Growth)",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Full-stack product work aimed at product-led growth — experiments, activation, conversion, backed by SQL analytics.",
    youll: [
      "Run experiments across many topics",
      "Think like a user and like the business",
      "Ship FE+BE changes and query the data yourself",
    ],
  },
  integrations: {
    titleMatch: { anyOf: ["integration"] },
    title: "Senior Product Engineer (Integrations)",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Own the first impression across 40+ framework integrations (LangChain, Vercel AI SDK, LlamaIndex, Pydantic AI…).",
    youll: [
      "Build real apps with LLM frameworks",
      "Obsess over the getting-started experience",
      "Write clean Python and/or TypeScript",
    ],
  },
  sdk: {
    titleMatch: { anyOf: ["sdk"] },
    title: "Senior Software Engineer (SDK)",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch: `Build SDKs downloaded ${formatSdkInstallsPerMonth()} times/month. Performance, versioning, and DX in code that runs in other people's production.`,
    youll: [
      "Profile & minimize overhead in hot paths",
      "Think about versioning & backwards compatibility",
      "Python + TypeScript, ideally OpenTelemetry",
    ],
  },
  data_infra: {
    titleMatch: {
      anyOf: ["data infrastructure", "backend"],
      exclude: ["iam", "billing", "cloud"],
    },
    title: "Senior Backend Engineer (Data Infrastructure)",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Make Langfuse fast and affordable at scale — own the ingestion pipeline and optimize ClickHouse data models & queries.",
    youll: [
      "Get excited about database internals & query optimization",
      "Work with a ton of data",
      "TypeScript + SQL; ClickHouse/OLAP a plus",
    ],
  },
  iam_billing: {
    titleMatch: {
      anyOf: ["iam", "billing", "backend"],
      exclude: ["data infrastructure", "cloud"],
    },
    title: "Senior Backend Engineer (IAM & Billing)",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Own the platform every team depends on: authentication, authorization, and usage-based billing.",
    youll: [
      "Build SSO/SAML, OAuth, RBAC, API keys",
      "Integrate billing/metering (Stripe or similar)",
      "Reason about security & multi-tenant edge cases",
    ],
  },
  cloud: {
    titleMatch: { anyOf: ["cloud"] },
    title: "Senior Cloud Infrastructure Engineer",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "Operate Langfuse Cloud on AWS ECS Fargate + ClickHouse Cloud, and own the self-hosted Helm/Docker story.",
    youll: [
      "Run production workloads on AWS",
      "Container orchestration + infra-as-code (Terraform/Pulumi)",
      "Build monitoring/alerts that actually catch problems",
    ],
  },
  devrel: {
    titleMatch: { anyOf: ["devrel", "developer relations"] },
    title: "DevRel Engineer",
    url: LANGFUSE_CAREERS_BOARD_URL,
    pitch:
      "An engineer who educates through content — powering developer relations and thought leadership in LLM ops.",
    youll: [
      "Create content & documentation",
      "Engage the global user base",
      "Have taste in good content; OSS & AI-eng a big plus",
    ],
  },
};

export const TREE: Record<string, Question> = {
  start: {
    q: "When you imagine your ideal week at Langfuse, what are you doing most?",
    options: [
      {
        label: "Shipping features users see and touch",
        next: "product_focus",
      },
      {
        label: "Going deep on backend systems, data, and reliability",
        next: "systems_focus",
      },
      {
        label: "Making it effortless for other devs to use our tools",
        next: "devtools_focus",
      },
      {
        label: "Teaching, writing, and growing a developer community",
        next: "content_focus",
      },
    ],
  },

  product_focus: {
    q: "Within product work, what pulls you most?",
    options: [
      {
        label: "Owning a feature end-to-end, with real craft in the UI",
        next: { result: "product" },
      },
      {
        label: "Moving growth metrics — activation, conversion, experiments",
        next: "growth_sql",
      },
      {
        label: "The AI/LLM framework ecosystem and great first-run experiences",
        next: { result: "integrations" },
      },
    ],
  },
  growth_sql: {
    q: "How hands-on are you with SQL and product analytics?",
    options: [
      {
        label: "Very — I dig into funnels and write the queries myself",
        next: { result: "growth" },
      },
      {
        label: "Comfortable, but I'd rather spend my time building features",
        next: {
          result: "product",
          note: "Growth needs heavy SQL/analytics ownership — Product Engineer is the cleaner fit.",
        },
      },
    ],
  },

  systems_focus: {
    q: "Which systems problem excites you most?",
    options: [
      {
        label: "Massive data, query optimization, making dashboards instant",
        next: "data_depth",
      },
      {
        label:
          "Auth, billing & multi-tenant security — the platform others build on",
        next: { result: "iam_billing" },
      },
      {
        label: "Running production reliably — cloud, containers, IaC, on-call",
        next: { result: "cloud" },
      },
    ],
  },
  data_depth: {
    q: "How close is your experience to analytical data at scale (ClickHouse, BigQuery, Kafka, Spark, OLAP…)?",
    options: [
      {
        label: "That's my wheelhouse",
        next: { result: "data_infra" },
      },
      {
        label: "Not there yet, but database internals genuinely excite me",
        next: {
          result: "data_infra",
          note: "Strong interest counts — ClickHouse experience is a plus, not a hard requirement.",
        },
      },
      {
        label: "More general/platform backend than data-at-scale",
        next: {
          result: "iam_billing",
          note: "Sounds more like platform backend than the data-infra shape.",
        },
      },
    ],
  },

  devtools_focus: {
    q: "What's your sweet spot when building for other developers?",
    options: [
      {
        label:
          "Rock-solid SDKs / client libraries — performance, versioning, DX",
        next: "sdk_lang",
      },
      {
        label: "Wiring up framework integrations across the LLM ecosystem",
        next: { result: "integrations" },
      },
      {
        label:
          "I love building them, but most enjoy talking/writing about them publicly",
        next: "content_focus",
      },
    ],
  },
  sdk_lang: {
    q: "Where are you strongest?",
    options: [
      {
        label:
          "Python and/or TypeScript, with real performance-profiling chops",
        next: { result: "sdk" },
      },
      {
        label:
          "I know the LLM frameworks deeply and love the integration surface",
        next: {
          result: "integrations",
          note: "Framework breadth points to Integrations over core SDK.",
        },
      },
    ],
  },

  content_focus: {
    q: "How central is creating technical content to the job you want?",
    options: [
      {
        label: "It's the main thing — content & community is what energizes me",
        next: { result: "devrel" },
      },
      {
        label: "I create some, but I'd rather build product day-to-day",
        next: {
          result: "product",
          note: "If content is a side-effect rather than the job, Product Engineer fits better.",
          also: ["devrel"],
        },
      },
      {
        label: "I'm strongest on OSS and integrations specifically",
        next: { result: "integrations", also: ["devrel"] },
      },
    ],
  },
};
