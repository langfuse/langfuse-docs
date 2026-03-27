"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnchorProvider, useActiveAnchors } from "fumadocs-core/toc";
import { Github } from "lucide-react";
import InkeepChatButton from "@/components/inkeep/InkeepChatButton";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type TocItem = { id: string; title: string; depth: number; url: string };

// ─── Static section list for the homepage ────────────────────────────────────

const HOME_SECTIONS: TocItem[] = [
  { id: "features", title: "Features", depth: 2, url: "#features" },
  { id: "platform", title: "Platform", depth: 2, url: "#platform" },
  { id: "integrations", title: "Integrations", depth: 2, url: "#integrations" },
  { id: "open-source", title: "Open Source", depth: 2, url: "#open-source" },
  { id: "security", title: "Security", depth: 2, url: "#security" },
  { id: "customers", title: "Customers", depth: 2, url: "#customers" },
  { id: "pricing", title: "Pricing", depth: 2, url: "#pricing" },
  { id: "community", title: "Community", depth: 2, url: "#community" },
];

// ─── Scan DOM for h2/h3 headings (non-homepage pages) ────────────────────────

function useDOMHeadings(): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll("h2[id], h3[id]")
      )
        .map((el) => ({
          id: el.id,
          url: `#${el.id}`,
          title: el.textContent?.trim() ?? "",
          depth: parseInt(el.tagName[1]),
        }))
        .filter((h) => h.title);
      setItems(headings);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return items;
}

// ─── X / Twitter icon ────────────────────────────────────────────────────────

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── "On this page" TOC (requires AnchorProvider context) ────────────────────

function TocOnThisPage({ items }: { items: TocItem[] }) {
  const active = useActiveAnchors();
  if (items.length === 0) return null;

  return (
    <div className="flex-1 min-h-0">
      <p className="mb-2 text-sm font-semibold text-text-primary">On this page</p>
      <div className="flex flex-col border-l border-line-structure ms-px overflow-auto [scrollbar-width:none]">
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className={[
              "py-1.5 text-sm transition-colors wrap-anywhere first:pt-0 last:pb-0",
              item.depth === 3 ? "ps-6" : item.depth >= 4 ? "ps-8" : "ps-3",
              active.includes(item.id)
                ? "text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            ].join(" ")}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Community section ────────────────────────────────────────────────────────

function TocCommunity() {
  return (
    <div className="pt-4 border-t border-dashed border-text-links">
      <p className="mb-2 text-sm font-semibold text-text-primary">Community</p>
      <div className="flex gap-3 items-center">
        <Link
          href="https://github.com/langfuse"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors text-text-tertiary hover:text-text-primary"
          aria-label="GitHub"
        >
          <Github size={18} />
        </Link>
        <Link
          href="https://x.com/langfuse"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors text-text-tertiary hover:text-text-primary"
          aria-label="X / Twitter"
        >
          <XIcon className="size-[17px]" />
        </Link>
        <div className="ml-auto">
          <InkeepChatButton />
        </div>
      </div>
    </div>
  );
}

// ─── Main aside ───────────────────────────────────────────────────────────────

export function HomeAside() {
  const pathname = usePathname();
  const domItems = useDOMHeadings();
  const items = pathname === "/" ? HOME_SECTIONS : domItems;

  return (
    <aside className="hidden lg:flex flex-col bg-line-structure sticky top-16 h-[calc(100vh-4rem)] p-px pt-0 w-[240px] shrink-0">
      <nav className="flex flex-col flex-1 gap-1 px-2.5 py-3 rounded-sm bg-surface-1">
        <AnchorProvider toc={items} single>
          <TocOnThisPage items={items} />
        </AnchorProvider>
        <TocCommunity />
      </nav>
    </aside>
  );
}
