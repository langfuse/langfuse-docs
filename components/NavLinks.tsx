"use client";

import { Link } from "@/components/ui/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { HoverCorners } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import {
  industryLinks,
  productCtas,
  productLinks,
  resourcesLinks,
  simpleLinks,
  useCaseLinks,
} from "@/lib/nav-links";
import type { NavCta, NavPanelLink } from "@/lib/nav-links";
import {
  GatewayCtaGraphic,
  TracingCtaGraphic,
} from "@/components/nav/ProductCtaGraphics";
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

const resourcesFeatured: FeaturedItem = {
  image: (
    <div className="flex flex-col gap-3 justify-center items-center px-6 h-full">
      <div className="flex gap-0 items-center w-full">
        <div className="flex flex-1 justify-center items-center py-3 rounded border border-line-structure bg-surface-1">
          <span className="font-sans text-[11px] font-semibold text-text-secondary tracking-tight">
            langfuse
          </span>
        </div>
        <div className="w-4 border-t shrink-0 border-line-structure" />
        <div className="flex flex-1 justify-center items-center py-3 rounded border border-line-structure bg-surface-1">
          <span className="font-sans text-[11px] font-semibold text-text-secondary tracking-tight">
            ClickHouse
          </span>
        </div>
      </div>
    </div>
  ),
  title: "Langfuse joins ClickHouse",
  description:
    "Our goal continues to be building the best AI engineering platform",
  cta: "Read story",
  href: "/blog/joining-clickhouse",
};

// ── Featured card component ───────────────────────────────────────────────────

function NavFeaturedCard({ featured }: { featured: FeaturedItem }) {
  return (
    <Link
      href={featured.href}
      className="flex flex-col h-full no-underline group/card"
    >
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

// ── Product panel ──────────────────────────────────────────────────────────────

const ctaGraphics: Record<
  NavCta["id"],
  React.ComponentType<{ className?: string }>
> = {
  tracing: TracingCtaGraphic,
  gateway: GatewayCtaGraphic,
};

// Temporary preview switch for description copy: ?navCopy=a|b|c
const PRODUCT_COPY_SETS = {
  a: {
    tracing: "See every LLM call, tool, and cost in one trace.",
    gateway: "Trace every model call without changing your code.",
  },
  b: {
    tracing: "Trace your app in a few lines of code.",
    gateway: "Point any client at Langfuse and trace every call.",
  },
  c: {
    tracing: "Debug agents step by step, from prompt to tool call.",
    gateway: "One key for every model, with spend tracked per user.",
  },
} satisfies Record<string, Record<NavCta["id"], string>>;
type ProductCopySet = keyof typeof PRODUCT_COPY_SETS;

function useProductCopySet(): ProductCopySet | null {
  const [copySet, setCopySet] = useState<ProductCopySet | null>(null);
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("navCopy");
    if (value && value in PRODUCT_COPY_SETS) {
      setCopySet(value as ProductCopySet);
    }
  }, []);
  return copySet;
}

function CtaBadge({ label }: { label: string }) {
  return (
    <span className="border border-line-structure bg-surface-bg px-1 py-px font-mono text-[9px] leading-none tracking-[0.04em] text-text-secondary">
      {label}
    </span>
  );
}

