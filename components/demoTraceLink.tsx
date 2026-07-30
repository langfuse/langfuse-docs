"use client";

import Image from "next/image";

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
        "inline-flex items-center gap-1.5 rounded-[2px] border border-line-structure bg-surface-bg px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-line-cta hover:text-text-primary",
        className,
      )}
    >
      <Image
        src="/langfuse-icon.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="size-3.5 shrink-0"
      />
      View trace in Langfuse
    </a>
  );
};
