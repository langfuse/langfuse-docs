"use client";

import * as React from "react";
import { Link } from "@/components/ui/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
>;

type SummaryProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

const detailsFrameClass =
  "relative my-4 border border-line-structure bg-surface-bg";
const detailsRowClass =
  "flex items-center justify-between gap-4 px-4 py-2 text-text-primary";

const DetailsContext = React.createContext<{ isOpen: boolean } | null>(null);

export function Details({
  children,
  className,
  id,
  open,
  onToggle,
  ...props
}: DetailsProps) {
  const [isOpen, setIsOpen] = React.useState(Boolean(open));

  React.useEffect(() => {
    setIsOpen(Boolean(open));
  }, [open]);

  React.useEffect(() => {
    if (!id) return;

    const openLinkedAnswer = (hash: string) => {
      try {
        if (decodeURIComponent(hash.slice(1)) === id) setIsOpen(true);
      } catch {
        // Ignore malformed URL fragments.
      }
    };
    const onHashChange = () => openLinkedAnswer(window.location.hash);
    const onLinkClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        (link.target && link.target !== "_self") ||
        link.hasAttribute("download") ||
        link.origin !== window.location.origin ||
        link.pathname !== window.location.pathname ||
        link.search !== window.location.search
      )
        return;

      // Next.js can follow same-page links without emitting hashchange.
      openLinkedAnswer(link.hash);
    };

    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onLinkClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onLinkClick);
    };
  }, [id]);

  return (
    <DetailsContext.Provider value={{ isOpen }}>
      <div
        className={cn(
          detailsFrameClass,
          isOpen ? "corner-box-corners" : "corner-box-corners--hover",
        )}
      >
        <details
          className={cn(
            "group relative overflow-hidden bg-surface-bg [&_summary~*]:px-4 [&_summary~*]:text-text-secondary [&_summary+*]:pt-4 [&_summary~*:last-child]:pb-4 [&_summary~p:first-of-type]:mt-0 [&_summary~p:last-of-type]:mb-0",
            className,
          )}
          id={id}
          open={isOpen}
          onToggle={(event) => {
            setIsOpen(event.currentTarget.open);
            onToggle?.(event);
          }}
          {...props}
        >
          {children}
        </details>
      </div>
    </DetailsContext.Provider>
  );
}

export function Summary({ children, className, ...props }: SummaryProps) {
  const context = React.useContext(DetailsContext);

  return (
    <summary
      className={cn(
        detailsRowClass,
        "list-none cursor-pointer [&::-webkit-details-marker]:hidden",
        context?.isOpen
          ? "with-stripes border-b border-line-structure"
          : "hover:bg-surface-1",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <div
        aria-hidden
        className={cn(
          "shrink-0 text-base leading-none w-3 text-center select-none",
          context?.isOpen ? "text-text-primary" : "text-text-tertiary",
        )}
      >
        {context?.isOpen ? "-" : "+"}
      </div>
    </summary>
  );
}

/** Same row styling as Details, for questions answered on a separate page. */
export function DetailsLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(detailsFrameClass, "corner-box-corners--hover")}>
      <Link
        href={href}
        className={cn(
          detailsRowClass,
          "font-normal no-underline hover:bg-surface-1 hover:text-text-primary",
        )}
      >
        <span>{children}</span>
        <ArrowRight
          aria-hidden
          className="size-3 shrink-0 text-text-tertiary"
        />
      </Link>
    </div>
  );
}
