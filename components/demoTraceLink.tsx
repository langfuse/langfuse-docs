"use client";

import Image from "next/image";

import type { DemoTraceSource } from "@/lib/demo-trace";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

/** Analytics sources for the Open-trace CTA, including blog/changelog compare widgets. */
export type DemoTraceLinkSource =
  | DemoTraceSource
  | "jev_evals_blog"
  | "openai_decisions_changelog";

type DemoTraceLinkProps = {
  traceUrl?: string | null;
  source: DemoTraceLinkSource;
  className?: string;
};

export const DemoTraceLink = ({
  traceUrl,
  source,
  className,
}: DemoTraceLinkProps) => {
  const capture = usePostHogClientCapture();

  if (!traceUrl) return null;

  return (
    <a
      href={traceUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        capture("demo:view_trace_in_langfuse_clicked", {
          source,
          trace_url: traceUrl,
        });
      }}
      // Inline styles defeat any leftover prose/CTA chip rules that paint
      // links with the yellow surface-cta-primary background.
      style={{ background: "transparent", border: "none", boxShadow: "none" }}
      className={cn(
        "not-prose inline-flex items-center gap-1.5 !border-0 !bg-transparent p-0 text-sm font-medium text-text-primary !no-underline !shadow-none transition-colors hover:!bg-transparent hover:text-text-secondary",
        className,
      )}
    >
      <Image
        src="/langfuse-icon.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden="true"
        className="size-4 shrink-0"
      />
      Open trace ↗
    </a>
  );
};
