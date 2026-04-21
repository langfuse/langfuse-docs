"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { HoverCorners } from "@/components/ui/corner-box";

type FooterItem = {
  name: string;
  description?: string;
  url: string;
};

type DocsFooterProps = React.ComponentProps<"div"> & {
  items?: {
    previous?: FooterItem;
    next?: FooterItem;
  };
};

function normalizePath(path: string): string {
  const stripped = path.split("#")[0]?.split("?")[0] ?? path;
  return stripped.length > 1 && stripped.endsWith("/")
    ? stripped.slice(0, -1)
    : stripped;
}

const linkClasses =
  "inline-flex w-full min-w-0 max-w-full no-underline overflow-hidden shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-[2px] border [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)] border-line-structure dark:border-line-cta group-hover:border-line-cta bg-surface-bg text-text-secondary";

const labelClasses =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] p-0";

export function DocsFooter({ items, className, ...props }: DocsFooterProps) {
  const footerItems = useFooterItems();
  const pathname = usePathname();

  const resolvedItems = useMemo(() => {
    if (items) return items;

    const currentPath = normalizePath(pathname ?? "");
    const currentIndex = footerItems.findIndex(
      (item) => normalizePath(item.url) === currentPath
    );

    if (currentIndex === -1) return {};

    return {
      previous: footerItems[currentIndex - 1] as FooterItem | undefined,
      next: footerItems[currentIndex + 1] as FooterItem | undefined,
    };
  }, [footerItems, items, pathname]);

  const { previous, next } = resolvedItems;

  if (!previous && !next) return null;

  return (
    <div
      className={cn("flex flex-col sm:flex-row gap-2", className)}
      {...props}
    >
      {previous ? (
        <div className="relative flex items-center p-1 group button-wrapper flex-1 min-w-0">
          <HoverCorners />
          <NextLink
            href={previous.url}
            className={cn(linkClasses, "flex-col gap-1 px-3 py-2")}
          >
            <span className={cn(labelClasses, "min-w-0 truncate text-text-primary")}>
              {previous.name}
            </span>
            <span className="font-sans text-[11px] leading-[150%] text-text-tertiary flex items-center gap-0.5">
              <ChevronLeft className="h-3 w-3" />
              Previous
            </span>
          </NextLink>
        </div>
      ) : (
        <div className="hidden sm:block flex-1" />
      )}

      {next ? (
        <div className="relative flex items-center p-1 group button-wrapper flex-1 min-w-0 sm:justify-end">
          <HoverCorners />
          <NextLink
            href={next.url}
            className={cn(linkClasses, "flex-col gap-1 px-3 py-2 items-end")}
          >
            <span className={cn(labelClasses, "min-w-0 truncate max-w-full text-text-primary")}>
              {next.name}
            </span>
            <span className="font-sans text-[11px] leading-[150%] text-text-tertiary flex items-center gap-0.5">
              Next
              <ChevronRight className="h-3 w-3" />
            </span>
          </NextLink>
        </div>
      ) : null}
    </div>
  );
}
