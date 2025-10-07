import { PlayCircle, BarChart3, FileText, CheckCircle2 } from "lucide-react";

export const WALKTHROUGH_TABS = [
  {
    id: "intro",
    label: "Introduction",
    title: "Introduction to Langfuse",
    description:
      "Get an overview of the complete Langfuse platform and learn how it helps teams build better LLM applications through observability, prompt management, and evaluation.",
    icon: PlayCircle,
    videoId: "zzOlFH0iD0k",
    cta: "Any questions after watching this video? Consider watching the other videos, check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      { title: "Technical documentation", href: "/docs" },
      { title: "Why Langfuse?", href: "/why" },
      { title: "Interactive demo project", href: "/docs/demo" },
      { title: "Enterprise resources", href: "/enterprise" },
      {
        title: "Create a free Langfuse Cloud account",
        href: "https://cloud.langfuse.com",
      },
      { title: "Self-hosting documentation", href: "/self-hosting" },
      { title: "Talk to us", href: "/talk-to-us" },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    title: "LLM Observability & Tracing",
    description:
      "Learn how to trace, monitor, and debug your LLM applications with comprehensive observability features including traces, generations, and performance metrics.",
    icon: BarChart3,
    videoId: "pTneXS_m1rk",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title: "Introduction to LLM/Agent Observability",
        href: "/docs/observability",
      },
      {
        title: "Get started guide",
        href: "/docs/observability/get-started",
      },
      {
        title:
          "Integration overview (SDKs, Frameworks, Model providers, Gateways, OpenTelemetry)",
        href: "/integrations",
      },
      {
        title: "Observability data model",
        href: "/docs/observability/data-model",
      },
    ],
  },
  {
    id: "prompt",
    label: "Prompts",
    title: "Prompt Management & Engineering",
    description:
      "Discover how to manage, version, and optimize your prompts with collaborative editing, A/B testing, and seamless integration with your applications.",
    icon: FileText,
    videoId: "KGyj_NJgKDY",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title: "Introduction to Prompt Management",
        href: "/docs/prompt-management",
      },
      {
        title: "Get started guide",
        href: "/docs/prompt-management/get-started",
      },
    ],
  },
  {
    id: "evaluation",
    label: "Evaluation",
    title: "LLM Application Evaluation",
    description:
      "Explore how to systematically evaluate your LLM applications using datasets, scoring methods, and automated evaluation workflows to ensure quality and performance.",
    icon: CheckCircle2,
    videoId: "hlgfW0IyREc",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title:
          "Introduction to Evaluation (online/offline, evaluation methods)",
        href: "/docs/evaluation",
      },
    ],
  },
];
