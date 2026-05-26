"use client";

import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <button
        type="button"
        onClick={handleScrollToBottom}
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] inline-flex items-center justify-center size-8 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-text-primary shadow-sm hover:bg-[#403d3926] dark:hover:bg-[#b8b6a026] hover:border-line-cta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        <ArrowDownIcon className="size-4" />
      </button>
    )
  );
};
