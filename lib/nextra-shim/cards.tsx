/**
 * Server-safe nextra shim components: Cards, Card, Callout, Steps, Playground.
 * No hooks → no "use client" directive needed → Cards.Card is accessible in RSC.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

const CardComponent = ({
  children,
  title,
  href,
  icon,
  arrow,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  title?: string;
  href?: string;
  icon?: React.ReactNode;
  arrow?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={href}
    className={cn("block rounded-lg border p-4 hover:border-primary", className)}
    {...rest}
  >
    {icon && <span className="block">{icon}</span>}
    {title && <h3 className="font-semibold">{title}</h3>}
    {children}
  </a>
);

/** Wrapper for card grids; accepts num (columns) and does not forward it to the DOM. */
export function Cards({
  num,
  children,
  className,
  ...rest
}: {
  num?: number;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const colsClass =
    num === 1
      ? "grid-cols-1"
      : num === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div
      className={cn("grid gap-4 not-prose my-4", colsClass, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

Cards.Card = CardComponent;

/**
 * Card is also exported directly so it can be imported as a named export
 * or used via getMDXComponents({ Card, "Cards.Card": Card }).
 */
export const Card = CardComponent;

export const Callout = ({
  children,
  type = "info",
  ...props
}: {
  children?: React.ReactNode;
  type?: string;
  emoji?: string;
} & React.ComponentProps<"div">) => (
  <div
    className={`rounded-lg border p-4 my-4 ${
      type === "info"
        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50"
        : type === "warning"
          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50"
          : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
    }`}
    {...props}
  >
    {children}
  </div>
);

/** Numbered step list — wraps children in a styled ordered-list container. */
export function Steps({
  children,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="steps ml-2 border-l pl-4 [counter-reset:step] md:ml-4 md:pl-8"
      {...props}
    >
      {children}
    </div>
  );
}

/** Renders markdown/code source in a scrollable code block (Nextra Playground-style). */
export const Playground = ({ source }: { source: string }) => (
  <pre className="p-4 overflow-auto rounded-lg border bg-muted/50 text-sm max-h-[70vh]">
    <code>{source}</code>
  </pre>
);
