'use client';

import {
  type ComponentProps,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RefreshCw, Send, Square, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/ui/link';
import { AIChatEmptyState, AIChatMessage, ThinkingIndicator } from './ai-chat-shared';
import { useChatContext, buildUserMessage } from './search-context';

function EmbeddedTextarea(props: ComponentProps<'textarea'>) {
  const shared = cn('col-start-1 row-start-1', props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-embedded-ai-input"
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-text-tertiary focus-visible:outline-none',
          shared,
        )}
      />
      <div className={cn(shared, 'break-all invisible')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  );
}

const SCROLL_THRESHOLD = 40;

function useAutoScroll(containerRef: React.RefObject<HTMLDivElement | null>, messageCount: number) {
  const isStuckRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onScroll() {
      if (!el) return;
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isStuckRef.current = distFromBottom <= SCROLL_THRESHOLD;
    }

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isStuckRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
  }, [messageCount, containerRef]);

  // Re-observe when messageCount changes (child element may have changed)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.firstElementChild;
    if (!child) return;

    const observer = new ResizeObserver(() => {
      if (isStuckRef.current) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
      }
    });
    observer.observe(child);
    return () => observer.disconnect();
  }, [containerRef, messageCount]);
}

export function EmbeddedAIChat() {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');
  const isLoading = chat.status === 'streaming' || chat.status === 'submitted';

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useAutoScroll(scrollRef, messages.length);

  const onSubmit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0) return;

    void chat.sendMessage(buildUserMessage(message));
    setInput('');
  };

  return (
    <div className="border border-line-structure overflow-hidden flex flex-col h-[min(600px,70vh)]">
      <div className="not-prose flex items-center gap-2 px-4 py-3 border-b border-line-structure bg-surface-1">
        <img src="/brand-assets/icon/color/langfuse-icon.png" alt="Langfuse" className="size-5" />
        <Text size="s" className="font-medium text-text-primary">
          Langfuse Help Agent
        </Text>
        <Text size="s" className="text-text-tertiary text-xs">
          — Powered by{' '}
          <Link
            href="https://inkeep.com"
            className="text-text-tertiary decoration-line-structure underline-offset-2"
            variant="underline"
          >
            Inkeep AI
          </Link>
        </Text>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 overscroll-contain bg-surface-1">
        {messages.length === 0 ? (
          <AIChatEmptyState
            onPickQuestion={(question) => {
              void chat.sendMessage(buildUserMessage(question));
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((item) => (
              <AIChatMessage key={item.id} message={item} />
            ))}
            {chat.status === 'submitted' && <ThinkingIndicator />}
          </div>
        )}
      </div>

      <div className="not-prose border-t border-line-structure bg-surface-1">
        {messages.length > 0 && (
          <div className="flex items-center gap-1 px-2 pt-2">
            {!isLoading && messages.at(-1)?.role === 'assistant' && (
              <Button
                variant="secondary"
                size="small"
                icon={<RefreshCw className="size-3" />}
                onClick={() => chat.regenerate()}
              >
                Retry
              </Button>
            )}
            <Button
              variant="secondary"
              size="small"
              icon={<Trash2 className="size-3" />}
              onClick={() => { chat.stop(); chat.setMessages([]); }}
            >
              Clear
            </Button>
          </div>
        )}
        <form className="flex items-end gap-1 p-2" onSubmit={onSubmit}>
          <EmbeddedTextarea
            value={input}
            placeholder="Ask a question"
            autoFocus={false}
            className="px-3 py-2 text-[14px]"
            disabled={false}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (!event.shiftKey && event.key === 'Enter') {
                if (isLoading) {
                  event.preventDefault();
                } else {
                  onSubmit(event);
                }
              }
            }}
          />
          {isLoading ? (
            <Button
              variant="secondary"
              type="button"
              onClick={chat.stop}
              size="small"
              icon={<Square className="size-3 fill-current" />}
              aria-label="Stop"
            />
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={input.length === 0}
              size="small"
              icon={<Send className="size-3.5" />}
              aria-label="Send"
            />
          )}
        </form>
      </div>
    </div>
  );
}
