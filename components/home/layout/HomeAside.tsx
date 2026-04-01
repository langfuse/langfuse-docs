"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnchorProvider, useActiveAnchors } from "fumadocs-core/toc";
import { Github } from "lucide-react";
import InkeepChatButton from "@/components/inkeep/InkeepChatButton";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type TocItem = { id: string; title: string; depth: number; url: string };

// ─── Static section list for the homepage ────────────────────────────────────

const HOME_SECTIONS: TocItem[] = [
  { id: "features",        title: "Features",         depth: 2, url: "#features" },
  { id: "demo",            title: "Demo",             depth: 2, url: "#demo" },
  { id: "all-the-tools",   title: "Platform",         depth: 2, url: "#all-the-tools" },
  { id: "integrations",    title: "Integrations",     depth: 2, url: "#integrations" },
  { id: "open-source",     title: "Open Source",      depth: 2, url: "#open-source" },
  { id: "developer-tools", title: "Developer Tools",  depth: 2, url: "#developer-tools" },
  { id: "enterprise",      title: "Security",         depth: 2, url: "#enterprise" },
  { id: "why-langfuse",    title: "Why Langfuse",     depth: 2, url: "#why-langfuse" },
  { id: "quickstart",      title: "Quickstart",       depth: 2, url: "#quickstart" },
  { id: "faq",             title: "FAQ",              depth: 2, url: "#faq" },
];

// ─── Scan DOM for h2/h3 headings (non-homepage pages) ────────────────────────

function useDOMHeadings(): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      const headings = Array.from(document.querySelectorAll("h2[id], h3[id]"))
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
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── "On this page" TOC ───────────────────────────────────────────────────────

function TocOnThisPage({ items }: { items: TocItem[] }) {
  const active = useActiveAnchors();
  const activeId = active[0] ?? null;
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null;
    if (!el) return;
    setIndicatorStyle({ top: el.offsetTop, height: el.offsetHeight });
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <div className="flex-1 min-h-0">
      <Text size="s" className="block text-left font-medium text-text-primary mb-3">
        On this page
      </Text>

      <div className="relative flex flex-col overflow-auto [scrollbar-width:none]">
        {/* Static track */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-line-structure" />

        {/* Snake indicator */}
        {indicatorStyle && (
          <div
            className="absolute left-0 w-0.5 bg-text-primary"
            style={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
              transition: "top 0.2s cubic-bezier(0.4,0,0.2,1), height 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        )}

        <div ref={listRef} className="flex flex-col">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.url}
                href={item.url}
                data-id={item.id}
                className={cn(
                  "py-1.5 ps-3 transition-colors duration-150 wrap-anywhere",
                  item.depth === 3 ? "ps-6" : item.depth >= 4 ? "ps-8" : "ps-3",
                  isActive ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                )}
              >
                <Text size="s" className="text-left text-inherit">
                  {item.title}
                </Text>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Community section ────────────────────────────────────────────────────────

function TocCommunity() {
  return (
    <div className="pt-4 border-t border-dashed border-line-divider-dash">
      <Text size="s" className="block text-left font-medium text-text-primary mb-3">
        Community
      </Text>
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
      <nav className="flex flex-col flex-1 gap-4 px-4 py-4 rounded-sm bg-surface-1 overflow-y-auto overflow-x-hidden">
        <AnchorProvider toc={items} single>
          <TocOnThisPage items={items} />
        </AnchorProvider>
        <TocCommunity />
      </nav>
    </aside>
  );
}
