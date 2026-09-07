import {
  Activity,
  BarChart2,
  BookOpen,
  Bookmark,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Map,
  MessageSquare,
  Newspaper,
  Presentation,
  ScrollText,
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
    name: "Agent Observability",
    href: "/docs/observability",
    icon: Activity,
  },
  {
    name: "Prompt Management",
    href: "/docs/prompt-management",
    icon: MessageSquare,
  },
  { name: "Agent Evals", href: "/docs/evaluation", icon: FlaskConical },
  { name: "Agent Analytics", href: "/docs/metrics", icon: BarChart2 },
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

export const simpleLinks = [
  { name: "Customers", href: "/users" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog", tabletHidden: true },
  { name: "Pricing", href: "/pricing" },
];
