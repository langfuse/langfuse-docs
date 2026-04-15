'use client';

import {
  type ComponentProps,
  type SyntheticEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';
import { Loader2, RefreshCw, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/ui/link';
import { AIChatEmptyState, AIChatMessage } from './ai-chat-shared';
import { Presence } from '@radix-ui/react-presence';
import { useAISearchContext, useChatContext, buildUserMessage } from './search-context';

// ─── Header ────────────────────────────────────────────────────────────────────

function AISearchPanelHeader({ className, ...props }: ComponentProps<'div'>) {
  const { setOpen } = useAISearchContext();

  return (
    <div
      className={cn(
        'sticky top-0 p-4 flex items-start gap-2 border-b border-line-structure',
        className,
      )}
      {...props}
    >
      <div className="flex-1">
        <Text size="m" className="text-left font-medium text-text-primary mb-1">
          Ask AI
        </Text>
        <Text size="s" className="text-left text-text-tertiary text-xs">
          Powered by{' '}
          <Link
            href="https://inkeep.com"
            className="text-text-tertiary decoration-line-structure underline-offset-2"
            variant="underline"
          >
            Inkeep AI
          </Link>
        </Text>
      </div>

      <Button
        variant="text"
        size="small"
        icon={<X className="size-4" />}
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="mt-1 mr-1"
      />
    </div>
  );
}

// ─── Input actions (retry / clear) ─────────────────────────────────────────────

function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === 'streaming';

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <Button
          variant="secondary"
          size="small"
          icon={<RefreshCw className="size-3.5" />}
          onClick={() => regenerate()}
        >
          Retry
        </Button>
      )}
      <Button
        variant="secondary"
        size="small"
        onClick={() => setMessages([])}
      >
        Clear Chat
      </Button>
    </>
  );
}

// ─── Input form ────────────────────────────────────────────────────────────────

const StorageKeyInput = '__ai_search_input';

function AISearchInput(props: ComponentProps<'form'>) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(() =>
    typeof window === 'undefined' ? '' : (localStorage.getItem(StorageKeyInput) ?? ''),
  );
  const isLoading = status === 'streaming' || status === 'submitted';

  const wasLoadingRef = useRef(false);
  useEffect(() => {
    if (!isLoading && wasLoadingRef.current) {
      document.getElementById('nd-ai-input')?.focus();
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0) return;

    void sendMessage(buildUserMessage(message));
    setInput('');
    localStorage.removeItem(StorageKeyInput);
  };

  return (
    <form {...props} className={cn('flex items-start pe-1', props.className)} onSubmit={onStart}>
      <TextareaAutoResize
        value={input}
        placeholder={isLoading ? 'AI is answering...' : 'Ask a question'}
        autoFocus
        className="p-3 text-[14px]"
        disabled={isLoading}
        onChange={(e) => {
          setInput(e.target.value);
          localStorage.setItem(StorageKeyInput, e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event);
          }
        }}
      />
      {isLoading ? (
        <Button
          key="bn"
          variant="secondary"
          type="button"
          onClick={stop}
          size="small"
          icon={<Loader2 className="size-3 animate-spin" />}
          wrapperClassName="mt-1"
        >
          Abort
        </Button>
      ) : (
        <Button
          key="bn"
          variant="primary"
          type="submit"
          disabled={input.length === 0}
          size="small"
          icon={<Send className="size-3.5" />}
          wrapperClassName="mt-1"
        />
      )}
    </form>
  );
}

// ─── Auto-resizing textarea ────────────────────────────────────────────────────

function TextareaAutoResize(props: ComponentProps<'textarea'>) {
  const shared = cn('col-start-1 row-start-1', props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
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

// ─── Scrollable message list ───────────────────────────────────────────────────

function ScrollList(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function scrollToBottom() {
      container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
    }

    const observer = new ResizeObserver(scrollToBottom);
    scrollToBottom();

    const child = container.firstElementChild;
    if (child) observer.observe(child);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn('overflow-y-auto min-w-0 flex flex-col', props.className)}
    >
      {props.children}
    </div>
  );
}

// ─── Message list panel (empty state + messages) ───────────────────────────────

function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');

  const sendExampleQuestion = (question: string) => {
    void chat.sendMessage(buildUserMessage(question));
  };

  return (
    <ScrollList
      className={cn('p-4 overscroll-contain', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
        ...style,
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <AIChatEmptyState onPickQuestion={sendExampleQuestion} />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((item) => (
            <AIChatMessage key={item.id} message={item} captureClicks />
          ))}
        </div>
      )}
    </ScrollList>
  );
}

// ─── Hotkey handler ────────────────────────────────────────────────────────────

function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, []);
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export function AISearchPanel() {
  const { open, setOpen } = useAISearchContext();
  useHotKey();

  return (
    <>
      <Presence present={open}>
        <div
          data-state={open ? 'open' : 'closed'}
          className="fixed inset-0 z-50 backdrop-blur-sm bg-[hsl(var(--primary)/0.3)] data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out wide:hidden"
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden z-50 bg-surface-1 text-text-primary [--ai-chat-width:400px] 2xl:[--ai-chat-width:460px] border-line-structure',
            'max-wide:fixed max-wide:inset-x-4 max-wide:bottom-8 max-wide:top-[calc(var(--fd-banner-height,0px)+var(--lf-nav-primary-height)+1rem)] max-wide:border max-wide:border-line-structure max-wide:shadow-xl max-wide:max-w-[600px] max-wide:mx-auto',
            'wide:sticky wide:top-[var(--fd-nav-height)] wide:h-[calc(100dvh-var(--fd-nav-height)-2px)] wide:border-l wide:ms-auto',
            'wide:in-[#nd-docs-layout]:[grid-area:toc] wide:in-[#nd-notebook-layout]:row-span-full wide:in-[#nd-notebook-layout]:col-start-5',
            'wide:in-[#home-layout]:top-[calc(var(--fd-banner-height,0px)+var(--lf-nav-primary-height))] wide:in-[#home-layout]:h-[calc(100dvh-var(--fd-banner-height,0px)-var(--lf-nav-primary-height))] wide:in-[#home-layout]:w-(--ai-chat-width) wide:in-[#home-layout]:shrink-0 wide:in-[#home-layout]:border-r',
            open
              ? 'animate-fd-dialog-in wide:animate-[ask-ai-open_200ms]'
              : 'animate-fd-dialog-out wide:animate-[ask-ai-close_200ms]',
          )}
        >
          <div className="flex flex-col size-full wide:w-(--ai-chat-width)">
            <AISearchPanelHeader />
            <AISearchPanelList className="flex-1" />
            <div className="border-t border-line-structure text-text-primary bg-surface-2">
              <AISearchInput />
              <div className="flex items-center gap-1 p-1 empty:hidden">
                <AISearchInputActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}
