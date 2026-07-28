"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

type DemoTraceLinkProps = {
  traceUrl?: string | null;
  source: "qa_chatbot" | "image_generator" | "sentiment_classifier";
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
      className={cn(
        "relative inline-flex items-center gap-3 overflow-visible whitespace-nowrap rounded-[2px] border border-line-structure bg-surface-cta-primary px-5 py-2 text-sm font-semibold text-text-primary no-underline transition-colors hover:border-line-structure hover:bg-surface-cta-primary/90 hover:text-text-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-2 size-4 border-l-2 border-t-2 border-line-cta"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-2 size-4 border-r-2 border-t-2 border-line-cta"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 -left-2 size-4 border-b-2 border-l-2 border-line-cta"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 -right-2 size-4 border-b-2 border-r-2 border-line-cta"
      />
      <Image
        src="/langfuse-icon.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden="true"
        className="size-4 shrink-0"
      />
      View trace in Langfuse
      <ArrowUpRight className="size-[18px] shrink-0" aria-hidden="true" />
    </a>
  );
};
