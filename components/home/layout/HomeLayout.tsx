import { Banner } from "../../layout/Banner";
import { Navbar } from "../../layout/Navbar";
import { Footer } from "../../layout/Footer";
import { HomeSidebar } from "./HomeSidebar";
import { HomeAside } from "./HomeAside";
import { HomeMainArea } from "./HomeMainArea";

type HomeLayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout for the homepage and all marketing/wide pages.
 * Three-column grid matching the docs layout structure:
 * [HomeSidebar 240px] | [content 1fr, pattern-bg] | [HomeAside 240px]
 */
export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Banner />
      <Navbar />
      <div className="flex flex-1 mx-auto w-full min-h-0 max-w-360">
        <HomeSidebar />
        <HomeMainArea>
          {children}
          <Footer />
        </HomeMainArea>
        <HomeAside />
      </div>
    </>
  );
}
