"use client";

// Temporary: switches the /gateway hero between layouts so they can be
// compared on preview deploys. Delete this file once one layout is picked.

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GatewayHero, GatewayHeroLogos } from "./GatewayHero";

const VARIANTS = ["70", "72", "current"] as const;
type Variant = (typeof VARIANTS)[number];

const DEFAULT_VARIANT: Variant = "70";
const QUERY_PARAM = "hero";
const STORAGE_KEY = "gw-hero";
const CHANGE_EVENT = "gw-hero-change";

const showToggle =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

function isVariant(value: string | null): value is Variant {
  return VARIANTS.includes(value as Variant);
}

// The query param wins over the stored choice.
function readVariant(): Variant {
  const fromUrl = new URLSearchParams(window.location.search).get(QUERY_PARAM);
  if (isVariant(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isVariant(stored)) return stored;
  } catch {}
  return DEFAULT_VARIANT;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function selectVariant(variant: Variant) {
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_PARAM, variant);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function useHeroVariant() {
  return useSyncExternalStore(subscribe, readVariant, () => DEFAULT_VARIANT);
}

/** Above the page panel: the new full-bleed hero (nothing for "current") and the toggle pill. */
export function GatewayHeroAbove() {
  const variant = useHeroVariant();

  return (
    <>
      {variant === "current" ? null : <GatewayHero layout={variant} />}
      {showToggle ? (
        <div
          role="group"
          aria-label="Hero layout"
          className="not-prose fixed bottom-18 left-4 z-50 flex overflow-hidden rounded-full border border-line-structure bg-surface-bg font-mono text-[11px] leading-none shadow-sm"
        >
          {VARIANTS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === variant}
              onClick={() => selectVariant(option)}
              className={cn(
                "cursor-pointer border-l border-line-structure px-2.5 py-1.5 first:border-l-0",
                option === variant
                  ? "bg-text-primary text-surface-bg"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

/** Top of the page panel: `children` (the current hero), or only the logo strip under a new hero. */
export function GatewayHeroSwitch({ children }: { children: ReactNode }) {
  const variant = useHeroVariant();
  return variant === "current" ? children : <GatewayHeroLogos />;
}
