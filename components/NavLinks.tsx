"use client";

import { Link } from "@/components/ui/link";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { CornerBox, HoverCorners } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import { productLinks, resourcesLinks, simpleLinks } from "@/lib/nav-links";
import type { NavPanelLink } from "@/lib/nav-links";
import type { SectionNavData } from "@/lib/nav-tree";

// ── Nav trigger style ─────────────────────────────────────────────────────────

const navTriggerClassName =
  "flex items-center gap-1 py-1.5 whitespace-nowrap ring-inset font-sans text-[13px] font-[430] leading-[1.2] tracking-[-0.26px] [text-shadow:0_0_0_#B5AFEA] text-text-tertiary hover:text-text-secondary hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// ── Featured card ─────────────────────────────────────────────────────────────

type FeaturedItem = {
  image: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
};

const productFeatured: FeaturedItem = {
  image: (
    <div className="flex justify-center items-center px-5 h-full">
      <div className="px-4 py-3 w-full rounded border shadow-sm border-line-structure bg-surface-1">
        <div className="mb-2 flex items-center gap-1.5">
          <div className="rounded-full size-2 bg-line-structure" />
          <span className="font-sans text-[10px] font-semibold text-text-tertiary tracking-tight">langfuse</span>
        </div>
        <p className="font-sans text-[11px] font-semibold text-text-primary leading-snug">
          Get Started with Tracing
        </p>
        <p className="mt-1 font-sans text-[10px] text-text-tertiary leading-relaxed">
          Step-by-step guide to ingesting your first trace using OpenAI, LangChain, or the SDKs.
        </p>
      </div>
    </div>
  ),
  title: "Get Started with Tracing",
  description: "This guide walks you through ingesting your first trace.",
  cta: "Read docs",
  href: "/docs/get-started",
};

const resourcesFeatured: FeaturedItem = {
  image: (
    <div className="flex flex-col gap-3 justify-center items-center px-6 h-full">
      <div className="flex gap-0 items-center w-full">
        <div className="flex flex-1 justify-center items-center py-3 rounded border border-line-structure bg-surface-1">
          <span className="font-sans text-[11px] font-semibold text-text-secondary tracking-tight">langfuse</span>
        </div>
        <div className="w-4 border-t shrink-0 border-line-structure" />
        <div className="flex flex-1 justify-center items-center py-3 rounded border border-line-structure bg-surface-1">
          <span className="font-sans text-[11px] font-semibold text-text-secondary tracking-tight">ClickHouse</span>
        </div>
      </div>
    </div>
  ),
  title: "Langfuse joins ClickHouse",
  description: "Our goal continues to be building the best LLM engineering platform",
  cta: "Read story",
  href: "/blog/clickhouse",
};

// ── Featured card component ───────────────────────────────────────────────────

function NavFeaturedCard({ featured }: { featured: FeaturedItem }) {
  return (
    <Link href={featured.href} className="flex flex-col h-full no-underline group/card">
      <div className="relative w-full h-[140px] with-stripes border-b border-line-structure overflow-hidden shrink-0">
        {featured.image}
      </div>
      <div className="flex flex-col flex-1 gap-2 p-4">
        <p className="font-sans text-[13px] font-semibold leading-snug text-text-primary">
          {featured.title}
        </p>
        <p className="font-sans text-[12px] leading-relaxed text-text-tertiary">
          {featured.description}
        </p>
        <span className="mt-auto font-mono text-[11px] text-text-tertiary group-hover/card:text-text-secondary transition-colors">
          {featured.cta}
        </span>
      </div>
    </Link>
  );
}

// ── Mega dropdown panel ────────────────────────────────────────────────────────

function NavDropdownPanel({
  links,
  featured,
}: {
  links: NavPanelLink[];
  featured: FeaturedItem;
}) {
  return (
    <CornerBox className="flex p-0 min-w-max bg-surface-1">
      <div className="group/dropdown flex flex-col gap-[6px] border-r border-line-structure min-w-[220px] p-3.5 overflow-hidden">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex relative gap-3 items-center p-1 no-underline transition-colors link-box group group/link hover:bg-surface-bg"
            >
              <HoverCorners />
              <Icon className="size-[15px] shrink-0 text-text-tertiary transition-colors group-hover/dropdown:text-text-disabled group-hover/dropdown:group-hover/link:text-text-tertiary" />
              <span className="font-sans text-[13px] font-[430] leading-[1.2] tracking-[-0.26px] text-text-tertiary transition-colors group-hover/dropdown:text-text-disabled group-hover/dropdown:group-hover/link:text-text-tertiary">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="w-[260px] shrink-0 flex flex-col border-l border-line-structure -ml-px overflow-hidden">
        <NavFeaturedCard featured={featured} />
      </div>
    </CornerBox>
  );
}

// ── Custom fixed-positioned dropdown ─────────────────────────────────────────

function NavDropdown({
  label,
  links,
  featured,
}: {
  label: string;
  links: NavPanelLink[];
  featured: FeaturedItem;
}) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updateLeft = useCallback(() => {
    if (triggerRef.current) {
      setLeft(triggerRef.current.getBoundingClientRect().left);
    }
  }, []);

  const toggle = () => {
    updateLeft();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={toggle}
        aria-expanded={open}
        className={navTriggerClassName}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 opacity-60 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        ref={panelRef}
        aria-hidden={!open}
        className={cn(
          "fixed z-50 transition-all duration-150 ease-out origin-top-left",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
        )}
        style={{
          top: "66px",
        }}
      >
        <NavDropdownPanel links={links} featured={featured} />
      </div>
    </>
  );
}

// ── Desktop NavLinks (lg+) ────────────────────────────────────────────────────

export function NavLinks({
  sectionNavData: _sectionNavData,
}: {
  sectionNavData: SectionNavData[];
}) {
  return (
    <div className="flex overflow-x-auto gap-2 items-center lg:gap-4">
      <NavDropdown label="Product" links={productLinks} featured={productFeatured} />
      <NavDropdown label="Resources" links={resourcesLinks} featured={resourcesFeatured} />

      {simpleLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          variant="nav"
          className={cn(
            "py-1.5 whitespace-nowrap ring-inset transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            link.tabletHidden && "hidden lg:block"
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
