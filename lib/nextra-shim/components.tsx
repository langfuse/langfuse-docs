/**
 * Shim for nextra/components (Cards, Tabs, Callout) so existing components render.
 * Re-export Fumadocs or simple equivalents where possible.
 */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tabs as FumadocsTabs,
  TabsList as FumadocsTabsListPrimitive,
  TabsContent as FumadocsTabsContent,
  TabsTrigger as FumadocsTabsTriggerPrimitive,
} from "fumadocs-ui/components/ui/tabs";

const FumadocsTabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof FumadocsTabsListPrimitive>
>(({ className, ...props }, ref) => (
  <FumadocsTabsListPrimitive
    ref={ref}
    className={cn(
      "flex gap-3.5 text-fd-secondary-foreground overflow-x-auto px-4 not-prose",
      className
    )}
    {...props}
  />
));
FumadocsTabsList.displayName = "FumadocsTabsList";

const FumadocsTabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof FumadocsTabsTriggerPrimitive>
>(({ className, value, ...props }, ref) => (
  <FumadocsTabsTriggerPrimitive
    ref={ref}
    value={value}
    className={cn(
      "inline-flex items-center gap-2 whitespace-nowrap text-fd-muted-foreground border-b border-transparent py-2 text-sm font-medium transition-colors hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-fd-primary data-[state=active]:text-fd-primary",
      className
    )}
    {...props}
  />
));
FumadocsTabsTrigger.displayName = "FumadocsTabsTrigger";

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
}: React.ComponentProps<typeof FumadocsTabsContent> & { title?: string }) => {
  const value = valueProp ?? (title != null ? toValue(title) : undefined);
  return (
    <FumadocsTabsContent
      value={value!}
      className={cn("p-4 prose-no-margin", className)}
      {...props}
    >
      {children}
    </FumadocsTabsContent>
  );
};

/** Tabs root: accepts items (labels) and injects value into each Tab by order. */
export function Tabs({
  items = [],
  id,
  persist,
  defaultIndex = 0,
  selectedIndex,
  onChange,
  storageKey: _storageKey,
  children,
}: {
  items?: string[];
  id?: string;
  persist?: boolean;
  defaultIndex?: number;
  /** Controlled mode: externally managed tab index (for LangTabs) */
  selectedIndex?: number;
  /** Controlled mode: called when user selects a tab (receives numeric index) */
  onChange?: (index: number) => void;
  /** Ignored — provided for API compatibility with older Nextra Tabs */
  storageKey?: string;
  children?: React.ReactNode;
}) {
  const values = React.useMemo(() => items.map(toValue), [items]);
  const [internalValue, setInternalValue] = React.useState(
    values[defaultIndex] ?? values[0]
  );
  React.useEffect(() => {
    if (!id || !persist) return;
    const stored = localStorage.getItem(id);
    if (stored && values.includes(stored)) setInternalValue(stored);
  }, [id, persist, values]);

  // Controlled mode: if selectedIndex provided, use it; otherwise fall back to
  // internal state driven by user clicks.
  const controlledValue =
    selectedIndex !== undefined ? values[selectedIndex] ?? values[0] : undefined;
  const value = controlledValue ?? internalValue;

  const onValueChange = React.useCallback(
    (v: string) => {
      if (id && persist) localStorage.setItem(id, v);
      setInternalValue(v);
      if (onChange) {
        const idx = values.indexOf(v);
        if (idx !== -1) onChange(idx);
      }
    },
    [id, persist, onChange, values]
  );

  const tabChildren = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child) || child.type !== Tab) return child;
    const injectedValue = values[i];
    // Always use injectedValue (position-based) unless explicit value prop is set.
    // Title-based derivation is NOT used here because the tab label in `items` may
    // differ from the Tab's `title` prop (e.g. items="Python SDK" but title="Python SDK (v3)").
    const resolved = child.props.value ?? injectedValue;
    if (resolved == null) return child;
    return React.cloneElement(child as React.ReactElement<{ value: string }>, { value: resolved });
  });

  return (
    <FumadocsTabs
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col overflow-hidden rounded-xl border bg-fd-secondary my-4"
    >
      <FumadocsTabsList>
        {items.map((item, i) => (
          <FumadocsTabsTrigger key={i} value={values[i]}>
            {item}
          </FumadocsTabsTrigger>
        ))}
      </FumadocsTabsList>
      {tabChildren}
    </FumadocsTabs>
  );
}

// Compound component: MDX uses <Tabs.Tab> (e.g. integration-learn-more.mdx), so Tabs.Tab must be defined.
(Tabs as React.FunctionComponent & { Tab: typeof Tab }).Tab = Tab;

export const Callout = ({
  children,
  type = "info",
  ...props
}: { children?: React.ReactNode; type?: string; emoji?: string } & React.ComponentProps<"div">) => (
  <div
    className={`rounded-lg border p-4 my-4 ${
      type === "info" ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50" : type === "warning" ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
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

/** Numbered step list — wraps children in a styled ordered-list container. */
export function Steps({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="steps ml-4 border-l pl-8 [counter-reset:step]" {...props}>
      {children}
    </div>
  );
}

const FileTreeFile = ({
  name,
  active,
}: {
  name: string;
  active?: boolean;
}) => (
  <li className="flex items-center gap-1.5 py-0.5 text-sm">
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-muted-foreground" fill="currentColor">
      <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5V2.5z" />
    </svg>
    <span className={active ? "font-semibold" : ""}>{name}</span>
  </li>
);

const FileTreeFolder = ({
  name,
  children,
  defaultOpen = false,
}: {
  name: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <li className="py-0.5">
      <button
        className="flex items-center gap-1.5 text-sm hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <svg
          viewBox="0 0 16 16"
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
          fill="currentColor"
        >
          <path d="M6 3l5 5-5 5V3z" />
        </svg>
        <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-muted-foreground" fill="currentColor">
          <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5L6.25 1h-4.5z" />
        </svg>
        <span>{name}</span>
      </button>
      {open && children && (
        <ul className="ml-5 border-l pl-2 mt-0.5">{children}</ul>
      )}
    </li>
  );
};

/** File-tree component matching Nextra's FileTree API. */
export function FileTree({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="not-prose rounded-lg border p-4 font-mono text-sm my-4 [&_ul]:mt-0.5">
      {children}
    </ul>
  );
}

FileTree.File = FileTreeFile;
FileTree.Folder = FileTreeFolder;
