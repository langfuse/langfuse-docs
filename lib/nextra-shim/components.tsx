/**
 * Shim for nextra/components (Cards, Tabs, Callout) so existing components render.
 * Re-export Fumadocs or simple equivalents where possible.
 */
"use client";

import * as React from "react";
import { Primitive, Tab as FumadocsTab } from "fumadocs-ui/components/tabs";

function toValue(s: string): string {
  return s.toLowerCase().replace(/\s/g, "-");
}

const CardComponent = ({
  children,
  title,
  href,
  icon,
  arrow,
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
    className="block rounded-lg border p-4 hover:border-primary"
    {...rest}
  >
    {icon && <span className="mb-2 block">{icon}</span>}
    {title && <h3 className="font-semibold">{title}</h3>}
    {children}
  </a>
);

/** Wrapper for card grids; accepts num (columns) and does not forward it to the DOM. */
export function Cards({
  num,
  children,
  ...rest
}: { num?: number; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const cols = num === 1 ? 1 : num === 2 ? 2 : 3;
  return (
    <div
      className="grid gap-4 not-prose my-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      {...rest}
    >
      {children}
    </div>
  );
}

Cards.Card = CardComponent;

/** Tab panel: receives value from Tabs by position, or use title/value prop. */
export const Tab = ({
  value: valueProp,
  title,
  className,
  children,
  ...props
}: React.ComponentProps<typeof FumadocsTab> & { title?: string }) => {
  const value = valueProp ?? (title != null ? toValue(title) : undefined);
  return (
    <FumadocsTab value={value!} className={className} {...props}>
      {children}
    </FumadocsTab>
  );
};

/** Tabs root: accepts items (labels) and injects value into each Tab by order. */
export function Tabs({
  items = [],
  id,
  persist,
  defaultIndex = 0,
  children,
  ...rest
}: {
  items?: string[];
  id?: string;
  persist?: boolean;
  defaultIndex?: number;
  children?: React.ReactNode;
}) {
  const values = React.useMemo(() => items.map(toValue), [items]);
  const [value, setValue] = React.useState(values[defaultIndex] ?? values[0]);
  React.useEffect(() => {
    if (!id || !persist) return;
    const stored = localStorage.getItem(id);
    if (stored && values.includes(stored)) setValue(stored);
  }, [id, persist, values]);
  const onValueChange = React.useCallback(
    (v: string) => {
      if (id && persist) localStorage.setItem(id, v);
      setValue(v);
    },
    [id, persist]
  );

  const tabChildren = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child) || child.type !== Tab) return child;
    const injectedValue = values[i];
    const resolved =
      child.props.value ??
      (child.props.title != null ? toValue(child.props.title) : undefined) ??
      injectedValue;
    if (resolved == null) return child;
    return React.cloneElement(child as React.ReactElement<{ value: string }>, { value: resolved });
  });

  return (
    <Primitive.Tabs value={value} onValueChange={onValueChange} {...rest}>
      <Primitive.TabsList>
        {items.map((item, i) => (
          <Primitive.TabsTrigger key={i} value={values[i]}>
            {item}
          </Primitive.TabsTrigger>
        ))}
      </Primitive.TabsList>
      {tabChildren}
    </Primitive.Tabs>
  );
}

export const Callout = ({
  children,
  type = "info",
  ...props
}: { children?: React.ReactNode; type?: string; emoji?: string } & React.ComponentProps<"div">) => (
  <div
    className={`rounded-lg border p-4 my-4 ${
      type === "info" ? "border-blue-200 bg-blue-50" : type === "warning" ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"
    }`}
    {...props}
  >
    {children}
  </div>
);

/** Renders markdown/code source in a scrollable code block (Nextra Playground-style). */
export const Playground = ({ source }: { source: string }) => (
  <pre className="p-4 overflow-auto rounded-lg border bg-muted/50 text-sm max-h-[70vh]">
    <code>{source}</code>
  </pre>
);
