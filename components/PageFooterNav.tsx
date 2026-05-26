import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverCorners } from "./ui/corner-box";

export type PageFooterNavItem = {
  name: string;
  description?: string;
  url: string;
};

type PageFooterNavProps = React.ComponentProps<"div"> & {
  items?: {
    previous?: PageFooterNavItem;
    next?: PageFooterNavItem;
  };
};

type PageFooterNavLinkProps = {
  item: PageFooterNavItem;
  direction: "previous" | "next";
};

function PageFooterNavLink({ item, direction }: PageFooterNavLinkProps) {
  const label = direction === "next" ? "Next" : "Previous";
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;

  return (
    <Link
      className="group relative flex h-full min-h-18 items-center p-1 group button-wrapper cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={item.url}
      aria-label={`${label}: ${item.name}`}
    >
      <HoverCorners />
      <div
        className={cn(
          "w-full h-full flex min-w-0 items-center gap-3 border border-line-structure bg-surface-bg p-4 no-underline shadow-lg/5 transition-colors hover:border-line-cta hover:bg-surface-1",
          direction === "next" ? "justify-end text-right" : "text-left",
        )}
      >
        {direction === "previous" ? (
          <Icon
            className="h-4 w-4 shrink-0 text-text-tertiary transition-colors group-hover:text-text-secondary"
            aria-hidden
          />
        ) : null}
        <span className="min-w-0">
          <span className="block text-xs font-medium leading-5 text-text-tertiary">
            {label}
          </span>
          <span className="block text-sm font-medium leading-6 text-text-primary wrap-break-word">
            {item.name}
          </span>
        </span>
        {direction === "next" ? (
          <Icon
            className="h-4 w-4 shrink-0 text-text-tertiary transition-colors group-hover:text-text-secondary"
            aria-hidden
          />
        ) : null}
      </div>
    </Link>
  );
}

export function PageFooterNav({
  items,
  className,
  ...props
}: PageFooterNavProps) {
  const { previous, next } = items ?? {};

  if (!previous && !next) return null;

  return (
    <div
      className={cn("grid auto-rows-fr gap-3 sm:grid-cols-2", className)}
      {...props}
    >
      {previous ? (
        <PageFooterNavLink item={previous} direction="previous" />
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? <PageFooterNavLink item={next} direction="next" /> : null}
    </div>
  );
}
