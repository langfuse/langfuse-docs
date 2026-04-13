'use client';

import { AISearchTrigger, useAISearchContext } from "@/components/inkeep/search";
import { cn } from "@/lib/utils";

export const AskAIButton = () => {
  return (
    <AISearchTrigger>
      Ask AI
    </AISearchTrigger>
  );
};

export const FloatingAskAIButton = () => {
  const { open } = useAISearchContext();

  return (
    <div className={cn(
      'fixed bottom-4 max-w-[90px] inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))] z-20 transition-[translate,opacity]',
      'wide:hidden',
      open && 'translate-y-10 opacity-0',
    )}>
      <AISearchTrigger>
        Ask AI
      </AISearchTrigger>
    </div>
  );
};
