"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
>;

type SummaryProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

const DetailsContext = React.createContext<{ isOpen: boolean } | null>(null);

export function Details({
  children,
  className,
  open,
  onToggle,
  ...props
}: DetailsProps) {
  const [isOpen, setIsOpen] = React.useState(Boolean(open));

  React.useEffect(() => {
    setIsOpen(Boolean(open));
  }, [open]);

  return (
    <DetailsContext.Provider value={{ isOpen }}>
      <div
        className={cn(
          "relative my-4 border border-line-structure bg-surface-bg",
          isOpen ? "corner-box-corners" : "corner-box-corners--hover"
        )}
      >
        <details
          className={cn(
            "group relative overflow-hidden bg-surface-bg [&_summary~*]:px-4 [&_summary~*]:text-text-secondary [&_summary+*]:pt-4 [&_summary~*:last-child]:pb-4 [&_summary~p:first-of-type]:mt-0 [&_summary~p:last-of-type]:mb-0",
            className
          )}
          open={open}
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
        "flex list-none items-center justify-between gap-4 px-4 py-2 text-text-primary cursor-pointer [&::-webkit-details-marker]:hidden",
        context?.isOpen ? "with-stripes border-b border-line-structure" : "hover:bg-surface-1",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <div
        aria-hidden
        className={cn(
          "shrink-0 text-base leading-none w-3 text-center select-none",
          context?.isOpen ? "text-text-primary" : "text-text-tertiary"
        )}
      >
        {context?.isOpen ? "-" : "+"}
      </div>
    </summary>
  );
}
