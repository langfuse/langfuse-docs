import type { ReactNode } from "react";
import { Footer } from "../../layout/Footer";
import { HomeSidebar } from "./HomeSidebar";
import { HomeAside } from "./HomeAside";
import { HomeMainArea } from "./HomeMainArea";
import { AISearchPanel } from "@/components/inkeep/search";
import { PageChrome } from "./PageChrome";
import { cn } from "@/lib/utils";

type ContentColumnsProps = {
  children: ReactNode;
  showAside?: boolean;
  showLeftSidebar?: boolean;
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
  footerClassName?: string;
};

/**
 * Three-column layout: left sidebar | content | right sidebar.
 * Used inside PageChrome (or any wrapper that provides the outer chrome).
 * Pass `leftSidebar` / `rightSidebar` to swap the default sidebars.
 * Set `showLeftSidebar={false}` to drop the left column and give the page more width.
 * Industry pages hide both sidebars and keep the content column flush with the
 * navbar (`max-w-380`), so do not add side gutters there.
 */
function AsideEdge() {
  return (
    <div
      aria-hidden
      className="hidden lg:block w-px shrink-0 bg-line-structure"
    />
  );
}

export function ContentColumns({
  children,
  showAside = true,
  showLeftSidebar = true,
  leftSidebar,
  rightSidebar,
  className,
  footerClassName,
}: ContentColumnsProps) {
  // Pages that only hide the aside keep a 1px structural edge.
  // Pages that hide both sidebars (financial-services, healthcare) stay flush
  // with the navbar instead of insetting the column.
  const rightFallback = showLeftSidebar ? <AsideEdge /> : null;

  return (
    <div
      id="home-layout"
      className={cn(
        "flex flex-1 mx-auto w-full min-h-0 max-w-380 overflow-clip",
        className,
      )}
    >
      {showLeftSidebar ? (leftSidebar ?? <HomeSidebar />) : null}
      <HomeMainArea>
        {children}
        <Footer className={footerClassName} />
      </HomeMainArea>
      {showAside ? (rightSidebar ?? <HomeAside />) : rightFallback}
      <AISearchPanel />
    </div>
  );
}

type HomeLayoutProps = ContentColumnsProps & {
  forceLight?: boolean;
};

/**
 * Full-page layout for the homepage and all marketing/wide pages.
 * Wraps ContentColumns with PageChrome (banner, navbar, AI search).
 */
export function HomeLayout({
  children,
  showAside = true,
  showLeftSidebar = true,
  leftSidebar,
  rightSidebar,
  className,
  footerClassName,
  forceLight = true,
}: HomeLayoutProps) {
  return (
    <PageChrome forceLight={forceLight}>
      <ContentColumns
        showAside={showAside}
        showLeftSidebar={showLeftSidebar}
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
        className={className}
        footerClassName={footerClassName}
      >
        {children}
      </ContentColumns>
    </PageChrome>
  );
}
