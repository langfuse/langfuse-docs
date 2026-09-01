import type { ReactNode } from "react";
import { HomeLayout } from "@/components/layout";

/**
 * Shared layout for the pricing pages (/pricing and /pricing-self-host).
 * Renders the default HomeLayout but without the right aside — the
 * pricing content spans the full main area under the navbar.
 */
export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      showAside={false}
      footerClassName="md:max-w-none xl:max-w-none px-4 sm:px-6 md:px-8"
    >
      {children}
    </HomeLayout>
  );
}
