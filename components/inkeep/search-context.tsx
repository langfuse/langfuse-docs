'use client';

import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useChat, type UseChatHelpers } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { InkeepUIMessage } from '@/lib/ai/inkeep-qa-schema';

type AISearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<InkeepUIMessage>;
};

const Context = createContext<AISearchContextValue | null>(null);

const transport = new DefaultChatTransport({ api: '/api/chat' });

export function AISearch({ children }: { children: ReactNode }) {
  const existing = use(Context);
  if (existing) return <>{children}</>;

  return <AISearchInner>{children}</AISearchInner>;
}

function AISearchInner({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const chat = useChat<InkeepUIMessage>({
    id: 'search',
    transport,
  });

  useEffect(() => {
    document.documentElement.toggleAttribute('data-ai-panel-open', open);
  }, [open]);

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      {children}
    </Context>
  );
}

export function useAISearchContext() {
  const ctx = use(Context);
  if (!ctx) throw new Error('useAISearchContext must be used within <AISearch>');
  return ctx;
}

export function useChatContext() {
  return useAISearchContext().chat;
}

export function buildUserMessage(text: string) {
  return {
    role: 'user' as const,
    parts: [
      {
        type: 'data-client' as const,
        data: { location: location.href },
      },
      {
        type: 'text' as const,
        text,
      },
    ],
  };
}
