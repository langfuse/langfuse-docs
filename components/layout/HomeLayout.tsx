import { Banner } from "./Banner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Background } from "../Background";
import { HomeSidebar } from "./HomeSidebar";
import { HomeAside } from "./HomeAside";
import { HomeMainArea } from "./HomeMainArea";

type HomeLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout for the homepage and all marketing/wide pages.
 * Three-column grid matching the docs layout structure:
 *   [HomeSidebar 240px] | [content 1fr, pattern-bg] | [HomeAside 240px]
 */
export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Banner />
      <Navbar />
      <div className="flex flex-1 min-h-0 w-full max-w-360 mx-auto">
        <HomeSidebar />
        <HomeMainArea>
          {children}
        </HomeMainArea>
        <HomeAside />
      </div>
      <Footer />
      <Background />
    </>
  );
}
