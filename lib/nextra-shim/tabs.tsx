/**
 * Server-safe nextra shim: Tabs, Tab, FileTree.
 *
 * No "use client" here. The hook-based logic lives in ./tabs-client.tsx.
 * Tabs is a server wrapper that injects tab values by position into its children,
 * then hands off rendering to TabsClient (the "use client" component).
 * This lets MDX run on the server while still supporting Tabs.Tab property access
 * (since Tabs here is a plain function whose .Tab property is accessible in RSC).
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { TabsContent as FumadocsTabsContent } from "fumadocs-ui/components/ui/tabs";
import { TabsClient, FileTreeFolder } from "./tabs-client";
import type { TabsClientProps } from "./tabs-client";

function toValue(s: string): string {
  return s.toLowerCase().replace(/\s/g, "-");
}

/** Flatten so that Fragment wrappers (e.g. from MDX) don't hide Tab children; we need one injected value per Tab. */
function flattenTabChildren(children: React.ReactNode): React.ReactElement[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return flattenTabChildren(child.props.children);
    }
    return React.isValidElement(child) ? [child] : [];
  });
}

/** Tab panel — server-safe, no hooks. Value is injected by the parent Tabs wrapper. */
export const Tab = ({
  value: valueProp,
  title,
  className,
  children,
  ...props
}: React.ComponentProps<typeof FumadocsTabsContent> & { title?: string }) => {
  // Do NOT derive value from title: when Tab is pre-rendered on the server as a child
  // of a "use client" LangTabs, the title-derived value prevents the parent Tabs shim
  // from applying the correct positional injection on the client side.
  // Use "" as placeholder so all tabs are eligible for positional injection.
  return (
    <FumadocsTabsContent
      value={valueProp ?? ""}
      className={cn("p-4 prose-no-margin bg-background rounded-b-xl", className)}
      {...props}
    >
      {children}
    </FumadocsTabsContent>
  );
};

type TabsProps = Omit<TabsClientProps, "values"> & {
  items?: string[];
  storageKey?: string;
};

/**
 * Tabs root — server-safe wrapper.
 * Computes tab values, injects them positionally into Tab children on the server,
 * then delegates to TabsClient for active-tab state management.
 */
export function Tabs({
  items = [],
  id,
  persist,
  defaultIndex = 0,
  selectedIndex,
  onChange,
  storageKey: _storageKey,
  children,
}: TabsProps) {
  const values = items.map(toValue);

  // Flatten Fragment wrappers (MDX often passes a single Fragment containing all Tabs)
  // so we inject one value per Tab. Then inject values into children by position.
  const flat = flattenTabChildren(children);
  let childIndex = 0;
  const tabChildren = flat.map((child) => {
    const existingValue = (child.props as { value?: string }).value;
    if (existingValue != null && existingValue !== "") return child;
    const injectedValue = values[childIndex++];
    if (injectedValue == null) return child;
    return React.cloneElement(
      child as React.ReactElement<{ value: string }>,
      { value: injectedValue }
    );
  });

  return (
    <TabsClient
      items={items}
      values={values}
      defaultIndex={defaultIndex}
      persist={persist}
      id={id}
      selectedIndex={selectedIndex}
      onChange={onChange}
    >
      {tabChildren}
    </TabsClient>
  );
}

// Compound component — .Tab is a plain function property accessible in RSC.
(Tabs as React.FunctionComponent & { Tab: typeof Tab }).Tab = Tab;

/** FileTree leaf — server-safe, no hooks. */
const FileTreeFile = ({
  name,
  active,
}: {
  name: string;
  active?: boolean;
}) => (
  <li className="flex items-center gap-1.5 py-0.5 text-sm">
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-muted-foreground"
      fill="currentColor"
    >
      <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5V2.5z" />
    </svg>
    <span className={active ? "font-semibold" : ""}>{name}</span>
  </li>
);

/** File-tree root — server-safe, no hooks. */
export function FileTree({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="not-prose rounded-lg border p-4 font-mono text-sm my-4 [&_ul]:mt-0.5">
      {children}
    </ul>
  );
}

// Compound component properties — accessible as plain properties in RSC.
FileTree.File = FileTreeFile;
FileTree.Folder = FileTreeFolder; // client component, but set as a plain property on a server function

// Named exports for use as compound map keys ("FileTree.File", "FileTree.Folder")
export { FileTreeFile, FileTreeFolder };
