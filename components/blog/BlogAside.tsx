"use client";

import { AsideShell } from "@/components/home/layout/AsideShell";
import { RightSidebarHiringAndCommunity } from "@/components/home/layout/RightSidebarHiringAndCommunity";

export function BlogAside() {
  return (
    <AsideShell>
      <div className="min-h-0 flex-1 bg-surface-1" />
      <div className="mt-auto w-full shrink-0">
        <RightSidebarHiringAndCommunity withTopRule />
      </div>
    </AsideShell>
  );
}
