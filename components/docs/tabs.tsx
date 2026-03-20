import * as React from "react";
import {
  Tabs as FumadocsTabs,
  Tab as FumadocsTab,
  TabsContent as FumadocsTabsContent,
  TabsList as FumadocsTabsList,
  TabsTrigger as FumadocsTabsTrigger,
} from "fumadocs-ui/components/tabs";
import { cn } from "@/lib/utils";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof FumadocsTabsList>
>(({ className, ...props }, ref) => (
  <FumadocsTabsList
    ref={ref}
    className={cn(
      "flex overflow-x-auto overflow-y-hidden flex-nowrap gap-1 px-4 pt-1 rounded-t-xl border-b text-muted-foreground not-prose bg-muted/50 border-border min-h-11",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof FumadocsTabsTrigger>
>(({ className, ...props }, ref) => (
  <FumadocsTabsTrigger
    ref={ref}
    className={cn(
      "inline-flex items-center gap-2 whitespace-nowrap rounded-none border-b-2 border-transparent px-2.5 pb-2 pt-1.5 -mb-px text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-muted-blue data-[state=active]:text-muted-blue data-[state=active]:font-medium",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof FumadocsTabs>) {
  return (
    <FumadocsTabs
      className={cn(
        "flex overflow-hidden flex-col my-4 rounded-xl border border-border bg-background dark:bg-card",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof FumadocsTabsContent>) {
  return (
    <FumadocsTabsContent
      className={cn("bg-white dark:bg-card rounded-b-xl", className)}
      {...props}
    />
  );
}

function Tab({
  className,
  ...props
}: React.ComponentProps<typeof FumadocsTab>) {
  return (
    <FumadocsTab
      className={cn("bg-white dark:bg-card rounded-b-xl", className)}
      {...props}
    />
  );
}

// Attach Tab as a static property so <Tabs.Tab> works as a member expression
// in MDX v3 (which compiles it as Tabs.Tab, not components["Tabs.Tab"]).
const TabsWithStaticTab = Object.assign(Tabs, { Tab });

export { TabsWithStaticTab as Tabs, Tab, TabsContent, TabsList, TabsTrigger };
