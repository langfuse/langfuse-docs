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
  traceId,
  traceUrl,
  source,
  className,
}: DemoTraceLinkProps) => {
  const capture = usePostHogClientCapture();
  const href =
    traceUrl ||
    (traceId ? `https://cloud.langfuse.com/project/~/traces/${traceId}` : null);

  const linkContent = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-text-secondary transition-colors group-hover:border-text-primary"
      />
      <span className="relative inline-flex min-h-[46px] items-center gap-4 border border-text-secondary bg-[#f4ff63] px-7 py-3 font-sans text-[19px] font-semibold leading-none text-text-primary shadow-[0_1px_0_rgba(0,0,0,0.22)] transition-colors group-hover:bg-[#f7ff7a] group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-surface-bg">
        <Image
          src="/langfuse-icon.svg"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
          className="size-[18px] shrink-0"
        />
        <span className="whitespace-nowrap">View trace in Langfuse</span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-text-secondary transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
          strokeWidth={2.25}
        />
      </span>
    </>
  );

  const linkClassName = cn(
    "group relative inline-flex w-fit p-1.5 no-underline hover:no-underline focus-visible:outline-none",
    className,
  );

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        capture("demo:view_trace_in_langfuse_clicked", {
          source,
          trace_url: href,
        });
      }}
      className={linkClassName}
    >
      {linkContent}
    </a>
  );
};
