import { ReactNode, Suspense } from "react";
import Nav from "../components/Nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Nav />
      <div className="min-h-screen dark:bg-black sm:pl-60">{children}</div>
    </div>
  );
}