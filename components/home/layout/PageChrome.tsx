import type { ReactNode } from "react";
import Script from "next/script";
import { Banner } from "../../layout/Banner";
import { Navbar } from "../../layout/Navbar";
import { AISearch, FloatingAskAIButton } from "@/components/inkeep/search";
import { ForceLightMode } from "@/components/ForceLightMode";

/**
 * Shared page chrome for light-mode marketing-style pages.
 * Provides AISearch context, force-light-mode script, Banner, Navbar,
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
      {forceLight ? (
        <>
          <Script
            id="force-light-home"
            strategy="beforeInteractive"
          >{`document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'`}</Script>
          <ForceLightMode />
        </>
      ) : null}
      <Banner />
      <Navbar />
      {children}
      <FloatingAskAIButton />
    </AISearch>
  );
}
