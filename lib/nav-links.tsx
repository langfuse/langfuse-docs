import {
  Activity,
  BarChart2,
  Bookmark,
  FlaskConical,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Map,
  MessageSquare,
  Newspaper,
  ScrollText,
  Users,
} from "lucide-react";

export type NavPanelLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export const productLinks: NavPanelLink[] = [
  { name: "Overview",          href: "/docs",                            icon: LayoutGrid    },
  { name: "LLM Observability", href: "/docs/observability/overview",     icon: Activity      },
  { name: "Prompt Management", href: "/docs/prompt-management/overview", icon: MessageSquare },
  { name: "Evaluation",        href: "/docs/evaluation/overview",        icon: FlaskConical  },
  { name: "Metrics",           href: "/docs/metrics/overview",           icon: BarChart2     },
];

export const resourcesLinks: NavPanelLink[] = [
  { name: "Blog",            href: "/blog",         icon: Newspaper     },
  { name: "Changelog",       href: "/changelog",    icon: ScrollText    },
  { name: "Roadmap",         href: "/docs/roadmap", icon: Map           },
  { name: "Users",           href: "/users",        icon: Users         },
  { name: "Example Project", href: "/docs/demo",    icon: Bookmark      },
  { name: "Walkthroughs",    href: "/guides",       icon: GraduationCap },
  { name: "Support",         href: "/support",      icon: HelpCircle    },
];

export const simpleLinks = [
  { name: "Docs",      href: "/docs"      },
  { name: "Changelog", href: "/changelog", tabletHidden: true },
  { name: "Pricing",   href: "/pricing"   },
];
