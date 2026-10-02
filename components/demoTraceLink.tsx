"use client";

import Image from "next/image";

import type { DemoTraceSource } from "@/lib/demo-trace";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

type DemoTraceLinkProps = {
  traceUrl?: string | null;
  source: DemoTraceSource;
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
        "inline-flex items-center gap-1.5 text-sm font-medium text-text-primary no-underline transition-colors hover:text-text-secondary",
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
