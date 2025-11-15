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
    docs: {
      title: "Technical documentation",
      href: "/docs",
    },
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
    docs: {
      title: "Observability documentation",
      href: "/docs/observability",
    },
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
    docs: {
      title: "Prompt Management documentation",
      href: "/docs/prompt-management",
    },
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
    docs: {
      title: "Evaluation documentation",
      href: "/docs/evaluation",
    },
  },
];
