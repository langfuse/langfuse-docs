import { Banner } from "./Banner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

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
    </>
  );
}
