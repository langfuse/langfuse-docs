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
        <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
        <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
          className="px-3 py-1.5 text-sm font-medium whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
