import type { ReactNode } from "react";
import { HomeLayout } from "@/components/layout";

export default function ReinventLayout({ children }: { children: ReactNode }) {
  return <HomeLayout>{children}</HomeLayout>;
}
