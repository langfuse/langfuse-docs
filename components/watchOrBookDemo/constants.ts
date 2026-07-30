import { PlayCircle, BarChart3, FileText, CheckCircle2 } from "lucide-react";

export const EXAMPLE_PROJECT_CTA = {
  title: "Try the Langfuse example project",
  href: "/docs/demo",
};

export const WALKTHROUGH_TABS = [
  {
    id: "intro",
    label: "Introduction",
    title: "Introduction to Langfuse",
    description:
      "Get an overview of the complete Langfuse platform and learn how it helps teams build better LLM applications through observability, prompt management, and evaluation.",
    icon: PlayCircle,
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
    docs: {
      title: "Evaluation documentation",
      href: "/docs/evaluation",
    },
  },
];
