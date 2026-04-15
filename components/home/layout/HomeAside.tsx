"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnchorProvider, useActiveAnchors } from "fumadocs-core/toc";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import TocCommunity from "@/components/TocCommunity";
import { useAISearchContext } from "@/components/inkeep/search";

// ─── Types ────────────────────────────────────────────────────────────────────

type TocItem = { id: string; title: string; depth: number; url: string };

// ─── Static section list for the homepage ────────────────────────────────────

const HOME_SECTIONS: TocItem[] = [
  { id: "overview", title: "Overview", depth: 2, url: "#overview" },
  { id: "llm-engineering-loop", title: "LLM Engineering Loop", depth: 2, url: "#llm-engineering-loop" },
  { id: "platform-features", title: "Platform Features", depth: 2, url: "#platform-features" },
  { id: "integrations", title: "Integrations", depth: 2, url: "#integrations" },
  { id: "open-source", title: "Open Platform. Open Souce.", depth: 2, url: "#open-source" },
  { id: "developers-agents", title: "Developers & Agents", depth: 2, url: "#developers-agents" },
  { id: "scale-and-security", title: "Scale & Security", depth: 2, url: "#scale-and-security" },
  { id: "why-langfuse", title: "Why Langfuse", depth: 2, url: "#why-langfuse" },
  { id: "get-started", title: "Get Started", depth: 2, url: "#get-started" },
  { id: "faq", title: "FAQ", depth: 2, url: "#faq" },
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
    <div className="flex-1 px-4 py-4 min-h-0">
      <Text size="s" className="block text-left font-[580] text-text-primary mb-3 -ml-1.5">
        On this page
      </Text>

      <div className="relative flex flex-col overflow-auto [scrollbar-width:none]">
        {/* Static track */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-line-structure" />

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
                onClick={(e) => {
                  const target = document.getElementById(item.id);
                  if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
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

// ─── Main aside ───────────────────────────────────────────────────────────────

export function HomeAside() {
  const pathname = usePathname();
  const domItems = useDOMHeadings();
  const items = pathname === "/" ? HOME_SECTIONS : domItems;
  const { open: aiOpen } = useAISearchContext();

  return (
    <aside
      data-ai-open={aiOpen || undefined}
      className="hidden wide:flex wide:data-ai-open:hidden flex-col bg-line-structure sticky p-px pt-0 w-[240px] shrink-0"
      style={{
        top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height))",
        height: "calc(100vh - var(--fd-banner-height, 0px) - var(--lf-nav-primary-height))",
      }}
    >
      <nav className="flex overflow-y-auto overflow-x-hidden flex-col flex-1 gap-4 rounded-sm bg-surface-1">
        <AnchorProvider toc={items} single>
          <TocOnThisPage items={items} />
        </AnchorProvider>
        <TocCommunity className="border-t border-line-structure" />
      </nav>
    </aside>
  );
}
