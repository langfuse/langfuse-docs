import type { ReactNode } from "react";
import { FaqAsk } from "./FaqAsk";

/** Groups FAQ Details items and adds one shared question field after them. */
export function FaqDetails({
  children,
  hideCursor = false,
}: {
  children: ReactNode;
  /** Drop the blinking cursor after "Ask another question". */
  hideCursor?: boolean;
}) {
  return (
    <>
      {children}
      <FaqAsk details hideCursor={hideCursor} />
    </>
  );
}
