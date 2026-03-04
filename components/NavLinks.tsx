"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
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
  { name: "Users", href: "/users" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden overflow-x-auto gap-4 items-center nextra-scrollbar ml:auto md:flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 py-1.5 text-sm whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
          <DropdownMenuTrigger className="flex items-center gap-1 px3- py-1.5 text-sm font-medium whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
            className="py-1.5 text-sm font-normal whitespace-nowrap ring-inset text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background border-b shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="px-4 py-4 flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pt-1 pb-2">Product</p>
            {productLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-accent rounded-md dark:text-gray-300"
              >
                {link.name}
              </Link>
            ))}

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pt-4 pb-2">Resources</p>
            {resourcesLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm text-gray-700 hover:bg-accent rounded-md dark:text-gray-300"
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t mt-3 pt-3 flex flex-col gap-1">
              {simpleLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-accent rounded-md dark:text-gray-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
