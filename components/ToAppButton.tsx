"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import NextLink from "next/link";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  cloudRegions,
  cloudRegionSelectorOrder,
  type CloudRegionKey,
} from "@/lib/cloud-regions";
import { useCloudRegionSignIn } from "@/lib/use-cloud-region-sign-in";
import { HoverCorners } from "./ui/corner-box";

const DEFAULT_BUTTON_TEXT = {
  signedIn: "Launch App",
  signUp: "Launch App",
  dropdown: "Launch App",
} as const;

const labelClasses =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] p-0";

function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el instanceof HTMLElement && (el.isContentEditable || el.closest("[contenteditable='true']"))) return true;
  return false;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (target instanceof HTMLElement && isEditableElement(target)) return true;
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  if (active && isEditableElement(active)) return true;
  return false;
}

interface ToAppButtonProps {
  signedInText?: string;
  signUpText?: string;
  dropdownText?: string;
}

export const ToAppButton = ({
  signedInText = DEFAULT_BUTTON_TEXT.signedIn,
  signUpText = DEFAULT_BUTTON_TEXT.signUp,
  dropdownText = DEFAULT_BUTTON_TEXT.dropdown,
}: ToAppButtonProps = {}) => {
  const signedInRegions = useCloudRegionSignIn();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const signedInCount = Object.values(signedInRegions).filter(Boolean).length;

  const signedInRegion = signedInCount === 1
    ? Object.entries(cloudRegions).find(
        ([key]) => signedInRegions[key as CloudRegionKey]
      )
    : null;

  useEffect(() => {
    if (signedInCount !== 1 || !signedInRegion) return;

    const handler = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() !== "l") return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      linkRef.current?.click();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [signedInCount, signedInRegion]);

  if (signedInCount > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="primary"
            size="small"
            shortcutKey="L"
            className="whitespace-nowrap"
          >
            {dropdownText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {cloudRegionSelectorOrder.map((key) => {
            const region = cloudRegions[key];
            return (
              signedInRegions[key] && (
                <DropdownMenuItem asChild key={key}>
                  <Link href={region.url}>{region.label}</Link>
                </DropdownMenuItem>
              )
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/cloud" className="flex items-center gap-1.5 text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
              Add region
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (signedInCount === 1 && signedInRegion) {
    return (
      <div className="relative flex items-center p-1 group button-wrapper max-h-[34px]">
        <HoverCorners />
        <NextLink
          ref={linkRef}
          href={signedInRegion[1].url}
          className="inline-flex h-[26px] min-w-0 items-center gap-[6px] whitespace-nowrap rounded-[2px] rounded-r-none border border-r-0 border-text-secondary bg-text-primary py-0.75 pl-[10px] pr-[8px] text-surface-bg shadow-sm transition-colors [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
          aria-keyshortcuts="L"
        >
          <span className={labelClasses}>{signedInText}</span>
          <kbd
            className="hidden lg:flex justify-center items-center not-italic shrink-0 w-[20px] h-[20px] rounded-px font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] p-0 border border-[rgba(64,61,57,0.30)] bg-[rgba(64,61,57,0.40)]"
            aria-hidden
          >
            L
          </kbd>
        </NextLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-[26px] items-center justify-center rounded-[2px] rounded-l-none border border-text-secondary bg-text-primary px-1.5 text-surface-bg shadow-sm transition-colors [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
              aria-label="More options"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/cloud" className="flex items-center gap-1.5 text-muted-foreground">
                <Plus className="h-3.5 w-3.5" />
                Add region
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else {
    return (
      <Button
        variant="primary"
        size="small"
        shortcutKey="L"
        href="/cloud"
        className="whitespace-nowrap"
      >
        {signUpText}
      </Button>
    );
  }
};
