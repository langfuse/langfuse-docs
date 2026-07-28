"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

type DemoTraceLinkProps = {
  traceId?: string | null;
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

  const linkContent = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span className="relative inline-flex min-h-[30px] w-full min-w-0 items-center justify-center gap-1.5 border border-line-cta bg-surface-cta-primary px-3 py-1 font-sans text-[14px] font-semibold leading-tight text-text-primary shadow-[0_1px_0_rgba(0,0,0,0.18)] transition-colors group-hover:bg-surface-cta-primary/80 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface-bg sm:w-auto">
        <Image
          src="/langfuse-icon.svg"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className="size-3.5 shrink-0"
        />
        <span className="min-w-0 text-left sm:whitespace-nowrap">
          View trace in Langfuse
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-text-secondary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
          strokeWidth={2.25}
        />
      </span>
    </>
  );

  const linkClassName = cn(
    "group relative inline-flex max-w-full p-0.5 no-underline hover:no-underline focus-visible:outline-none sm:w-fit",
    className,
  );

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
      className={linkClassName}
    >
      {linkContent}
    </a>
  );
};
