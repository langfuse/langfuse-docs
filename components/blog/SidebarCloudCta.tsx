"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type SidebarCtaPlacement = "flow" | "dock" | "split" | "inline";

const PLACEMENTS = new Set<SidebarCtaPlacement>([
  "flow",
  "dock",
  "split",
  "inline",
]);

/**
 * Temporary comparison switch. `?cta=flow|dock|split|inline` on a blog post.
 * Default is `split` (own block directly under the table of contents).
 */
export function useSidebarCtaPlacement(enabled: boolean): SidebarCtaPlacement {
  const [placement, setPlacement] = useState<SidebarCtaPlacement>("split");

  useEffect(() => {
    if (!enabled) return;
    const value = new URLSearchParams(window.location.search).get("cta");
    if (value && PLACEMENTS.has(value as SidebarCtaPlacement)) {
      setPlacement(value as SidebarCtaPlacement);
    }
  }, [enabled]);

  return placement;
}

type SidebarCloudCtaProps = {
  layout?: "stack" | "row";
  className?: string;
};

export function SidebarCloudCta({
  layout = "stack",
  className,
}: SidebarCloudCtaProps) {
  const copy = (
    <div className={layout === "row" ? "min-w-0" : undefined}>
      <Text
        size="s"
        className="mb-1 font-[430] text-left text-[13px] text-text-primary"
      >
        Langfuse Cloud
      </Text>
      <Text
        size="s"
        className="text-left text-[13px] text-text-tertiary leading-snug"
      >
        50k observations a month. No credit card.
      </Text>
    </div>
  );

  const actions = (
    <div
      className={cn(
        "flex",
        layout === "row" ? "shrink-0 flex-row" : "mt-3 flex-col",
      )}
    >
      <Button
        href="/cloud"
        variant="primary"
        size="small"
        wrapperClassName={layout === "row" ? "w-[132px]" : "w-full"}
      >
        Start free
      </Button>
      <Button
        href="/talk-to-us"
        variant="secondary"
        size="small"
        wrapperClassName={layout === "row" ? "w-[132px]" : "w-full"}
      >
        Talk to us
      </Button>
    </div>
  );

  if (layout === "row") {
    return (
      <section
        aria-label="Langfuse Cloud"
        className={cn(
          "not-prose flex flex-col gap-3 border border-line-structure bg-surface-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        {copy}
        {actions}
      </section>
    );
  }

  return (
    <section aria-label="Langfuse Cloud" className={cn("px-4 py-4", className)}>
      {copy}
      {actions}
    </section>
  );
}

/** Renders the end-of-article CTA only for `?cta=inline`. */
export function BlogArticleCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(
      new URLSearchParams(window.location.search).get("cta") === "inline",
    );
  }, []);

  if (!show) return null;

  return <SidebarCloudCta layout="row" className="my-10" />;
}
