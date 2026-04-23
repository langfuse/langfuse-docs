'use client';

import {
  type ComponentProps,
  type SyntheticEvent,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { RefreshCw, Send, Square, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/ui/link';
import { AIChatEmptyState, AIChatMessage, ThinkingIndicator } from './ai-chat-shared';
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

// ─── Input actions (retry / clear) — horizontal bar above input ────────────────

function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === 'streaming';

  if (messages.length === 0) return null;

  return (
    <div className="flex items-center gap-1 px-2 pt-2">
      {!isLoading && messages.at(-1)?.role === 'assistant' && (
        <Button
          variant="secondary"
          size="small"
          icon={<RefreshCw className="size-3" />}
          onClick={() => regenerate()}
        >
          Retry
        </Button>
      )}
      <Button
        variant="secondary"
        size="small"
        icon={<Trash2 className="size-3" />}
        onClick={() => setMessages([])}
      >
        Clear
      </Button>
    </div>
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
    <form {...props} className={cn('flex items-end gap-1 p-2', props.className)} onSubmit={onStart}>
      <TextareaAutoResize
        value={input}
        placeholder="Ask a question"
        autoFocus
        className="px-3 py-2 text-[16px] md:text-[14px]"
        disabled={false}
        onChange={(e) => {
          setInput(e.target.value);
          localStorage.setItem(StorageKeyInput, e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            if (isLoading) {
              event.preventDefault();
            } else {
              onStart(event);
            }
          }
        }}
      />
      {isLoading ? (
        <Button
          key="stop"
          variant="secondary"
          type="button"
          onClick={stop}
          size="small"
          icon={<Square className="size-3 fill-current" />}
          aria-label="Stop"
        />
      ) : (
        <Button
          key="send"
          variant="primary"
          type="submit"
          disabled={input.length === 0}
          size="small"
          icon={<Send className="size-3.5" />}
          aria-label="Send"
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

// ─── Scrollable message list with sticky auto-scroll ─────────────────────────

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

  // Scroll to bottom when message count increases (user sent a message)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
    isStuckRef.current = true;
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

// ─── Message list panel (empty state + messages) ───────────────────────────────

function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');
  const isWaiting = chat.status === 'submitted';
  const containerRef = useRef<HTMLDivElement>(null);

  useAutoScroll(containerRef, messages.length);

  const sendExampleQuestion = (question: string) => {
    void chat.sendMessage(buildUserMessage(question));
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-y-auto min-w-0 flex flex-col p-4 overscroll-contain', className)}
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
          {isWaiting && <ThinkingIndicator />}
        </div>
      )}
    </div>
  );
}

// ─── Hotkey handler ────────────────────────────────────────────────────────────

/** Matches Tailwind `max-wide` (see `--breakpoint-wide: 1440px` in style.css). */
function useAiPanelNarrowLayout() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1439px)');
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return narrow;
}

/**
 * Mobile keyboards shrink the visual viewport while `position: fixed` often stays tied to the
 * layout viewport — the composer can sit under the keyboard. Approximate overlap and lift the panel.
 */
function useVisualViewportBottomOverlap(active: boolean) {
  const [px, setPx] = useState(0);

  useEffect(() => {
    if (!active) {
      setPx(0);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setPx(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setPx(0);
    };
  }, [active]);

  return px;
}

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
  const narrowLayout = useAiPanelNarrowLayout();
  const keyboardOverlapPx = useVisualViewportBottomOverlap(open && narrowLayout);

  // Skip the enter animation when the panel remounts while already open
  // (e.g. navigating between layout groups).
  const mountedOpenRef = useRef(open);
  const [skipEnterAnimation, setSkipEnterAnimation] = useState(open);
  useLayoutEffect(() => {
    if (!mountedOpenRef.current) {
      setSkipEnterAnimation(false);
    }
  }, []);

  // Once the user closes the panel, never skip animation again for this mount.
  useEffect(() => {
    if (!open) setSkipEnterAnimation(false);
  }, [open]);

  return (
    <>
      <Presence present={open}>
        <div
          data-state={open ? 'open' : 'closed'}
          className={cn(
            'fixed inset-0 z-50 backdrop-blur-sm bg-[hsl(var(--primary)/0.3)] wide:hidden',
            skipEnterAnimation
              ? ''
              : 'data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out',
          )}
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden z-50 bg-surface-bg text-text-primary [--ai-chat-width:320px] border-line-structure',
            'max-wide:fixed max-wide:inset-x-4 max-md:bottom-4 max-md:top-4 max-wide:bottom-8 max-wide:top-8 max-wide:border max-wide:border-line-structure max-wide:shadow-xl max-wide:max-w-[600px] max-wide:mx-auto',
            'wide:sticky wide:top-[var(--fd-nav-height)] wide:h-[calc(100dvh-var(--fd-nav-height)-2px)] wide:border-l wide:ms-auto',
            'wide:in-[#nd-docs-layout]:[grid-area:toc] wide:in-[#nd-notebook-layout]:row-span-full wide:in-[#nd-notebook-layout]:col-start-5',
            'wide:in-[#home-layout]:top-[calc(var(--fd-banner-height,0px)+var(--lf-nav-primary-height))] wide:in-[#home-layout]:h-[calc(100dvh-var(--fd-banner-height,0px)-var(--lf-nav-primary-height))] wide:in-[#home-layout]:w-(--ai-chat-width) wide:in-[#home-layout]:shrink-0 wide:in-[#home-layout]:border-r',
            skipEnterAnimation
              ? ''
              : open
                ? 'animate-fd-dialog-in wide:animate-[ask-ai-open_200ms]'
                : 'animate-fd-dialog-out wide:animate-[ask-ai-close_200ms]',
          )}
          style={
            narrowLayout && keyboardOverlapPx > 0
              ? { bottom: `calc(2rem + ${keyboardOverlapPx}px)` }
              : undefined
          }
        >
          <div className="flex flex-col size-full min-h-0 wide:w-(--ai-chat-width)">
            <AISearchPanelHeader />
            <AISearchPanelList className="flex-1 min-h-0" />
            <div className="border-t border-line-structure text-text-primary bg-surface-1">
              <AISearchInputActions />
              <AISearchInput />
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}
