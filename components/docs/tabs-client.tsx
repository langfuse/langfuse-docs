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
      "flex overflow-x-auto overflow-y-hidden flex-nowrap gap-1 px-4 pt-1 rounded-t-xl border-b text-muted-foreground not-prose bg-muted/50 border-border min-h-11",
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
      "inline-flex items-center gap-2 whitespace-nowrap rounded-none border-b-2 border-transparent px-2.5 pb-2 pt-1.5 -mb-px text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-muted-blue data-[state=active]:text-muted-blue data-[state=active]:font-medium",
      className
    )}
    {...props}
  />
));
FumadocsTabsTrigger.displayName = "FumadocsTabsTrigger";

export type TabsClientProps = {
  items?: string[];
  values: string[];
  id?: string;
  persist?: boolean;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  children?: React.ReactNode;
};

/** Client component: manages active-tab state and renders tab headers. */
export function TabsClient({
  items = [],
  values,
  id,
  persist,
  defaultIndex = 0,
  selectedIndex,
  onChange,
  children,
}: TabsClientProps) {
  const [internalValue, setInternalValue] = React.useState(
    values[defaultIndex] ?? values[0]
  );

  React.useEffect(() => {
    if (!id || !persist) return;
    const stored = localStorage.getItem(id);
    if (stored && values.includes(stored)) setInternalValue(stored);
  }, [id, persist, values]);

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

  return (
    <FumadocsTabs
      value={value}
      onValueChange={onValueChange}
      className="flex overflow-hidden flex-col my-4 rounded-xl border border-border bg-card"
    >
      <FumadocsTabsList>
        {items.map((item, i) => (
          <FumadocsTabsTrigger key={i} value={values[i]}>
            {item}
          </FumadocsTabsTrigger>
        ))}
      </FumadocsTabsList>
      {children}
    </FumadocsTabs>
  );
}

/** FileTree folder node — uses useState for open/close. */
export const FileTreeFolder = ({
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
        <svg
          viewBox="0 0 16 16"
          className="w-4 h-4 shrink-0 text-muted-foreground"
          fill="currentColor"
        >
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

export { FumadocsTabsContent as TabsContent };
