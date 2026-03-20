import {
  Tabs as FumadocsTabs,
  Tab,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";

// Attach Tab as a static property so <Tabs.Tab> works as a member expression
// in MDX v3 (which compiles it as Tabs.Tab, not components["Tabs.Tab"]).
export const Tabs = Object.assign(FumadocsTabs, { Tab });
export { Tab, TabsContent, TabsList, TabsTrigger };
