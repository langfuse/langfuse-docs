'use client';

import type { ComponentProps } from 'react';
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

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'langfuse',
};

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

  return (
    <div
      {...props}
      className={cn(className)}
      onClick={(e) => {
        if (captureClicks) e.stopPropagation();
        onClick?.(e);
      }}
    >
      <p
        className={cn(
          'mb-1 text-sm font-medium text-text-tertiary',
          message.role === 'assistant' && 'text-primary',
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className="prose text-sm">
        <Markdown text={markdown} />
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-center gap-1">
          {links.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className="block text-xs border border-line-structure p-3 hover:bg-surface-2 text-text-secondary no-underline"
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-text-tertiary">Reference {item.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

type AIChatEmptyStateProps = {
  onPickQuestion: (question: string) => void;
};

export function AIChatEmptyState({ onPickQuestion }: AIChatEmptyStateProps) {
  return (
    <div className="size-full flex flex-col justify-start gap-4">
      <div className="flex items-start gap-3">
        <img src="/brand-assets/icon/color/langfuse-icon.png" alt="Langfuse" className="size-6" />
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
