import type { ReactNode } from "react";
import { FaqAsk } from "./FaqAsk";

/** Groups FAQ Details items and adds one shared question field after them. */
export function FaqDetails({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <FaqAsk details />
    </>
  );
}
