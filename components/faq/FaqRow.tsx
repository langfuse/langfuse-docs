import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bordered card chrome shared by accordion rows, preview links, and the ask CTA. */
export const faqRowFrameClass =
  "relative my-4 border border-line-structure bg-surface-bg";

/** Horizontal row: label on the left, trailing icon on the right. */
export const faqRowClass =
  "flex items-center justify-between gap-4 px-4 py-2 text-text-primary";

export function FaqRow({
  children,
  className,
  corners = "hover",
}: {
  children: ReactNode;
  className?: string;
  corners?: "hover" | "solid";
}) {
  return (
    <div
      className={cn(
        faqRowFrameClass,
        corners === "solid"
          ? "corner-box-corners"
          : "corner-box-corners--hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
