import type { ReactNode } from "react";

import { controlTextClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_SUFFIX = /^(.*\S)\s+\((beta)\)$/i;

/**
 * Renders a trailing status in a `meta.json` / page title, e.g. "AI Gateway (beta)",
 * as a pill so content keeps the plain-text title for breadcrumbs and Markdown output.
 */
export function SidebarLabel({ name }: { name: ReactNode }) {
  if (typeof name !== "string") return <>{name}</>;
  const match = STATUS_SUFFIX.exec(name);
  if (!match) return <>{name}</>;

  return (
    <>
      {match[1]}
      <span
        className={cn(
          controlTextClassName,
          "shrink-0 rounded-[2px] border border-line-structure px-1.5 py-0 text-[11px] leading-[18px] text-text-tertiary",
        )}
      >
        Beta
      </span>
    </>
  );
}
