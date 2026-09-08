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
  Newspaper,
  Presentation,
  ScrollText,
  Workflow,
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
    name: "LLM Observability",
    href: "/docs/observability/overview",
    icon: Activity,
  },
  {
    name: "Prompt Management",
    href: "/docs/prompt-management/overview",
    icon: MessageSquare,
  },
  { name: "Evaluation", href: "/docs/evaluation/overview", icon: FlaskConical },
  { name: "Metrics", href: "/docs/metrics/overview", icon: BarChart2 },
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

export const simpleLinks = [
  { name: "Customers", href: "/users" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog", tabletHidden: true },
  { name: "Pricing", href: "/pricing" },
];
