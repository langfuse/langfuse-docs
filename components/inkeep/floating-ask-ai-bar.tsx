'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAISearchContext, useChatContext, buildUserMessage } from './search-context';
import { useVisualViewportBottomOverlap } from './search-panel';
import { FloatingAskAIButton } from './ask-ai-button';

// Pages where we suppress the prominent bar and fall back to the legacy black pill.
// Reasons:
//   - Inline AI chat already on the page (would stack two AI surfaces)
//   - Strong conversion CTA the bar would compete with
//   - Legal copy where AI rephrasing creates compliance risk
//   - App proxy / custom landing pages where the bar would look out of place
const ASK_AI_BAR_HIDDEN_PATHS: ReadonlyArray<RegExp> = [
  // Inline AI chat already on the page
  /^\/docs\/ask-ai(\/|$)/,
  /^\/faq(\/|$)/,
  // Conversion-focused
  /^\/talk-to-us(\/|$)/,
  /^\/watch-demo(\/|$)/,
  /^\/pricing(\/|$)/,
  /^\/pricing-self-host(\/|$)/,
  /^\/careers(\/|$)/,
  // Legal
  /^\/imprint(\/|$)/,
  /^\/privacy(\/|$)/,
  /^\/terms(\/|$)/,
  /^\/cookie-policy(\/|$)/,
  /^\/security\/dpa(\/|$)/,
  // App proxy
  /^\/cloud(\/|$)/,
  // Custom-designed regional / annual landing pages
  /^\/japan(\/|$)/,
  /^\/cn(\/|$)/,
  /^\/kr(\/|$)/,
  /^\/wrapped(\/|$)/,
];

function isBarHidden(pathname: string): boolean {
  return ASK_AI_BAR_HIDDEN_PATHS.some((p) => p.test(pathname));
}

export function FloatingAskAI() {
  const pathname = usePathname() ?? '';
  if (isBarHidden(pathname)) return <FloatingAskAIButton />;
  return <FloatingAskAIBar />;
}

export function FloatingAskAIBar() {
  const { open, setOpen } = useAISearchContext();
  const chat = useChatContext();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const keyboardOverlapPx = useVisualViewportBottomOverlap(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // While the panel is open, let the panel/AISearchTrigger handle the key —
      // don't focus the (now-hidden) bar input.
      if (openRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat) return;
      if (e.key.toLowerCase() !== 'a') return;
      const t = e.target;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement
      ) return;
      if (t instanceof HTMLElement && t.isContentEditable) return;
      // Suppress AISearchTrigger's bare-`a` shortcut so it doesn't open the
      // panel underneath us. We register in capture phase so we run first.
      e.stopImmediatePropagation();
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, []);

  const submit = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    setOpen(true);
    if (message.length === 0) return;
    void chat.sendMessage(buildUserMessage(message));
    setInput('');
  };

  const hasInput = input.trim().length > 0;

  return (
    <div
      // `inert` removes the subtree from focus order and the accessibility
      // tree while the panel is open, so Tab navigation and screen readers
      // don't land on the (visually hidden) input/submit button.
      inert={open}
      aria-hidden={open || undefined}
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(427px,calc(100%-2rem))]',
        'transition-[translate,opacity] duration-200',
        open && 'translate-y-16 opacity-0 pointer-events-none',
      )}
      style={
        keyboardOverlapPx > 0
          ? { bottom: `calc(1rem + ${keyboardOverlapPx}px)` }
          : undefined
      }
    >
      <form
        onSubmit={submit}
        className={cn(
          'flex items-center gap-2 pl-3 pr-1 py-1 rounded-[2px]',
          'bg-surface-1 border border-line-structure',
          'shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.06)]',
          'focus-within:border-line-cta transition-colors',
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question"
          className={cn(
            'flex-1 min-w-0 bg-transparent border-0 outline-none',
            'font-sans text-[13px] font-[450] leading-[150%] tracking-[-0.06px]',
            'text-text-primary placeholder:text-text-tertiary',
            'focus-visible:outline-none',
          )}
          aria-label="Ask AI a question"
        />
        <kbd
          className={cn(
            'hidden sm:flex justify-center items-center not-italic shrink-0',
            'h-[26px] w-[26px] rounded-[2px]',
            'border border-[rgba(64,61,57,0.20)] dark:border-[rgba(184,182,160,0.30)]',
            'bg-[rgba(64,61,57,0.10)] dark:bg-[rgba(184,182,160,0.12)]',
            'font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]',
            'text-text-tertiary',
          )}
          aria-hidden
        >
          A
        </kbd>
        <button
          type="submit"
          aria-label={hasInput ? 'Send question' : 'Open AI chat'}
          className={cn(
            'shrink-0 inline-flex items-center justify-center',
            'h-[26px] w-[26px] rounded-[2px]',
            'border border-text-secondary bg-text-primary text-surface-bg',
            'shadow-[0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]',
            'transition-opacity hover:opacity-90',
            !hasInput && 'opacity-60',
          )}
        >
          <ArrowUp className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
