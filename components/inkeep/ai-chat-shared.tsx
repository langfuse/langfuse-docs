'use client';

import { type ComponentProps, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/ui/link';
import type { InkeepUIMessage, ProvideLinksData } from '@/lib/ai/inkeep-qa-schema';
import { Markdown } from './markdown';

export const AI_CHAT_EXAMPLE_QUESTIONS = [
  'How can Langfuse help me?',
  'How to use the Python decorator for tracing?',
  'How to set up LLM-as-a-judge evals?',
] as const;

const THINKING_PHRASES = [
  'Pondering',
  'Rummaging through docs',
  'Consulting the traces',
  'Evaluating options',
  'Searching the knowledge base',
  'Warming up neurons',
  'Digging deeper',
  'Almost there',
] as const;

export function ThinkingIndicator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % THINKING_PHRASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="not-prose flex items-start gap-3" role="status" aria-label="AI is thinking">
      <img src="/brand-assets/icon/color/langfuse-icon.png" alt="Langfuse" className="size-5 mt-0.5 shrink-0" />
      <p className="text-sm text-text-tertiary animate-pulse" aria-hidden="true">
        {THINKING_PHRASES[index]}
        <span className="ellipsis-dots" />
      </p>
    </div>
  );
}

function AssistantLabel() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <img src="/brand-assets/icon/color/langfuse-icon.png" alt="" className="size-4" />
      <span>Langfuse Help Agent</span>
    </span>
  );
}

type AIChatMessageProps = {
  message: InkeepUIMessage;
  /** Stops clicks from closing a parent overlay (e.g. search panel backdrop). */
  captureClicks?: boolean;
} & Omit<ComponentProps<'div'>, 'children'>;

export function AIChatMessage({
  message,
  captureClicks,
  className,
  onClick,
  ...props
}: AIChatMessageProps) {
  let markdown = '';
  let links: ProvideLinksData['links'] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      markdown += part.text;
      continue;
    }
    if (part.type === 'tool-provideLinks' && part.input) {
      links = (part.input as ProvideLinksData).links;
    }
  }

  const isUser = message.role === 'user';

  return (
    <div
      {...props}
      className={cn(
        isUser ? 'flex justify-end' : 'flex justify-start',
        className,
      )}
      onClick={(e) => {
        if (captureClicks) e.stopPropagation();
        onClick?.(e);
      }}
    >
      <div className={cn(
        isUser
          ? 'max-w-[85%] rounded-2xl rounded-br-sm border border-line-structure bg-surface-2 px-3 py-2'
          : 'max-w-full',
      )}>
        {!isUser && (
          <p className="mb-1 text-sm font-medium text-primary">
            {message.role === 'assistant' ? <AssistantLabel /> : 'unknown'}
          </p>
        )}
        <div className={cn('prose text-sm', isUser && 'prose-p:my-0')}>
          <Markdown text={markdown} />
        </div>
        {links && links.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {links.map((item, i) => (
              <Link
                key={i}
                href={item.url}
                className="flex items-baseline gap-1.5 text-[11px] leading-tight border border-line-structure rounded-sm px-2 py-1.5 hover:bg-surface-2 text-text-secondary no-underline"
              >
                <span className="text-text-tertiary shrink-0">[{item.label}]</span>
                <span className="font-medium truncate min-w-0">{item.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type AIChatEmptyStateProps = {
  onPickQuestion: (question: string) => void;
};

export function AIChatEmptyState({ onPickQuestion }: AIChatEmptyStateProps) {
  return (
    <div className="size-full flex flex-col justify-start gap-4 not-prose">
      <div className="flex items-start gap-3">
        <img src="/brand-assets/icon/color/langfuse-icon.png" alt="Langfuse" className="size-6 shrink-0" />
        <Text size="s" className="text-text-primary text-left mb-2">
          Hi! I&apos;m Langfuse&apos;s AI assistant trained on documentation, help articles, and other
          content. How can I help you today?
        </Text>
      </div>
      <div className="flex flex-wrap gap-2">
        {AI_CHAT_EXAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            className={cn(
              'relative inline-flex min-h-[26px] max-w-full items-center rounded-[2px] shadow-none',
              'border border-line-structure dark:border-line-cta',
              'with-stripes box-corners--on-hover',
              'px-2 py-1 text-left font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]',
              'text-text-secondary transition-colors hover:text-text-primary',
              'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
            onClick={() => onPickQuestion(question)}
          >
            <span className="relative z-[1]">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
