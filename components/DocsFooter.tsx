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
            className="flex flex-col gap-1 w-full rounded-[2px] border border-line-structure dark:border-line-cta group-hover:border-line-cta bg-surface-bg px-3 py-2 no-underline transition-colors"
          >
            <span className="font-sans text-[13px] font-medium leading-[150%] text-text-primary truncate">
              {previous.name}
            </span>
            <span className="flex items-center gap-0.5 font-sans text-[12px] text-text-tertiary">
              <ChevronLeft className="h-3 w-3" />
              Previous
            </span>
          </NextLink>
        </div>
      ) : (
        <div className="hidden sm:block flex-1" />
      )}

      {next ? (
        <div className="relative flex items-center p-1 group button-wrapper flex-1 min-w-0">
          <HoverCorners />
          <NextLink
            href={next.url}
            className="flex flex-col gap-1 w-full rounded-[2px] border border-line-structure dark:border-line-cta group-hover:border-line-cta bg-surface-bg px-3 py-2 no-underline transition-colors items-end text-right"
          >
            <span className="font-sans text-[13px] font-medium leading-[150%] text-text-primary truncate max-w-full">
              {next.name}
            </span>
            <span className="flex items-center gap-0.5 font-sans text-[12px] text-text-tertiary">
              Next
              <ChevronRight className="h-3 w-3" />
            </span>
          </NextLink>
        </div>
      ) : null}
    </div>
  );
}
