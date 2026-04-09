import Script from "next/script";
import { HomeLayout } from "@/components/layout";
import { ForceLightMode } from "@/components/ForceLightMode";

export default function HomeLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Strip dark class before paint to prevent FOUC for dark-mode users */}
      <Script
        id="force-light-home"
        strategy="beforeInteractive"
      >{`document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light'`}</Script>
      <ForceLightMode />
      <HomeLayout>{children}</HomeLayout>
    </>
  );
}
