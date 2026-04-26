import type { ReactNode } from "react";
import { HomeLayout } from "@/components/layout";

export default function JapanLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      showAside={false}
      footerClassName="md:max-w-none xl:max-w-none px-4 sm:px-6 md:px-8"
    >
      {children}
    </HomeLayout>
  );
}
