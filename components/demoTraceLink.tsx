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
        "corner-box-corners inline-flex items-center gap-3 rounded-[2px] border-2 border-line-cta bg-surface-cta-primary px-5 py-2.5 text-base font-semibold text-text-primary no-underline transition-colors hover:bg-surface-cta-primary/90 hover:text-text-primary",
        className,
      )}
    >
      <Image
        src="/langfuse-icon.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="size-4 shrink-0"
      />
      View trace in Langfuse
      <ArrowUpRight className="size-4.5 shrink-0" aria-hidden="true" />
    </a>
  );
};
