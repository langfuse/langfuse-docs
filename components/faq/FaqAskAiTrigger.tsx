"use client";

import { useAISearchContext } from "@/components/inkeep/search";
import { cn } from "@/lib/utils";
import styles from "./FaqAsk.module.css";

/**
 * Same idle “Ask anything else” row as FaqAsk, but opens the Inkeep Ask AI
 * sidebar instead of submitting to /api/faq-bot.
 */
export function FaqAskAiTrigger() {
  const { setOpen } = useAISearchContext();

  return (
    <div className="border-y border-line-structure">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-baseline gap-1 self-start py-5 text-left cursor-pointer rounded-[2px] text-text-primary",
          "font-analog text-[15px] font-medium leading-snug",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        Ask anything else
        <span aria-hidden="true" className={styles.cursor} />
      </button>
    </div>
  );
}
