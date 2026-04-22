"use client";

import { AsideShell } from "@/components/home/layout/AsideShell";
import TocCommunity from "@/components/TocCommunity";

export function BlogAside() {
  return (
    <AsideShell>
      <div className="flex-1" />
      <TocCommunity className="border-t border-line-structure mt-auto" />
    </AsideShell>
  );
}
