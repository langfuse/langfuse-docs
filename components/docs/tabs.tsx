import {
  Tabs as FumadocsTabs,
  Tab as FumadocsTab,
  TabsContent as FumadocsTabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import { cn } from "@/lib/utils";
import type React from "react";

const tabContentClass = "!bg-card tabs-content-normalized";

// Attach Tab as a static property so <Tabs.Tab> works as a member expression
// in MDX v3 (which compiles it as Tabs.Tab, not components["Tabs.Tab"]).
export function TabsContent({
  className,
  forceMount = true,
  ...props
}: React.ComponentProps<typeof FumadocsTabsContent>) {
  return (
    <FumadocsTabsContent
      forceMount={forceMount}
      className={cn(tabContentClass, className)}
      {...props}
    />
  );
}

export function Tab({
  className,
  forceMount = true,
  ...props
}: React.ComponentProps<typeof FumadocsTab>) {
  return (
    <FumadocsTab
      forceMount={forceMount}
      className={cn(tabContentClass, className)}
      {...props}
    />
  );
}

export const Tabs = Object.assign(FumadocsTabs, { Tab });
export { TabsList, TabsTrigger };
