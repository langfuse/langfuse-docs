import type { ReactNode } from "react";
import Script from "next/script";
import { Banner } from "../../layout/Banner";
import { Navbar } from "../../layout/Navbar";
import { Footer } from "../../layout/Footer";
import { HomeSidebar } from "./HomeSidebar";
import { HomeAside } from "./HomeAside";
import { HomeMainArea } from "./HomeMainArea";
import { AISearch, AISearchPanel, FloatingAskAIButton } from "@/components/inkeep/search";
import { ForceLightMode } from "@/components/ForceLightMode";

type HomeLayoutProps = {
  children: ReactNode;
  /** Right TOC / utility column. Default: true. */
  showAside?: boolean;
};

/**
 * Layout for the homepage and all marketing/wide pages.
 * Three-column grid matching the docs layout structure:
 * [HomeSidebar 240px] | [content 1fr, pattern-bg] | [HomeAside 240px]
 */
export function HomeLayout({
  children,
  showAside = true,
}: HomeLayoutProps) {
  return (
    <AISearch>
      {/* Strip dark before paint (next-themes uses class on html; some code paths may touch body). */}
      <Script
        id="force-light-home"
        strategy="beforeInteractive"
      >{`(function(){var h=document.documentElement,b=document.body;h.classList.remove('dark');b.classList.remove('dark');h.style.colorScheme='light';})()`}</Script>
      <ForceLightMode />
      <Banner />
      <Navbar />
      <div id="home-layout" className="flex flex-1 mx-auto w-full min-h-0 max-w-360">
        <HomeSidebar />
        <HomeMainArea>
          {children}
          <Footer />
        </HomeMainArea>
        {showAside ? <HomeAside /> : null}
        <AISearchPanel />
      </div>
      <FloatingAskAIButton />
    </AISearch>
  );
}
