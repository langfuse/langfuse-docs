"use client";

import { useAISearchContext } from "./search-context";

export function AskAiLink({ children }: { children?: React.ReactNode }) {
  const { setOpen } = useAISearchContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline text-text-secondary hover:text-text-primary underline underline-offset-2 decoration-line-structure hover:decoration-text-tertiary transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
    >
      {children ?? "Ask AI"}
    </button>
  );
}
