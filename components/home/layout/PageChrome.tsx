import type { ReactNode } from "react";
import { Banner } from "../../layout/Banner";
import { Navbar } from "../../layout/Navbar";
import { AISearch, FloatingAskAI } from "@/components/inkeep/search";
import { ForceLightMode } from "@/components/ForceLightMode";

/**
 * Shared page chrome for light-mode marketing-style pages.
 * Provides AISearch context, forced light mode, Banner, Navbar,
 * and the floating AI button. Used by HomeLayout and standalone layouts
 * (e.g. blog) that manage their own content grid.
 */
export function PageChrome({
  children,
  forceLight = true,
}: {
  children: ReactNode;
  forceLight?: boolean;
}) {
  return (
    <AISearch>
      {forceLight ? <ForceLightMode /> : null}
      <Banner />
      <Navbar />
      {children}
      <FloatingAskAI />
    </AISearch>
  );
}
