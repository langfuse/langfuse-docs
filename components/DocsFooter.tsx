"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <Button
          href={previous.url}
          variant="secondary"
          size="small"
          className="w-full sm:w-auto"
          wrapperClassName="flex-1 min-w-0 sm:max-w-[50%]"
          icon={<ArrowLeft className="h-3.5 w-3.5" />}
        >
          {previous.name}
        </Button>
      ) : (
        <div className="hidden sm:block flex-1" />
      )}

      {next ? (
        <Button
          href={next.url}
          variant="secondary"
          size="small"
          className="w-full sm:w-auto"
          wrapperClassName="flex-1 min-w-0 sm:max-w-[50%] sm:ml-auto"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="end"
        >
          {next.name}
        </Button>
      ) : null}
    </div>
  );
}
