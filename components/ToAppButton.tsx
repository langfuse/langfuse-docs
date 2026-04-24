"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
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
  signedInText = "Launch App",
  signUpText = "Launch App",
  dropdownText = "Launch App",
}: ToAppButtonProps = {}) => {
  const signedInRegions = useCloudRegionSignIn();

  const signedInCount = Object.values(signedInRegions).filter(Boolean).length;

  const signedInRegion = signedInCount === 1
    ? Object.entries(cloudRegions).find(
        ([key]) => signedInRegions[key as CloudRegionKey]
      )
    : null;

  if (signedInCount > 1) {
    return (
      <MultiRegionButton
        signedInRegions={signedInRegions}
        dropdownText={dropdownText}
      />
    );
  } else if (signedInCount === 1 && signedInRegion) {
    return (
      <NavigatingButton
        href={signedInRegion[1].url}
        label={signedInText}
      />
    );
  } else {
    return (
      <NavigatingButton
        href="/cloud"
        label={signUpText}
      />
    );
  }
};

function NavigatingButton({ href, label }: { href: string; label: string }) {
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const isExternal = href.startsWith("http");

  const navigate = useCallback(() => {
    setNavigating(true);
    if (isExternal) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  }, [href, isExternal, router]);

  return (
    <Button
      variant="primary"
      size="small"
      shortcutKey={navigating ? undefined : "L"}
      icon={navigating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : undefined}
      iconPosition="end"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate();
      }}
      className="whitespace-nowrap"
    >
      {label}
    </Button>
  );
}

function MultiRegionButton({
  signedInRegions,
  dropdownText,
}: {
  signedInRegions: Record<CloudRegionKey, boolean>;
  dropdownText: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() !== "l") return;
      if (isEditableTarget(e.target)) return;
      if (open) return;
      e.preventDefault();
      setOpen(true);
    },
    [open]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="primary"
          size="small"
          shortcutKey="L"
          className="whitespace-nowrap"
        >
          {dropdownText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          triggerRef.current?.focus();
        }}
      >
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
}
