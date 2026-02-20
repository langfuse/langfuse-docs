"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const productLinks = [
  { name: "Overview", href: "/" },
  { name: "LLM Observability", href: "/docs/observability/overview" },
  { name: "Prompt Management", href: "/docs/prompt-management/overview" },
  { name: "Evaluation", href: "/docs/evaluation/overview" },
  { name: "Metrics", href: "/docs/metrics/overview" },
];

const resourcesLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Changelog", href: "/changelog" },
  { name: "Roadmap", href: "/docs/roadmap" },
  { name: "Customers", href: "/customers" },
  { name: "Example Project", href: "/docs/demo" },
  { name: "Walkthroughs", href: "/guides" },
  { name: "Support", href: "/support" },
];

const simpleLinks = [
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
  { name: "Pricing", href: "/pricing" },
];

export function NavLinks() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none">
          Product
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {productLinks.map((link) => (
            <DropdownMenuItem key={link.name} asChild>
              <Link href={link.href}>{link.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none">
          Resources
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {resourcesLinks.map((link) => (
            <DropdownMenuItem key={link.name} asChild>
              <Link href={link.href}>{link.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {simpleLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
