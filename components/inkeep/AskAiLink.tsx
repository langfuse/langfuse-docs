"use client";

import { useAISearchContext } from "./search-context";

export function AskAiLink({ children }: { children?: React.ReactNode }) {
  const { setOpen } = useAISearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline text-text-links hover:text-text-links underline underline-offset-2 decoration-text-links/40 hover:decoration-text-links transition-colors cursor-pointer bg-transparent border-none p-0 font-[inherit] text-[length:inherit]"
    >
      {children ?? "Ask AI"}
    </button>
  );
}