function ProductItemList() {
  return (
    <div className="group/dropdown flex min-w-[240px] flex-col gap-[6px] p-3.5">
      {productLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group/link link-box group relative flex items-center gap-3 p-1 no-underline transition-colors hover:bg-surface-bg"
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
  );
}

function ProductCtaCard({
  cta,
  description,
  divider,
}: {
  cta: NavCta;
  description: string;
  divider: boolean;
}) {
  const Graphic = ctaGraphics[cta.id];
  return (
    <Link
      href={cta.href}
      className={cn(
        "group/cta relative flex w-[430px] flex-1 overflow-hidden no-underline transition-colors hover:bg-surface-bg",
        divider && "border-t border-line-structure",
      )}
    >
      <div className="pointer-events-none absolute right-1 top-1/2 w-[240px] -translate-y-1/2 opacity-90 transition-opacity [mask-image:linear-gradient(to_right,transparent,black_35%)] group-hover/cta:opacity-100">
        <Graphic />
      </div>
      <span className="relative flex w-[200px] flex-col gap-1 p-4">
        <span className="flex items-center gap-2 font-sans text-[13px] font-semibold leading-snug text-text-primary">
          {cta.title}
          {cta.badge ? <CtaBadge label={cta.badge} /> : null}
        </span>
        <span className="font-sans text-[12px] leading-relaxed text-text-tertiary">
          {description}
        </span>
        <span className="mt-auto flex items-center gap-1 pt-1 font-mono text-[11px] text-text-tertiary transition-colors group-hover/cta:text-text-primary">
          {cta.cta}
          <ArrowRight className="size-3 transition-transform group-hover/cta:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}

function ProductPanel() {
  const copySet = useProductCopySet();
  return (
    <div className="flex min-w-max border border-line-structure bg-surface-1 shadow-md">
      <ProductItemList />
      <div className="flex flex-col border-l border-line-structure">
        {productCtas.map((cta, index) => (
          <ProductCtaCard
            key={cta.href}
            cta={cta}
            description={
              copySet ? PRODUCT_COPY_SETS[copySet][cta.id] : cta.description
            }
            divider={index > 0}
          />
        ))}
      </div>
    </div>
  );
}

// ── Mega dropdown panel ────────────────────────────────────────────────────────

function NavLinkColumn({
  heading,
  links,
}: {
  heading?: string;
  links: NavPanelLink[];
}) {
  return (
    <div className="group/dropdown flex min-w-[220px] flex-col gap-[6px] overflow-hidden p-3.5">
      {heading ? (
        <p className="px-1 pb-1 font-mono text-[10px] uppercase tracking-[0.09em] text-text-tertiary">
          {heading}
        </p>
      ) : null}
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="group/link link-box group relative flex items-center gap-3 p-1 no-underline transition-colors hover:bg-surface-bg"
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
  );
}

function NavDropdownPanel({
  columns,
  featured,
}: {
  columns: { heading?: string; links: NavPanelLink[] }[];
  featured?: FeaturedItem;
}) {
  return (
    <div className="flex min-w-max border border-line-structure bg-surface-1 p-0 shadow-md">
      {columns.map((column, index) => (
        <div
          key={column.heading ?? column.links[0]?.href ?? index}
          className={cn(index > 0 && "border-l border-line-structure")}
        >
          <NavLinkColumn heading={column.heading} links={column.links} />
        </div>
      ))}
      {featured ? (
        <div className="-ml-px flex w-[260px] shrink-0 flex-col overflow-hidden border-l border-line-structure">
          <NavFeaturedCard featured={featured} />
        </div>
      ) : null}
    </div>
  );
}

// ── Custom fixed-positioned dropdown ─────────────────────────────────────────

type MegaMenuId = "product" | "resources" | "solutions";

function NavDropdown({
  id,
  label,
  columns,
  featured,
  panel,
  openId,
  setOpenId,
  cancelScheduledClose,
  scheduleClose,
}: {
  id: MegaMenuId;
  label: string;
  columns?: { heading?: string; links: NavPanelLink[] }[];
  featured?: FeaturedItem;
  panel?: React.ReactNode;
  openId: MegaMenuId | null;
  setOpenId: React.Dispatch<React.SetStateAction<MegaMenuId | null>>;
  cancelScheduledClose: () => void;
  scheduleClose: () => void;
}) {
  const open = openId === id;
  const [left, setLeft] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updateLeft = useCallback(() => {
    if (triggerRef.current) {
      setLeft(triggerRef.current.getBoundingClientRect().left);
    }
  }, []);

  const openDropdown = useCallback(() => {
    cancelScheduledClose();
    updateLeft();
    setOpenId(id);
  }, [cancelScheduledClose, updateLeft, id, setOpenId]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        cancelScheduledClose();
        setOpenId(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, cancelScheduledClose, setOpenId]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      cancelScheduledClose();
      setOpenId(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, cancelScheduledClose, setOpenId]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => updateLeft();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, updateLeft]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelScheduledClose();
        setOpenId(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, cancelScheduledClose, setOpenId]);

  return (
    <div
      className="relative"
      onMouseEnter={openDropdown}
      onFocusCapture={openDropdown}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (!next || !e.currentTarget.contains(next)) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="true"
        className={navTriggerClassName}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 opacity-60 transition-transform duration-150 ease-in-out",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        ref={panelRef}
        aria-hidden={!open}
        className={cn(
          "fixed z-50 ease-in-out will-change-[opacity,transform]",
          // Instant hide avoids two mega menus fading over each other when switching tabs.
          open
            ? "pointer-events-auto opacity-100 translate-y-0 transition-[opacity,transform] duration-200"
            : "pointer-events-none opacity-0 -translate-y-1 transition-[opacity,transform] duration-0",
        )}
        style={{
          // Viewport-fixed: banner + primary bar + 6px gap. Do not rely on a
          // header containing block (backdrop-filter used to create one).
          top: "calc(var(--fd-banner-height, 0px) + var(--lf-nav-primary-height) + 6px)",
          left,
        }}
      >
        {panel ?? (
          <NavDropdownPanel columns={columns ?? []} featured={featured} />
        )}
      </div>
    </div>
  );
}

// ── Desktop NavLinks (lg+) ────────────────────────────────────────────────────

export function NavLinks({
  sectionNavData: _sectionNavData,
}: {
  sectionNavData: SectionNavData[];
}) {
  const [openId, setOpenId] = useState<MegaMenuId | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenId(null);
      closeTimerRef.current = null;
    }, 140);
  }, [cancelScheduledClose]);

  useEffect(() => () => cancelScheduledClose(), [cancelScheduledClose]);

  return (
    <div className="flex overflow-x-auto gap-2 items-center lg:gap-4">
      <div
        className="flex gap-2 items-center lg:gap-4"
        onMouseEnter={cancelScheduledClose}
        onMouseLeave={scheduleClose}
      >
        <NavDropdown
          id="product"
          label="Product"
          panel={<ProductPanel />}
          openId={openId}
          setOpenId={setOpenId}
          cancelScheduledClose={cancelScheduledClose}
          scheduleClose={scheduleClose}
        />
        <NavDropdown
          id="resources"
          label="Resources"
          columns={[{ links: resourcesLinks }]}
          featured={resourcesFeatured}
          openId={openId}
          setOpenId={setOpenId}
          cancelScheduledClose={cancelScheduledClose}
          scheduleClose={scheduleClose}
        />
        <NavDropdown
          id="solutions"
          label="Solutions"
          columns={[
            { heading: "Use cases", links: useCaseLinks },
            { heading: "Industries", links: industryLinks },
          ]}
          openId={openId}
          setOpenId={setOpenId}
          cancelScheduledClose={cancelScheduledClose}
          scheduleClose={scheduleClose}
        />
      </div>

      {simpleLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          variant="nav"
          className={cn(
            "py-1.5 whitespace-nowrap ring-inset transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            link.tabletHidden && "hidden lg:block",
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
