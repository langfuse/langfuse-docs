"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";
import { PageFooterNav, type PageFooterNavItem } from "./PageFooterNav";

type DocsFooterProps = React.ComponentProps<"div"> & {
  items?: {
    previous?: PageFooterNavItem;
    next?: PageFooterNavItem;
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
      previous: footerItems[currentIndex - 1] as PageFooterNavItem | undefined,
      next: footerItems[currentIndex + 1] as PageFooterNavItem | undefined,
    };
  }, [footerItems, items, pathname]);

  return (
    <PageFooterNav
      items={resolvedItems}
      className={className}
      {...props}
    />
  );
}
