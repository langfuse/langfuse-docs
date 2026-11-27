import type { ReactNode } from "react";

// The calendar owns its full-screen introduction and compact navigation.
export default function AdventLayout({ children }: { children: ReactNode }) {
  return <main>{children}</main>;
}
