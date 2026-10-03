import {
  TabsContent as FumadocsTabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import { cn } from "@/lib/utils";
import type React from "react";
import { LangTab, LangTabs } from "@/components/LangTabs";

const tabContentClass = "!bg-card tabs-content-normalized";

// MDX maps Tabs/Tab to LangTabs. Re-export the same wrapper here so persist
// grouping cannot drift between two tab implementations.
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

export const Tabs = Object.assign(LangTabs, { Tab: LangTab });
export { LangTab as Tab, TabsList, TabsTrigger };
