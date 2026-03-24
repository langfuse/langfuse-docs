import { Banner } from "./Banner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Background } from "../Background";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
      <Background />
    </>
  );
}
