import {
  Activity,
  BarChart2,
  Bot,
  BookOpen,
  Bookmark,
  Code2,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Map,
  MessageSquare,
  Network,
  Newspaper,
  Presentation,
  ScrollText,
  Workflow,
  HeartPulse,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export type NavPanelLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const productLinks: NavPanelLink[] = [
  { name: "Overview", href: "/docs", icon: LayoutGrid },
  {
    name: "AI Observability",
    href: "/docs/observability/overview",
    icon: Activity,
  },
  {
    name: "Prompt & Skill Management",
    href: "/docs/prompt-and-skill-management/overview",
    icon: MessageSquare,
  },
  { name: "Evaluation", href: "/docs/evaluation/overview", icon: FlaskConical },
  { name: "Metrics", href: "/docs/metrics/overview", icon: BarChart2 },
  { name: "AI Gateway", href: "/docs/gateway/overview", icon: Network },
];

export type NavCta = {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const productCtas: NavCta[] = [
  {
    title: "Get started with tracing",
    description: "Ingest your first trace with OpenAI, LangChain, or the SDKs.",
    cta: "Read docs",
    href: "/docs/observability/get-started",
    icon: Activity,
  },
  {
    title: "Set up AI Gateway",
    description:
      "Route OpenAI and Anthropic calls through Langfuse, with no code changes.",
    cta: "Read setup guide",
    href: "/docs/gateway/get-started/admin-setup",
    icon: Network,
    badge: "New",
  },
];

export const resourcesLinks: NavPanelLink[] = [
  { name: "Academy", href: "/academy", icon: BookOpen },
  { name: "Workshop", href: "/workshop", icon: Presentation },
  { name: "Blog", href: "/blog", icon: Newspaper },
  { name: "Changelog", href: "/changelog", icon: ScrollText },
  { name: "Roadmap", href: "/docs/roadmap", icon: Map },
  { name: "Example Project", href: "/docs/demo", icon: Bookmark },
  { name: "Walkthroughs", href: "/guides", icon: GraduationCap },
  { name: "Support", href: "/support", icon: HelpCircle },
];

export const useCaseLinks: NavPanelLink[] = [
  { name: "Chat agents", href: "/chat-agents", icon: Bot },
  { name: "Coding agents", href: "/coding-agents", icon: Code2 },
  { name: "Workflow automation", href: "/workflow-automation", icon: Workflow },
];

export const industryLinks: NavPanelLink[] = [
  {
    name: "Financial Services",
    href: "/financial-services",
    icon: Landmark,
  },
  {
    name: "Healthcare and life sciences",
    href: "/healthcare",
    icon: HeartPulse,
  },
];

export const simpleLinks = [
  { name: "Customers", href: "/users" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog", tabletHidden: true },
  { name: "Pricing", href: "/pricing" },
];
